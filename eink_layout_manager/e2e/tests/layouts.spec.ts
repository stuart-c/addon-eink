import { test, expect } from '@playwright/test';
import { createDisplayType } from './helpers/api.js';

test.describe('Layouts Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Navigate to Layouts section
    const layoutsNav = page.locator('button[title="Layouts"]');
    await layoutsNav.click();
    
    // Verify we are on the Layouts page
    await expect(page.locator('layouts-view')).toBeVisible();
  });

  test('should create a new layout', async ({ page }) => {
    const uniqueId = Date.now();
    const layoutName = `E2E Layout ${uniqueId}`;
    
    // Ensure no stale toasts
    await expect(page.locator('app-header .message-badge')).not.toBeVisible();

    // Click Add New Item
    await page.locator('button[title="Add New Item"]').click();
    
    // Verify dialog appears
    const dialog = page.locator('layout-settings-dialog');
    await expect(dialog.getByRole('heading', { name: 'Layout Settings' })).toBeVisible();
    
    // Fill in the form
    await dialog.locator('input[type="text"]').fill(layoutName);
    
    // Explicitly fill dimensions and grid snap to ensure form validity
    await dialog.locator('input[type="number"]').nth(0).fill('600'); // Width
    await dialog.locator('input[type="number"]').nth(1).fill('400'); // Height
    
    // Select grid snap using the slider component if it exists, otherwise just skip (default is 5)
    const gridSlider = dialog.locator('grid-snap-slider');
    if (await gridSlider.isVisible()) {
      await gridSlider.locator('.label-item').filter({ hasText: '10mm' }).click();
    } else {
      await dialog.locator('input[type="number"]').nth(2).fill('10');
    }
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    
    // Verify dialog-level success message
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    // NOW click the actual "Save Changes" (Cloud/Floppy) in the top header
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify final backend-level success message
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Verify name appears in the toolbar dropdown trigger
    await expect(page.locator('#trigger-layouts span')).toHaveText(layoutName);
  });

  test('should update layout settings', async ({ page }) => {
    // Create a layout via UI first to be sure
    const uniqueId = Date.now();
    const layoutName = `Layout ${uniqueId}`;
    
    // Ensure no stale toasts
    await expect(page.locator('app-header .message-badge')).not.toBeVisible();

    await page.locator('button[title="Add New Item"]').click();
    await page.locator('layout-settings-dialog input[type="text"]').fill(layoutName);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('600');
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('400');
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    await page.locator('button[title="Save Changes"]').click();
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Click Edit Layout (Settings icon)
    await page.locator('button[title="Layout Settings"]').click();
    
    // Change name and refill other fields just in case
    const newName = `Edited ${uniqueId}`;
    await page.locator('layout-settings-dialog input[type="text"]').fill(newName);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('800'); // Width
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('600'); // Height
    
    // Save Settings in dialog
    await page.getByRole('button', { name: 'Save Settings' }).click();
    
    // Verify dialog-level success message
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    // Now click main save
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify backend-level success message
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    
    // Verify name updated in toolbar
    await expect(page.locator('#trigger-layouts span')).toHaveText(newName);
  });

  test('should add a display type to the layout', async ({ page, request }) => {
    // Ensure we have a unique display type
    const uniqueId = Date.now();
    const dtName = `Draggable DT ${uniqueId}`;
    await createDisplayType(request, { name: dtName });
    
    // Create a layout
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('layout-settings-dialog input[type="text"]').fill(`Item Test Layout ${uniqueId}`);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('600');
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('400');
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    await page.locator('button[title="Save Changes"]').click();
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Open the "Add Display" dropdown in the toolbar
    await page.locator('button[title="Add Display Type"]').click();
    
    // Click the display type in the dropdown
    const menuItem = page.locator('#menu-display-types .display-type-item').filter({ hasText: dtName });
    await menuItem.click();
    
    // Verify an item appeared in the layout-editor (layout-box)
    await expect(page.locator('layout-box')).toBeVisible();
    
    // Verify it appeared in the sidebar "Layout Items"
    await expect(page.locator('side-bar .item-name')).toContainText(dtName);
    
    // Save changes
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify success toast
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
  });

  test('should delete an item from the layout', async ({ page, request }) => {
    const uniqueId = Date.now();
    const dtName = `Deletable Item DT ${uniqueId}`;
    await createDisplayType(request, { name: dtName });
    
    // Create a layout
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('layout-settings-dialog input[type="text"]').fill(`Deletion Layout ${uniqueId}`);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('600');
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('400');
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    await page.locator('button[title="Save Changes"]').click();
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Add item via toolbar
    await page.locator('button[title="Add Display Type"]').click();
    await page.locator('#menu-display-types .display-type-item').filter({ hasText: dtName }).click();
    
    // The item should appear in the sidebar
    const layoutItemInSidebar = page.locator('side-bar .list-item').filter({ hasText: dtName });
    await expect(layoutItemInSidebar).toBeVisible();
    
    // Select the item
    await layoutItemInSidebar.click();
    
    // Click the "Settings" button in the sidebar for this item
    await layoutItemInSidebar.locator('button[title="Settings"]').click();
    
    // Click Delete in the Item Settings Dialog
    await page.locator('item-settings-dialog button.danger').click();
    
    // Verify confirmation dialog
    await expect(page.locator('confirm-dialog').getByText('Delete display?')).toBeVisible({ timeout: 10000 });
    await page.locator('confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    
    // Verify success toast
    await expect(page.locator('app-header').getByText('Item deleted')).toBeVisible({ timeout: 10000 });
    
    // Verify item is gone
    await expect(layoutItemInSidebar).not.toBeVisible();
    await expect(page.locator('layout-box')).not.toBeVisible();
  });

  test('should show dirty state warning when navigating away', async ({ page, request }) => {
    const uniqueId = Date.now();
    const dtName = `Dirty Warning DT ${uniqueId}`;
    await createDisplayType(request, { name: dtName });

    // Create a layout
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('layout-settings-dialog input[type="text"]').fill(`Dirty Layout ${uniqueId}`);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('600');
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('400');
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    await page.locator('button[title="Save Changes"]').click();
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Add item to layout to make it dirty
    await page.locator('button[title="Add Display Type"]').click();
    await page.locator('#menu-display-types .display-type-item').filter({ hasText: dtName }).click();
    
    // Try to navigate to Display Types
    await page.locator('button[title="Display Types"]').click();
    
    // Verify confirmation dialog
    await expect(page.locator('confirm-dialog').getByText('Discard Changes?')).toBeVisible({ timeout: 10000 });
    
    // Cancel
    await page.locator('confirm-dialog').getByRole('button', { name: 'Cancel' }).click();
    
    // Still on layouts
    await expect(page.locator('layouts-view')).toBeVisible();
  });

  test('should delete a layout', async ({ page }) => {
    // Create one to delete
    const uniqueId = Date.now();
    const layoutName = `To Delete ${uniqueId}`;
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('layout-settings-dialog input[type="text"]').fill(layoutName);
    await page.locator('layout-settings-dialog input[type="number"]').nth(0).fill('600');
    await page.locator('layout-settings-dialog input[type="number"]').nth(1).fill('400');
    
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.locator('app-header').getByText('Settings applied')).toBeVisible({ timeout: 10000 });
    
    await page.locator('button[title="Save Changes"]').click();
    await expect(page.locator('app-header').getByText('Layout saved!')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-header .message-badge')).not.toBeVisible({ timeout: 10000 });

    // Open layout dropdown and select it
    await page.locator('#trigger-layouts').click();
    await page.locator('#menu-layouts .dropdown-item').filter({ hasText: layoutName }).click();
    
    // Click Delete Layout button in the main header toolbar
    await page.locator('button[title="Delete Current Item"]').click();
    
    // Confirm it's the Layout deletion dialog
    await expect(page.locator('confirm-dialog').getByText('Delete Layout?')).toBeVisible({ timeout: 10000 });
    await page.locator('confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    
    // Verify success
    await expect(page.locator('app-header').getByText('deleted.')).toBeVisible({ timeout: 10000 });
    
    // Verify gone from dropdown
    await page.locator('#trigger-layouts').click();
    await expect(page.locator('#menu-layouts .dropdown-item').filter({ hasText: layoutName })).not.toBeVisible();
  });
});
