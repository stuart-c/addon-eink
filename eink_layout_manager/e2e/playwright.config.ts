import { defineConfig, devices } from '@playwright/test';

const INGRESS_PORT = process.env.INGRESS_PORT || '8099';
const DATA_DIR = process.env.DATA_DIR || '$(pwd)/test_data_e2e';


export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['github'], ['blob'], ['html', { open: 'never' }]]
    : 'html',
  use: {
    baseURL: process.env.BASE_URL || `http://127.0.0.1:${INGRESS_PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `cd ../.. && export DATA_DIR=${DATA_DIR} && export INGRESS_PORT=${INGRESS_PORT} && cd eink_layout_manager && PYTHONPATH=. app/.venv/bin/python3 -m app.main`,
    url: `http://localhost:${INGRESS_PORT}/api/ping`,
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
