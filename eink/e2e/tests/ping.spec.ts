import { test, expect } from '@playwright/test';

test('PING API endpoint returns 200 and pong', async ({ request }) => {
  const response = await request.get('/api/ping');
  expect(response.ok()).toBeTruthy();
  
  const body = await response.json();
  expect(body).toEqual({ status: 'pong' });
});
