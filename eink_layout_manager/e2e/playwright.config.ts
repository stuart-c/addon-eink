import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8099',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'cd ../.. && export DATA_DIR=$(pwd)/test_data_e2e && export INGRESS_PORT=8099 && cd eink_layout_manager && PYTHONPATH=. app/.venv/bin/python3 -m app.main',
    url: 'http://localhost:8099/api/ping',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
