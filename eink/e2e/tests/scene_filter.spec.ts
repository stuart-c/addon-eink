import { test, expect } from '@playwright/test';

test.describe('Scene Layout Filter', () => {
  test('should filter scenes based on selected layout', async ({ page, baseURL }) => {
    // Create Layout A
    const layoutAResponse = await page.request.post(`${baseURL}/api/layout`, {
      data: { name: 'Layout A', canvas_width_mm: 500, canvas_height_mm: 500, items: [] }
    });
    expect(layoutAResponse.ok()).toBeTruthy();
    const layoutA = await layoutAResponse.json();

    // Create Layout B
    const layoutBResponse = await page.request.post(`${baseURL}/api/layout`, {
      data: { name: 'Layout B', canvas_width_mm: 500, canvas_height_mm: 500, items: [] }
    });
    expect(layoutBResponse.ok()).toBeTruthy();
    const layoutB = await layoutBResponse.json();

    // Create a scene for Layout A
    const sceneAResponse = await page.request.post(`${baseURL}/api/scene`, {
      data: { name: 'Scene for A', layout: layoutA.id }
    });
    expect(sceneAResponse.ok()).toBeTruthy();

    // Create a scene for Layout B
    const sceneBResponse = await page.request.post(`${baseURL}/api/scene`, {
      data: { name: 'Scene for B', layout: layoutB.id }
    });
    expect(sceneBResponse.ok()).toBeTruthy();

    await page.goto('/#/scenes');
    await page.waitForSelector('scenes-view');
    
    const dropdown = page.locator('.layout-select');
    await expect(dropdown).toBeVisible();

    // Initial state MIGHT NOT be Layout A if tests sharing the DB ran first, so explicitly select it
    await dropdown.selectOption(layoutA.id);
    await expect(dropdown).toHaveValue(layoutA.id);
    await expect(page.locator('sidebar-list')).toContainText('Scene for A');
    await expect(page.locator('sidebar-list')).not.toContainText('Scene for B');

    // Select Layout B
    let responsePromise = page.waitForResponse(resp => resp.url().includes('/api/scene?layout='));
    await dropdown.selectOption(layoutB.id);
    await responsePromise;
    await expect(page.locator('sidebar-list')).toContainText('Scene for B');
    await expect(page.locator('sidebar-list')).not.toContainText('Scene for A');

    // Select Layout A back
    responsePromise = page.waitForResponse(resp => resp.url().includes('/api/scene?layout='));
    await dropdown.selectOption(layoutA.id);
    await responsePromise;
    await expect(page.locator('sidebar-list')).toContainText('Scene for A');
    await expect(page.locator('sidebar-list')).not.toContainText('Scene for B');
  });
});
