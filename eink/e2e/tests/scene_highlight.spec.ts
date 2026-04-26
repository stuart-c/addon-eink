import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType } from './helpers/api';

test.describe('Scene Display Highlighting', () => {
  let displayTypeId: string;
  let layoutId: string;
  let layoutName: string;

  test.beforeAll(async ({ request }) => {
    // 1. Create a display type
    const dt = await createDisplayType(request, {
      name: 'Highlight Test Display',
      width_mm: 50,
      height_mm: 30
    });
    displayTypeId = dt.id;

    // 2. Create a layout with two displays
    const layout = await createLayout(request, {
      id: `highlight-layout-${Date.now()}`,
      name: 'Highlight Test Layout',
      canvas_width_mm: 200,
      canvas_height_mm: 100,
      items: [
        { id: 'disp-1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' },
        { id: 'disp-2', display_type_id: dt.id, x_mm: 70, y_mm: 10, orientation: 'landscape' }
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

  test('should highlight displays on hover and selection', async ({ page }) => {
    const sceneName = `Highlight Scene ${Date.now()}`;

    // 1. Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: layoutName });
    await page.locator('scene-dialog button.primary').click();
    
    // 2. Select it
    await page.locator('.sidebar-item').getByText(sceneName).click();
    await expect(page.locator('.toolbar-title')).toContainText(sceneName);

    // 3. Add two single-display items
    const box1 = page.locator('layout-box[data-id="disp-1"]');
    const box2 = page.locator('layout-box[data-id="disp-2"]');
    
    await box1.click();
    await page.locator('button[title="New Single Display"]').click();
    await expect(page.locator('app-header')).toContainText(/Added.+item/i, { timeout: 10000 });
    
    await box2.click();
    await page.locator('button[title="New Single Display"]').click();
    await expect(page.locator('app-header')).toContainText(/Added.+item/i, { timeout: 10000 });
    
    const items = page.locator('.placeholder-item');
    await expect(items).toHaveCount(2);

    // 4. Test Selection Highlight
    // Select the first item
    await items.first().click();
    await expect(items.first()).toHaveClass(/selected/);
    
    // Verify disp-1 is highlighted, disp-2 is not
    await expect(box1).toHaveAttribute('highlighted', '');
    await expect(box2).not.toHaveAttribute('highlighted', '');

    // Select the second item
    await items.nth(1).click();
    await expect(items.nth(1)).toHaveClass(/selected/);
    
    // Verify disp-2 is highlighted, disp-1 is not
    await expect(box2).toHaveAttribute('highlighted', '');
    await expect(box1).not.toHaveAttribute('highlighted', '');

    // 5. Test Hover Override
    // While second item is selected (disp-2 highlighted), hover over the first item
    await items.first().hover();
    
    // Verify disp-1 is NOW highlighted (hover overrides selection)
    // Wait a beat for the reactive property to update if needed
    await expect(box1).toHaveAttribute('highlighted', '');
    // Verify disp-2 is NO LONGER highlighted
    await expect(box2).not.toHaveAttribute('highlighted', '');

    // Stop hovering
    await page.mouse.move(0, 0); 
    
    // Verify disp-2 is highlighted again (fallback to selection)
    await expect(box2).toHaveAttribute('highlighted', '');
    await expect(box1).not.toHaveAttribute('highlighted', '');
  });
});
