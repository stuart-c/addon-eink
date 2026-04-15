import { test, expect } from '@playwright/test';

test.describe('Smart Scenes Management', () => {
  let sceneCount = 0;
  const getUniqueName = (prefix: string) => `${prefix} ${++sceneCount} ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Navigate to Scenes section
    const scenesNav = page.locator('button[title="Scenes"]');
    await scenesNav.click();
    
    // Verify we are on the Scenes page
    await expect(page.locator('scenes-view')).toBeVisible();
  });

  test('should create a new scene', async ({ page }) => {
    const sceneName = getUniqueName('New Scene');
    
    // Click Add New Item
    await page.locator('button[title="Add New Item"]').click();
    
    // Verify dialog appears - check for the heading which must be visible
    const dialog = page.locator('scene-dialog');
    await expect(dialog.locator('h2')).toBeVisible();
    await expect(dialog).toContainText('Create New Smart Scene');
    
    // Fill in the name
    await dialog.locator('input').fill(sceneName);
    
    // Click Create Scene
    await dialog.locator('button.primary').click();
    
    // Wait for the dialog to be hidden
    await expect(dialog.locator('base-dialog')).toBeHidden();
    
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
    
    // Verify empty-view is visible (Graphical mode default)
    await expect(page.locator('empty-view')).toBeVisible();
    
    // Toggle to YAML Mode
    await page.locator('button[title="Switch to YAML Mode"]').click();
    
    // Verify yaml-editor is visible
    await expect(page.locator('yaml-editor')).toBeVisible();
    
    // Toggle back to Graphical Mode
    await page.locator('button[title="Switch to Graphical Mode"]').click();
    
    // Verify empty-view is visible again
    await expect(page.locator('empty-view')).toBeVisible();
  });
});
