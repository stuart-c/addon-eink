import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType, createScene, createImage } from './helpers/api';

test.describe('Scene Item Pips and Preview', () => {
  let sceneName: string;
  let layoutId: string;
  let sceneId: string;
  let imageId: string;
  let displayId = 'd1';

  test.beforeAll(async ({ request }) => {
    // 1. Create a display type
    const dt = await createDisplayType(request, {
      name: 'Pips Test Display',
      width_mm: 100,
      height_mm: 100
    });

    // 2. Create a layout with a display
    const layout = await createLayout(request, {
      name: 'Pips Test Layout',
      canvas_width_mm: 200,
      canvas_height_mm: 200,
      items: [
        { id: displayId, display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' }
      ]
    });
    layoutId = layout.id;

    // 3. Create an image
    const img = await createImage(request);
    imageId = img.id;

    // 4. Create a scene with this image assigned to display d1
    sceneName = `Pips Test Scene ${Date.now()}`;
    const scene = await createScene(request, {
      name: sceneName,
      layout: layoutId,
      items: [
        {
          id: 'item1',
          type: 'image',
          displays: [displayId],
          images: [
            { image_id: imageId, scaling_factor: 100, offset: { x: 0, y: 0 } }
          ]
        }
      ]
    } as any);
    sceneId = scene.id;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button[title="Scenes"]').click();
    await expect(page.locator('scenes-view')).toBeVisible();
    
    // Select the layout filter so our scene appears
    const dropdown = page.locator('.layout-select');
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption(layoutId);
    
    // Select our test scene
    const sidebarItem = page.locator('sidebar-list .sidebar-item').getByText(sceneName);
    await sidebarItem.click();
    await expect(page.locator('.toolbar-title')).toContainText(sceneName);
  });

  test('should display pips only when slices are available', async ({ page }) => {
    // Initially, slices might not exist (background processor hasn't run)
    // So let's mock the slice API to return EMPTY first, then return the slice
    
    // 1. Initially no pip
    let queueCount = 1; // Set queue to 1 so the frontend polls it frequently
    await page.route(`**/api/scene/${sceneId}/queue`, async route => {
      await route.fulfill({ json: { count: queueCount } });
    });

    await page.route(`**/api/scene/${sceneId}/slice`, async route => {
      await route.fulfill({ json: [] });
    });
    
    // Refresh scene view by re-selecting or just waiting for poll
    // But poll is 5s, let's just wait a bit
    await page.waitForTimeout(1000); 
    const item = page.locator('.placeholder-item').first();
    await expect(item.locator('.pip')).toHaveCount(0);

    // 2. Now mock with a slice available
    await page.route(`**/api/scene/${sceneId}/slice`, async route => {
      await route.fulfill({ 
        json: [{ display_id: displayId, image_id: imageId, file_hash: 'mockhash' }] 
      });
    });

    // 3. Decrement queue count to trigger the frontend to fetch slices
    queueCount = 0;

    // Wait for poll (or we could trigger a refresh by switching scenes, but let's wait)
    // Actually, let's just wait for the pip to appear (poll is 5s)
    await expect(item.locator('.pip')).toBeVisible({ timeout: 10000 });
    await expect(item.locator('.pip')).toHaveCount(1);
    
    // 3. Hover over pip should show tooltip
    await item.locator('.pip').hover();
    const tooltip = page.locator('.pip-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('test-image.png');
    await expect(tooltip.locator('img')).toBeVisible();

    // 4. Click pip should select it and update layout preview
    // Mock the binary slice download too
    await page.route(`**/api/scene/${sceneId}/slice/${displayId}/${imageId}**`, async route => {
      // Just return a tiny red pixel PNG
      const redPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      await route.fulfill({
        contentType: 'image/png',
        body: Buffer.from(redPixelBase64, 'base64')
      });
    });

    await item.locator('.pip').click();
    await expect(item.locator('.pip')).toHaveClass(/selected/);

    // Verify layout-box has the preview image
    const box = page.locator(`layout-box[data-id="${displayId}"]`);
    const preview = box.locator('hardware-preview');
    // We can't easily check the background-image content, but we can check if it's set
    // Actually, let's check the style attribute if possible, or just assume it works if no error
    // In our implementation, HardwarePreview renders the background-image
    const panel = preview.locator('.preview-display');
    await expect(panel).toHaveAttribute('style', /background-image: url/);
    await expect(panel).toHaveAttribute('style', /mockhash/);

    // 5. Deselecting pip
    await item.locator('.pip').click();
    await expect(item.locator('.pip')).not.toHaveClass(/selected/);
    await expect(panel).not.toHaveAttribute('style', /mockhash/);
  });
});
