import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a unique PNG buffer to avoid duplicate hash detection in backend.
 */
function createUniquePng() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  // We'll create a slightly larger buffer with random data to ensure unique hash
  const header = Buffer.from('89504e470d0a1a0a', 'hex'); // PNG header
  const data = Buffer.from(`${timestamp}-${random}`);
  return Buffer.concat([header, data]);
}

test.describe('Image Library Management', () => {
  const tempDir = path.join(__dirname, 'temp_test_images');

  test.beforeAll(async () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  });

  test.afterAll(async () => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Navigate to Images section
    const imagesNav = page.locator('#nav-images');
    await imagesNav.click();
    
    // Verify we are on the Images page
    await expect(page.locator('images-view')).toBeVisible({ timeout: 15000 });
  });

  async function uploadImage(page, dialog, imageNamePrefix = 'Test Image') {
    const imageName = `${imageNamePrefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fileName = `test-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
    const filePath = path.join(tempDir, fileName);
    
    // Generate a unique file every time to avoid 409 Conflict
    fs.writeFileSync(filePath, createUniquePng());

    // Click Add New Item in header
    await page.locator('#btn-header-add').click();
    await expect(dialog.locator('base-dialog h2')).toBeVisible({ timeout: 15000 });

    // Perform upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await dialog.locator('.upload-section').click();
    const fileChooser = await fileChooserPromise;
    
    const uploadResponsePromise = page.waitForResponse(resp => 
        resp.url().includes('/api/image') && resp.request().method() === 'POST' && (resp.status() === 201 || resp.status() === 200),
        { timeout: 60000 }
    );
    await fileChooser.setFiles(filePath);
    await uploadResponsePromise;

    // Fill name (optionally)
    await dialog.locator('#image-name-input').fill(imageName);
    
    return { imageName, filePath };
  }

  test('should upload a new image and set metadata', async ({ page }) => {
    const dialog = page.locator('image-dialog');
    const artist = 'E2E Artist';
    const collection = 'E2E Collection';
    const description = 'This is a test image uploaded during E2E tests.';

    const { imageName } = await uploadImage(page, dialog);

    // Fill rest of metadata
    await dialog.locator('#image-artist-input').fill(artist);
    await dialog.locator('#image-collection-input').fill(collection);
    await dialog.locator('#image-description-textarea').fill(description);

    // Save
    const saveBtn = dialog.locator('#btn-image-save');
    await saveBtn.click();

    // Verify success toast/message in header
    await expect(page.locator('app-header')).toContainText(/saved/i, { timeout: 30000 });

    // Verify image appears in the grid
    const imageCard = page.locator('images-view .image-card').filter({ hasText: imageName });
    await expect(imageCard).toBeVisible({ timeout: 30000 });
  });

  test('should edit an existing image metadata', async ({ page }) => {
    const dialog = page.locator('image-dialog');
    const { imageName } = await uploadImage(page, dialog, 'EditTest');
    
    await dialog.locator('#btn-image-save').click();
    
    // Wait for it to disappear and then show up in grid
    await expect(dialog).toBeHidden({ timeout: 15000 });
    const imageCard = page.locator('images-view .image-card').filter({ hasText: imageName });
    await expect(imageCard).toBeVisible({ timeout: 15000 });

    // Double click the image to edit
    await imageCard.dblclick();

    // Verify dialog is visible in edit mode
    await expect(dialog.locator('base-dialog h2')).toContainText('Edit Image');
    await expect(dialog.locator('#image-name-input')).toHaveValue(imageName);

    // Modify artist
    const newArtist = 'Modified Artist';
    await dialog.locator('#image-artist-input').fill(newArtist);

    // Save
    await dialog.locator('#btn-image-save').click();

    // Verify success
    await expect(page.locator('app-header')).toContainText(/saved/i, { timeout: 15000 });

    // Re-open and verify change
    await imageCard.dblclick();
    await expect(dialog.locator('#image-artist-input')).toHaveValue(newArtist);
    await dialog.locator('#btn-cancel').click();
  });

  test('should filter images by various fields', async ({ page }) => {
    const uniqueId = Date.now();
    const artist = `Artist_${uniqueId}`;
    const collection = `Collection_${uniqueId}`;

    const dialog = page.locator('image-dialog');

    // Upload image 1
    const { imageName: name1 } = await uploadImage(page, dialog, 'Filter1');
    await dialog.locator('#image-artist-input').fill(artist);
    await dialog.locator('#btn-image-save').click();
    await expect(dialog).toBeHidden({ timeout: 15000 });

    // Upload image 2
    const { imageName: name2 } = await uploadImage(page, dialog, 'Filter2');
    await dialog.locator('#image-collection-input').fill(collection);
    await dialog.locator('#btn-image-save').click();
    await expect(dialog).toBeHidden({ timeout: 15000 });

    // Filter by Artist
    await page.locator('#filter-artist').fill(artist);
    await expect(page.locator('images-view .image-card').filter({ hasText: name1 })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('images-view .image-card').filter({ hasText: name2 })).not.toBeVisible();

    // Reset Filters
    await page.locator('button').getByText('Reset Filters').click();
    await expect(page.locator('images-view .image-card').filter({ hasText: name1 })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('images-view .image-card').filter({ hasText: name2 })).toBeVisible({ timeout: 15000 });

    // Filter by Collection
    await page.locator('#filter-collection').fill(collection);
    await expect(page.locator('images-view .image-card').filter({ hasText: name1 })).not.toBeVisible();
    await expect(page.locator('images-view .image-card').filter({ hasText: name2 })).toBeVisible({ timeout: 15000 });
  });

  test('should sort images', async ({ page }) => {
    const dialog = page.locator('image-dialog');
    
    // Upload two images with names A and B
    const { imageName: nameA } = await uploadImage(page, dialog, 'Sort_A');
    await dialog.locator('#btn-image-save').click();
    await expect(dialog).toBeHidden({ timeout: 15000 });

    const { imageName: nameB } = await uploadImage(page, dialog, 'Sort_B');
    await dialog.locator('#btn-image-save').click();
    await expect(dialog).toBeHidden({ timeout: 15000 });

    // Get all image names
    const names = page.locator('images-view .image-name');
    
    // Sort A should come before Sort B (alphabetical)
    await expect(async () => {
        const allNames = await names.allInnerTexts();
        const relevantNames = allNames.filter(n => n.startsWith('Sort_'));
        const indexA = relevantNames.findIndex(n => n.startsWith('Sort_A'));
        const indexB = relevantNames.findIndex(n => n.startsWith('Sort_B'));
        expect(indexA).toBeGreaterThan(-1);
        expect(indexB).toBeGreaterThan(-1);
        expect(indexA).toBeLessThan(indexB);
    }).toPass({ timeout: 15000 });

    // Toggle sort to Name DESC (click the arrow icon in Sort Priority sidebar)
    await page.locator('images-view .sort-item:has-text("Name") .sort-action').first().click();
    
    // Verify reversed order
    await expect(async () => {
        const allNamesDesc = await names.allInnerTexts();
        const relevantNamesDesc = allNamesDesc.filter(n => n.startsWith('Sort_'));
        const indexADesc = relevantNamesDesc.findIndex(n => n.startsWith('Sort_A'));
        const indexBDesc = relevantNamesDesc.findIndex(n => n.startsWith('Sort_B'));
        expect(indexBDesc).toBeLessThan(indexADesc);
    }).toPass({ timeout: 15000 });
  });

  test('should delete an image', async ({ page }) => {
    const dialog = page.locator('image-dialog');
    const { imageName } = await uploadImage(page, dialog, 'ToDelete');
    
    await dialog.locator('#btn-image-save').click();
    await expect(dialog).toBeHidden({ timeout: 15000 });

    // Select the image
    const imageCard = page.locator('images-view .image-card').filter({ hasText: imageName });
    await imageCard.click();
    await expect(imageCard).toHaveClass(/selected/);

    // Click Delete in header
    await page.locator('#btn-header-delete').click();

    // Confirm in dialog
    await expect(page.getByText('Delete Image?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    // Verify success message
    await expect(page.locator('app-header')).toContainText(/deleted/i, { timeout: 15000 });

    // Verify it is gone from grid
    await expect(imageCard).not.toBeVisible({ timeout: 15000 });
  });
});
