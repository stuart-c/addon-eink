import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType, createScene } from './helpers/api';

test.describe('Display Numbering Visibility', () => {
  test.slow();
  let sceneName: string;
  let layoutName: string;
  let layoutId: string;

  test.beforeAll(async ({ request }) => {
    const dt = await createDisplayType(request, {
      name: `Z-DT-${Date.now()}`,
      width_mm: 100,
      height_mm: 100
    });

    layoutName = `Z-LYT-${Date.now()}`;
    const layout = await createLayout(request, {
      name: layoutName,
      canvas_width_mm: 200,
      canvas_height_mm: 200,
      items: [
        { id: 'd1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' }
      ]
    });
    layoutId = layout.id;

    sceneName = `Z-SCN-${Date.now()}`;
    await createScene(request, {
      name: sceneName,
      layout: layout.id
    });
  });

  test('should NOT show display numbers on the scene page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Scenes
    await page.locator('button[title="Scenes"]').click();
    await expect(page.locator('scenes-view')).toBeVisible();
    
    // Select the layout filter so our scene appears
    const dropdown = page.locator('.layout-select');
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption(layoutId);
    
    // Select the test scene
    const sidebarItem = page.locator('sidebar-list .sidebar-item').filter({ hasText: sceneName });
    await expect(sidebarItem).toBeVisible({ timeout: 20000 });
    await sidebarItem.click();
    
    // Wait for title to update
    await expect(page.locator('.toolbar-title')).toContainText(sceneName, { timeout: 15000 });
    
    // Wait for layout editor to render
    await expect(page.locator('layout-editor')).toBeVisible();
    
    // Check for display number in layout box
    // It should NOT be present.
    const layoutBox = page.locator('layout-box[data-id="d1"]');
    await expect(layoutBox).toBeVisible();
    
    // The .item-number div should not exist or be empty if it's conditionally rendered
    const itemNumber = layoutBox.locator('.item-number');
    await expect(itemNumber).not.toBeAttached();
  });

  test('should STILL show display numbers on the layouts page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Layouts
    await page.locator('button[title="Layouts"]').click();
    await expect(page.locator('layouts-view')).toBeVisible();
    
    // Select the test layout
    const sidebarItem = page.locator('sidebar-list .sidebar-item').filter({ hasText: layoutName });
    await expect(sidebarItem).toBeVisible({ timeout: 20000 });
    await sidebarItem.click();
    
    // Wait for title to update
    await expect(page.locator('.toolbar-title')).toContainText(layoutName, { timeout: 15000 });
    
    // Wait for layout editor to render
    await expect(page.locator('layout-editor')).toBeVisible();
    
    // Check for display number in layout box
    // On the layouts page, it SHOULD be present.
    const layoutBox = page.locator('layout-box[data-id="d1"]');
    await expect(layoutBox).toBeVisible();
    
    const itemNumber = layoutBox.locator('.item-number');
    await expect(itemNumber).toBeAttached();
    await expect(itemNumber).toContainText('1');
  });
});
