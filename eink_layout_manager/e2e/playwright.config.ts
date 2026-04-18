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
    ? [['github'], ['blob', { outputDir: 'blob-report' }], ['html', { open: 'never' }]]
    : 'html',
  use: {
    baseURL: process.env.BASE_URL || `http://127.0.0.1:${INGRESS_PORT}`,
    trace: 'retain-on-failure',
  },
  expect: {
    timeout: 15000,
  },
  webServer: process.env.CI ? undefined : {
    command: `export DATA_DIR=${path.resolve(DATA_DIR)} && export INGRESS_PORT=${INGRESS_PORT} && export PYTHONPATH=${path.resolve(__dirname, '..')} && export PYTHONUNBUFFERED=1 && ${path.resolve(__dirname, '../backend/.venv/bin/python3')} -m backend.main`,
    url: `http://localhost:${INGRESS_PORT}/api/ping`,
    reuseExistingServer: true,
    stdout: 'inherit',
    stderr: 'inherit',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
