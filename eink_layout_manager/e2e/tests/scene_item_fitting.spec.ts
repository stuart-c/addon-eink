import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType, createScene, createImage } from './helpers/api';

test.describe('Scene Item Fitting', () => {
  let sceneName: string;
  let imageName: string;
  let imageId: string;

  test.beforeAll(async ({ request }) => {
    // 1. Create a display type: 100x100mm frame, 80x80mm panel, 100x100px resolution (1px/mm)
    const dt = await createDisplayType(request, {
      name: 'Fitting Test Display',
      width_mm: 100,
      height_mm: 100,
      panel_width_mm: 80,
      panel_height_mm: 80,
      width_px: 100,
      height_px: 100
    });

    // 2. Create a layout with this display
    const layout = await createLayout(request, {
      name: 'Fitting Test Layout',
      canvas_width_mm: 200,
      canvas_height_mm: 200,
      items: [
        { id: 'd1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' }
      ]
    });

    // 3. Create a scene
    sceneName = `Fitting Test Scene ${Date.now()}`;
    await createScene(request, {
      name: sceneName,
      layout: layout.id
    });

    // 4. Create an image
    const image = await createImage(request, 'fitting-test.png');
    imageName = image.name;
    imageId = image.id;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button[title="Scenes"]').click();
    await page.locator('sidebar-list .sidebar-item').getByText(sceneName).click();
  });

  test('should automatically fit a new image when added to an item', async ({ page }) => {
    // 1. Add an item
    await page.locator('layout-box[data-id="d1"]').dispatchEvent('mousedown');
    await page.locator('button[title="New Single Display"]').click();
    
    // 2. Open settings
    const item = page.locator('.placeholder-item').first();
    await item.dblclick();
    
    const dialog = page.locator('scene-item-settings-dialog');
    await expect(dialog.locator('dialog')).toBeVisible();

    // 3. Add image from library
    await dialog.locator('button[title="Add Image"]').click();
    await expect(dialog.locator('.image-grid')).toBeVisible();
    
    // Click our test image
    await dialog.locator(`.image-card:has-text("${imageName}")`).click();
    
    // 4. Verify auto-fit: Check that scaling factor is updated
    const scalingInput = dialog.locator('input[type="number"]').first();
    const scalingValue = await scalingInput.inputValue();
    
    expect(parseInt(scalingValue)).not.toBe(100);
    
    // Check offsets are 0
    const offsetXInput = dialog.locator('input[type="number"]').nth(1);
    const offsetYInput = dialog.locator('input[type="number"]').nth(2);
    await expect(offsetXInput).toHaveValue('0');
    await expect(offsetYInput).toHaveValue('0');

    // 5. Test the FIT button
    // Change scaling factor manually
    await scalingInput.fill('123');
    await expect(scalingInput).toHaveValue('123');
    
    // Click FIT
    await dialog.locator('button:has-text("FIT")').click();
    
    // Verify it returned to the auto-fitted value
    await expect(scalingInput).toHaveValue(scalingValue);
  });
});
