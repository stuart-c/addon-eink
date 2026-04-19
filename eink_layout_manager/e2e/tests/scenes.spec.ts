import { test, expect } from '@playwright/test';
import { createLayout, createDisplayType } from './helpers/api';

test.describe('Smart Scenes Management', () => {
  let sceneCount = 0;
  const getUniqueName = (prefix: string) => `${prefix} ${++sceneCount} ${Date.now()}`;
  let sharedLayoutName: string;
  let sharedLayoutId: string;

  test.beforeAll(async ({ request }) => {
    // Create a display type first
    const dt = await createDisplayType(request, {
      name: 'E2E Test Display',
      width_mm: 100,
      height_mm: 100
    });

    // Create a layout with two displays for tiling tests
    const layout = await createLayout(request, { 
      id: `shared-layout-${Date.now()}`,
      name: 'Shared Test Layout',
      canvas_width_mm: 300,
      canvas_height_mm: 200,
      items: [
        { id: 'display-1', display_type_id: dt.id, x_mm: 10, y_mm: 10, orientation: 'landscape' },
        { id: 'display-2', display_type_id: dt.id, x_mm: 120, y_mm: 10, orientation: 'landscape' }
      ]
    });
    sharedLayoutName = layout.name;
    sharedLayoutId = layout.id;
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Navigate to Scenes section
    const scenesNav = page.locator('button[title="Scenes"]');
    await scenesNav.click();
    
    // Verify we are on the Scenes page
    await expect(page.locator('scenes-view')).toBeVisible();
  });

  test('should create a new scene with a specific layout', async ({ page }) => {
    const sceneName = getUniqueName('Scene with Layout');
    
    // Click Add New Item
    await page.locator('button[title="Add New Item"]').click();
    
    const dialog = page.locator('scene-dialog');
    await expect(dialog.locator('h2')).toBeVisible();
    
    // Fill in the name
    await dialog.locator('input').fill(sceneName);
    
    // Select the layout
    await dialog.locator('select').selectOption({ label: sharedLayoutName });
    
    // Click Create Scene
    await dialog.locator('button.primary').click();
    
    // Verify it appears in the sidebar and wait for it to be visible
    const sidebarItem = page.locator('.sidebar-item').getByText(sceneName);
    await expect(sidebarItem).toBeVisible();
    
    // Verify toolbar shows the name
    await expect(page.locator('.toolbar-title')).toContainText(sceneName);
  });

  test('should select a scene from the sidebar', async ({ page }) => {
    const name1 = getUniqueName('Scene A');
    const name2 = getUniqueName('Scene B');

    // Create first scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(name1);
    await page.locator('scene-dialog button.primary').click();
    await expect(page.locator('.sidebar-item').getByText(name1)).toBeVisible();
    
    // Create second scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(name2);
    await page.locator('scene-dialog button.primary').click();
    await expect(page.locator('.sidebar-item').getByText(name2)).toBeVisible();
    
    // Select the first one
    await page.locator('.sidebar-item').getByText(name1).click();
    await expect(page.locator('.toolbar-title')).toContainText(name1);
    await expect(page.locator('.sidebar-item.selected')).toContainText(name1);
    
    // Select the second one
    await page.locator('.sidebar-item').getByText(name2).click();
    await expect(page.locator('.toolbar-title')).toContainText(name2);
    await expect(page.locator('.sidebar-item.selected')).toContainText(name2);
  });

  test('should show layout preview when selected', async ({ page }) => {
    const sceneName = getUniqueName('Selection Info');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog button.primary').click();
    
    // Select it
    await page.locator('.sidebar-item').getByText(sceneName).click();
    
    // Verify layout-editor is visible instead of empty-view
    await expect(page.locator('layout-editor')).toBeVisible();
    await expect(page.locator('empty-view')).not.toBeVisible();
  });

  test('should rename an existing scene', async ({ page }) => {
    const originalName = getUniqueName('Original');
    const updatedName = getUniqueName('Updated');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(originalName);
    await page.locator('scene-dialog button.primary').click();
    await expect(page.locator('.sidebar-item').getByText(originalName)).toBeVisible();
    
    // Click Scene Settings (cog)
    await page.locator('button[title="Scene Settings"]').click();
    
    // Verify dialog appears with current name
    const dialog = page.locator('scene-dialog');
    await expect(dialog.locator('h2')).toBeVisible();
    await expect(dialog.locator('input')).toHaveValue(originalName);
    
    // Change name
    await dialog.locator('input').fill(updatedName);
    await dialog.locator('button.primary').click();
    
    // Verify name updated in sidebar and toolbar
    await expect(page.locator('.sidebar-item').getByText(updatedName)).toBeVisible();
    await expect(page.locator('.toolbar-title')).toContainText(updatedName);
  });

  test('should sync changes from scene settings to YAML mode', async ({ page }) => {
    const sceneName = getUniqueName('Sync Test');
    const updatedName = getUniqueName('Synced Name');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog button.primary').click();
    
    // Switch to YAML mode
    await page.locator('button[title="Switch to YAML Mode"]').click();
    await expect(page.locator('yaml-editor')).toBeVisible();
    
    // Verify initial YAML has the name
    const yamlEditor = page.locator('yaml-editor');
    await expect(yamlEditor).toContainText(`name: ${sceneName}`);
    
    // Open Settings and change name
    await page.locator('button[title="Scene Settings"]').click();
    await page.locator('scene-dialog input').fill(updatedName);
    await page.locator('scene-dialog button.primary').click();
    
    // Verify YAML updated automatically
    await expect(yamlEditor).toContainText(`name: ${updatedName}`);
  });

  test('should update scene data when YAML is edited', async ({ page }) => {
    const sceneName = getUniqueName('YAML Edit');
    const yamlName = getUniqueName('Name from YAML');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog button.primary').click();
    
    // Switch to YAML mode
    await page.locator('button[title="Switch to YAML Mode"]').click();
    
    // Edit the name in YAML
    const yamlEditor = page.locator('yaml-editor');
    const textarea = yamlEditor.locator('textarea');
    
    // Get current YAML, replace name, and fill back
    const currentYaml = await textarea.inputValue();
    const updatedYaml = currentYaml.replace(`name: ${sceneName}`, `name: ${yamlName}`);
    await textarea.fill(updatedYaml);
    
    // Verify toolbar and sidebar updated
    await expect(page.locator('.toolbar-title')).toContainText(yamlName);
    await expect(page.locator('.sidebar-item.selected')).toContainText(yamlName);
  });

  test('should show error message for invalid YAML', async ({ page }) => {
    const sceneName = getUniqueName('Invalid YAML');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog button.primary').click();
    
    // Switch to YAML mode
    await page.locator('button[title="Switch to YAML Mode"]').click();
    
    // Break the YAML
    const yamlEditor = page.locator('yaml-editor');
    const textarea = yamlEditor.locator('textarea');
    await textarea.fill('invalid: yaml: : [}');
    
    // Verify error message appears in status bar
    const statusItem = yamlEditor.locator('.status-item').first();
    await expect(statusItem).toHaveClass(/error/);
    await expect(statusItem).not.toContainText('Valid YAML');
    
    // Fix it
    await textarea.fill(`name: ${sceneName}\nlayout: ${sharedLayoutId}`);
    
    // Verify success message
    await expect(statusItem).toHaveClass(/success/);
    await expect(statusItem).toContainText('Valid YAML');
  });

  test('should delete a scene', async ({ page }) => {
    const deleteName = getUniqueName('Delete Me');

    // Create a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(deleteName);
    await page.locator('scene-dialog button.primary').click();
    
    // Wait for sidebar item to be visible and selected
    const sidebarItem = page.locator('.sidebar-item').getByText(deleteName);
    await expect(sidebarItem).toBeVisible();
    
    // Sometimes the selection takes a beat
    await expect(page.locator('.sidebar-item.selected')).toContainText(deleteName);
    
    // Click Delete Current Item in header
    const deleteBtn = page.locator('button[title="Delete Current Item"]');
    await expect(deleteBtn).toBeEnabled();
    await deleteBtn.click();
    
    // Verify confirmation dialog
    const confirmDialog = page.locator('confirm-dialog');
    await expect(confirmDialog.locator('p')).toBeVisible();
    await expect(confirmDialog).toContainText('Delete Scene?');
    
    // Confirm delete
    await confirmDialog.locator('button.danger').click();
    
    // Verify it is gone from sidebar
    await expect(sidebarItem).not.toBeVisible();
  });

  test('should toggle between Graphical and YAML modes', async ({ page }) => {
    const sceneName = getUniqueName('Toggle Mode');

    // Create a scene so we can see content
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog button.primary').click();
    await expect(page.locator('.sidebar-item').getByText(sceneName)).toBeVisible();
    
    // Verify layout-editor is visible (Graphical mode default)
    await expect(page.locator('layout-editor')).toBeVisible();
    
    // Toggle to YAML Mode
    await page.locator('button[title="Switch to YAML Mode"]').click();
    
    // Verify yaml-editor is visible
    await expect(page.locator('yaml-editor')).toBeVisible();
    
    // Toggle back to Graphical Mode
    await page.locator('button[title="Switch to Graphical Mode"]').click();
    
    // Verify layout-editor is visible again
    await expect(page.locator('layout-editor')).toBeVisible();
  });

  test('should manage scene item creation buttons based on selection', async ({ page }) => {
    const sceneName = getUniqueName('Button State Test');

    // Create a scene with our shared multi-display layout
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: sharedLayoutName });
    await page.locator('scene-dialog button.primary').click();
    
    const sidebarItem = page.locator('.sidebar-item').getByText(sceneName);
    await sidebarItem.click();
    
    // Wait for workspace to be visible to ensure scene is loaded
    await expect(page.locator('.workspace')).toBeVisible();
    
    const singleBtn = page.locator('button[title="New Single Display"]');
    const multiBtn = page.locator('button[title="New Multi-Display (Tiled)"]');
    
    // Initial state: both disabled
    await expect(singleBtn).toBeDisabled();
    await expect(multiBtn).toBeDisabled();
    
    // Select first display
    await page.locator('layout-box[data-id="display-1"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-1"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await expect(singleBtn).toBeEnabled();
    await expect(multiBtn).toBeDisabled();
    
    // Select second display
    await page.locator('layout-box[data-id="display-2"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-2"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await expect(singleBtn).toBeEnabled();
    await expect(multiBtn).toBeEnabled();
    
    // Deselect all
    await page.locator('layout-box[data-id="display-1"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-1"]')).not.toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await page.locator('layout-box[data-id="display-2"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-2"]')).not.toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await expect(singleBtn).toBeDisabled();
    await expect(multiBtn).toBeDisabled();
  });

  test('should add single display items', async ({ page }) => {
    const sceneName = getUniqueName('Single Item Test');

    // Create and select a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: sharedLayoutName });
    await page.locator('scene-dialog button.primary').click();
    await page.locator('.sidebar-item').getByText(sceneName).click();
    
    // Select both displays
    await page.locator('layout-box[data-id="display-1"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-1"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await page.locator('layout-box[data-id="display-2"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-2"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    
    // Add single items
    await page.locator('button[title="New Single Display"]').click();
    
    // Verify 2 items added to the list
    const items = page.locator('.placeholder-item');
    await expect(items).toHaveCount(2);
    
    // Verify selection is cleared
    await expect(page.locator('button[title="New Single Display"]')).toBeDisabled();
    await expect(page.locator('layout-box[selected]')).toHaveCount(0);
  });

  test('should add a multi-display tiled item', async ({ page }) => {
    const sceneName = getUniqueName('Multi Item Test');

    // Create and select a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: sharedLayoutName });
    await page.locator('scene-dialog button.primary').click();
    await page.locator('.sidebar-item').getByText(sceneName).click();
    
    // Select both displays
    await page.locator('layout-box[data-id="display-1"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-1"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    await page.locator('layout-box[data-id="display-2"]').dispatchEvent('mousedown');
    await expect(page.locator('layout-box[data-id="display-2"]')).toHaveAttribute('selected', '');
    await page.waitForTimeout(100);
    
    // Add multi-display item
    await page.locator('button[title="New Multi-Display (Tiled)"]').click();
    
    // Verify 1 item added to the list
    const items = page.locator('.placeholder-item');
    await expect(items).toHaveCount(1);
    await expect(items).toContainText('Tile');
    
    // Verify selection is cleared
    await expect(page.locator('button[title="New Multi-Display (Tiled)"]')).toBeDisabled();
  });

  test('should highlight used displays and prevent re-selection', async ({ page }) => {
    const sceneName = getUniqueName('Used Display Test');

    // 1. Create and select a scene
    await page.locator('button[title="Add New Item"]').click();
    await page.locator('scene-dialog input').fill(sceneName);
    await page.locator('scene-dialog select').selectOption({ label: sharedLayoutName });
    await page.locator('scene-dialog button.primary').click();
    await page.locator('.sidebar-item').getByText(sceneName).click();
    
    // 2. Select first display and add as single item
    await page.locator('layout-box[data-id="display-1"]').click();
    await page.locator('button[title="New Single Display"]').click();
    
    // 3. Verify item added
    await expect(page.locator('.placeholder-item')).toHaveCount(1);
    
    // 4. Verify display-1 is now marked as used and not selected
    const box1 = page.locator('layout-box[data-id="display-1"]');
    await expect(box1).toHaveAttribute('used', '');
    await expect(box1).not.toHaveAttribute('selected', '');
    
    // 5. Verify display-2 is NOT used
    const box2 = page.locator('layout-box[data-id="display-2"]');
    await expect(box2).not.toHaveAttribute('used', '');
    
    // 6. Attempt to click display-1 (used) and verify it's NOT selected
    await box1.click({ force: true }); // Use force because we set pointer-events: none in CSS
    await expect(box1).not.toHaveAttribute('selected', '');
    
    // 7. Click display-2 (unused) and verify it IS selected
    await box2.click();
    await expect(box2).toHaveAttribute('selected', '');
    
    // 8. Verify buttons state
    await expect(page.locator('button[title="New Single Display"]')).toBeEnabled();
  });
});

