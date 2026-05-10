import { defineConfig, devices } from '@playwright/test';

const PROD_URL = process.env.E2E_BASE_URL ?? 'https://nehiljain-com.pages.dev';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  projects: [
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4173'
      }
    },
    {
      name: 'prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_URL
      }
    }
  ],
  webServer:
    process.env.PLAYWRIGHT_PROJECT === 'prod'
      ? undefined
      : {
          command: 'pnpm exec serve out -l 4173',
          url: 'http://localhost:4173',
          reuseExistingServer: !process.env.CI,
          timeout: 30_000
        }
});
