import { test, expect } from '@playwright/test';

test.describe('Display Types Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Navigate to Display Types section
    const displayTypesNav = page.locator('button[title="Display Types"]');
    await displayTypesNav.click();
    
    // Verify we are on the Display Types page
    await expect(page.locator('display-types-view')).toBeVisible();
  });

  test('should create a new display type', async ({ page }) => {
    // Click Add New Item
    await page.locator('button[title="Add New Item"]').click();
    
    // Verify header says "Create New Display Type"
    await expect(page.locator('.toolbar-title')).toContainText('Create New Display Type');
    
    // Fill in the form
    await page.getByPlaceholder('e.g. Living Room Display').fill('E2E Test Display');
    await page.locator('div.form-group:has-text("Frame Outer Width (mm)") input').fill('200');
    await page.locator('div.form-group:has-text("Frame Outer Height (mm)") input').fill('150');
    await page.locator('div.form-group:has-text("Frame Border Width (mm)") input').fill('10');
    await page.locator('div.form-group:has-text("Display Panel Width (mm)") input').fill('180');
    await page.locator('div.form-group:has-text("Display Panel Height (mm)") input').fill('130');
    await page.locator('div.form-group:has-text("Colour Type") select').selectOption('BWR');
    await page.locator('div.form-group:has-text("Resolution Width (px)") input').fill('800');
    await page.locator('div.form-group:has-text("Resolution Height (px)") input').fill('600');
    
    // Save
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify success message (toast)
    await expect(page.locator('app-header')).toContainText('Display type "E2E Test Display" saved!');
    
    // Verify it appears in the sidebar
    await expect(page.locator('.sidebar-item').getByText('E2E Test Display').first()).toBeVisible();
    
    // Verify header updated
    await expect(page.locator('.toolbar-title')).toContainText('Editing: E2E Test Display');
  });

  test('should edit an existing display type', async ({ page }) => {
    // First, ensure there's a display type to edit
    await page.locator('button[title="Add New Item"]').click();
    await page.getByPlaceholder('e.g. Living Room Display').fill('Edit Me');
    await page.locator('div.form-group:has-text("Frame Outer Width (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Outer Height (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Border Width (mm)") input').fill('5');
    await page.locator('div.form-group:has-text("Display Panel Width (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Display Panel Height (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Resolution Width (px)") input').fill('100');
    await page.locator('div.form-group:has-text("Resolution Height (px)") input').fill('100');
    await page.locator('button[title="Save Changes"]').click();
    
    // Wait for the first toast to disappear to avoid flakiness in the next step
    await expect(page.locator('app-header')).not.toContainText('saved', { timeout: 10000 });
    
    // Select it in sidebar (should already be selected, but let's be sure)
    await page.locator('.sidebar-item').getByText('Edit Me').first().click();
    
    // Change name
    await page.getByPlaceholder('e.g. Living Room Display').fill('Edited Name');
    
    // Save
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify success
    await expect(page.locator('app-header')).toContainText(/Display type "Edited Name" saved!|saved!/i);
    await expect(page.locator('.sidebar-item').getByText('Edited Name').first()).toBeVisible();
  });

  test('should show dirty state warning when navigating away with unsaved changes', async ({ page }) => {
    // Create one first
    await page.locator('button[title="Add New Item"]').click();
    await page.getByPlaceholder('e.g. Living Room Display').fill('Persisted');
    await page.locator('div.form-group:has-text("Frame Outer Width (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Outer Height (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Border Width (mm)") input').fill('5');
    await page.locator('div.form-group:has-text("Display Panel Width (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Display Panel Height (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Resolution Width (px)") input').fill('100');
    await page.locator('div.form-group:has-text("Resolution Height (px)") input').fill('100');
    await page.locator('button[title="Save Changes"]').click();

    // Wait for toast to disappear
    await expect(page.locator('app-header')).not.toContainText('saved', { timeout: 10000 });

    // Create a second one
    await page.locator('button[title="Add New Item"]').click();
    await page.getByPlaceholder('e.g. Living Room Display').fill('Second');
    await page.locator('div.form-group:has-text("Frame Outer Width (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Outer Height (mm)") input').fill('100');
    await page.locator('div.form-group:has-text("Frame Border Width (mm)") input').fill('5');
    await page.locator('div.form-group:has-text("Display Panel Width (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Display Panel Height (mm)") input').fill('90');
    await page.locator('div.form-group:has-text("Resolution Width (px)") input').fill('100');
    await page.locator('div.form-group:has-text("Resolution Height (px)") input').fill('100');
    await page.locator('button[title="Save Changes"]').click();

    // Wait for toast to disappear
    await expect(page.locator('app-header')).not.toContainText('saved', { timeout: 10000 });

    // Modify the second one
    await page.getByPlaceholder('e.g. Living Room Display').fill('Modified Second');
    await page.waitForTimeout(500); // Wait for @input to trigger dirty state calculation

    // Try to click the first one in sidebar
    await page.locator('.sidebar-item').getByText('Persisted').first().click();
    
    // Verify confirmation dialog appears
    await expect(page.getByRole('heading', { name: 'Unsaved Changes' })).toBeVisible();
    
    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Verify we are still on the second one
    await expect(page.getByPlaceholder('e.g. Living Room Display')).toHaveValue('Modified Second');
  });

  test('should delete a display type', async ({ page }) => {
    // Create one to delete
    await page.locator('button[title="Add New Item"]').click();
    await page.getByPlaceholder('e.g. Living Room Display').fill('Delete Me');
    await page.locator('div.form-group:has-text("Frame Outer Width (mm)") input').fill('50');
    await page.locator('div.form-group:has-text("Frame Outer Height (mm)") input').fill('50');
    await page.locator('div.form-group:has-text("Frame Border Width (mm)") input').fill('5');
    await page.locator('div.form-group:has-text("Display Panel Width (mm)") input').fill('40');
    await page.locator('div.form-group:has-text("Display Panel Height (mm)") input').fill('40');
    await page.locator('div.form-group:has-text("Resolution Width (px)") input').fill('50');
    await page.locator('div.form-group:has-text("Resolution Height (px)") input').fill('50');
    await page.locator('button[title="Save Changes"]').click();
    
    // Wait for the first toast to disappear to avoid flakiness in the next step
    await expect(page.locator('app-header')).not.toContainText('saved', { timeout: 10000 });
    
    // Select it
    await page.locator('.sidebar-item').getByText('Delete Me').first().click();
    
    // Click Delete
    await page.locator('button[title="Delete Current Item"]').click();
    
    // Confirm delete in dialog
    await expect(page.getByText('Delete Display Type?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    
    // Verify success message
    await expect(page.locator('app-header')).toContainText('Display type "Delete Me" deleted.');
    
    // Verify it is gone from sidebar
    await expect(page.locator('.sidebar-item').getByText('Delete Me').first()).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click Add
    await page.locator('button[title="Add New Item"]').click();
    
    // Clear name (should be empty anyway)
    await page.getByPlaceholder('e.g. Living Room Display').fill('');
    
    // Try to save
    await page.locator('button[title="Save Changes"]').click();
    
    // Verify no success message appeared
    await expect(page.locator('app-header')).not.toContainText('saved');
    
    // Check if browser validation is triggered (hard to test natively but we can check if we are still in "Create" mode)
    await expect(page.locator('.toolbar-title')).toContainText('Create New Display Type');
  });
});
