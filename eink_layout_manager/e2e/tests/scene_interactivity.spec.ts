import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType } from './helpers/api';

test.describe('Scene Interactivity', () => {
  let displayTypeId: string;
  let layoutId: string;
  let layoutName: string;

  test.beforeAll(async ({ request }) => {
    const dt = await createDisplayType(request, {
      name: 'Interactivity Test Display',
      width_mm: 50,
      height_mm: 30
    });
    displayTypeId = dt.id;

    const layout = await createLayout(request, {
      id: `interact-layout-${Date.now()}`,
      name: 'Interactivity Test Layout',
      canvas_width_mm: 200,
      canvas_height_mm: 100,
      items: [
        { id: 'disp-1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' }
      ]
    });
    layoutId = layout.id;
    layoutName = layout.name;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button[title="Scenes"]').click();
    await expect(page.locator('scenes-view')).toBeVisible();
  });

  test('should allow interacting with displays to manage scene items', async ({ page }) => {
    const sceneName = `Interactivity Scene ${Date.now()}`;

    // 1. Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: layoutName });
    await page.locator('scene-dialog button.primary').click();
    
    // 2. Select it
    await page.locator('.sidebar-item').getByText(sceneName).click();
    
    // 3. Add a scene item
    const box = page.locator('layout-box[data-id="disp-1"]');
    await box.click();
    await page.locator('button[title="New Single Display"]').click();
    await expect(page.locator('app-header')).toContainText(/Added.+item/i, { timeout: 10000 });
    
    const itemList = page.locator('.placeholder-item');
    await expect(itemList).toHaveCount(1);
    const item = itemList.first();

    // Clear selection
    await page.mouse.click(0, 0);
    await expect(item).not.toHaveClass(/selected/);

    // 4. Test Single Click to Select
    await box.click();
    await expect(item).toHaveClass(/selected/);

    // 5. Test Hover to Highlight
    await page.mouse.move(0, 0); // Reset hover
    await expect(item).not.toHaveAttribute('style', /background: #f0faff/); // Assuming some hover style, but let's check class or state
    // Actually our css for hover is:
    // .placeholder-item:hover { border-color: var(--primary-colour); background: #f0faff; }
    // But we want to check the _hoveredItemId state.
    
    await box.hover();
    await expect(item).toHaveClass(/hovered/);
    
    // 6. Test Double Click to Open Dialog
    await box.dblclick();
    await expect(page.locator('scene-item-settings-dialog base-dialog')).toBeVisible();
    
    // 7. Test Delete Button in Dialog
    const deleteBtn = page.locator('scene-item-settings-dialog button.danger').getByText('Delete Item');
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
    
    // Confirm deletion
    await expect(page.locator('confirm-dialog')).toBeVisible();
    await page.locator('confirm-dialog button.danger').click();
    
    // Verify item is gone
    await expect(itemList).toHaveCount(0);
    await expect(page.locator('app-header')).toContainText(/Scene item removed/i);
  });
});
