import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType, createScene } from './helpers/api';

test.describe('Smart Scene Items interaction', () => {
  let sceneName: string;
  let layoutName: string;
  let layoutId: string;

  test.beforeAll(async ({ request }) => {
    // 1. Create a display type
    const dt = await createDisplayType(request, {
      name: 'E2E Item Test Display',
      width_mm: 100,
      height_mm: 100
    });

    // 2. Create a layout with a display
    const layout = await createLayout(request, {
      name: 'E2E Item Test Layout',
      canvas_width_mm: 200,
      canvas_height_mm: 200,
      items: [
        { id: 'd1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' }
      ]
    });
    layoutName = layout.name;
    layoutId = layout.id;

    // 3. Create a scene
    sceneName = `Item Test Scene ${Date.now()}`;
    await createScene(request, {
      name: sceneName,
      layout: layout.id
    });
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

  test('should support item selection and opening settings dialog', async ({ page }) => {
    // 1. Add an item first
    // Select the display in layout-editor
    const box = page.locator('layout-box[data-id="d1"]');
    await box.waitFor({ state: 'visible' });
    await box.dispatchEvent('mousedown');
    await expect(box).toHaveAttribute('selected', '');
    
    // Click "New Single Display"
    await page.locator('button[title="New Single Display"]').click();
    
    // Verify item appeared in the list
    const item = page.locator('.placeholder-item').first();
    await expect(item).toBeVisible();
    await expect(item).toContainText('Scene Item #1');

    // 2. Test Selection
    await item.click();
    await expect(item).toHaveClass(/selected/);
    
    // Verify Edit button is now enabled
    const editBtn = page.locator('button[title="Edit Item"]');
    await expect(editBtn).toBeEnabled();

    // 3. Test Toolbar Button Trigger
    await editBtn.click();
    
    // Wait for the native dialog to be visible inside the component
    const dialog = page.locator('scene-item-settings-dialog');
    const nativeDialog = dialog.locator('dialog');
    await expect(nativeDialog).toBeVisible();
    await expect(dialog).toContainText('Scaling Factor');
    
    // Close with Cancel
    await dialog.locator('button:has-text("Cancel")').click();
    await expect(nativeDialog).not.toBeVisible();

    // 4. Test Double-Click Trigger
    await item.dblclick();
    await expect(nativeDialog).toBeVisible();
    
    // Close with Save Changes
    await dialog.locator('button:has-text("Save Changes")').click();
    await expect(nativeDialog).not.toBeVisible();
  });

});
