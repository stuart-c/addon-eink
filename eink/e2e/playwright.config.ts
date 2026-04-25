import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INGRESS_PORT = process.env.INGRESS_PORT || '8099';
const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, 'test_data_e2e');


export default defineConfig({
  timeout: 60000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['list'], ['github'], ['blob', { outputDir: 'blob-report' }], ['html', { open: 'never' }]]
    : 'line',
  use: {
    baseURL: process.env.BASE_URL || `http://127.0.0.1:${INGRESS_PORT}`,
    trace: 'retain-on-failure',
  },
  expect: {
    timeout: 15000,
  },
  webServer: process.env.CI ? undefined : {
    command: `export DATA_DIR=${DATA_DIR} && export MEDIA_DIR=${path.join(DATA_DIR, 'media')} && export INGRESS_PORT=${INGRESS_PORT} && cd ${path.resolve(__dirname, '../..')} && cd eink && PYTHONPATH=. backend/.venv/bin/python3 -m backend.main`,
    url: `http://localhost:${INGRESS_PORT}/api/ping`,
    reuseExistingServer: true,
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
