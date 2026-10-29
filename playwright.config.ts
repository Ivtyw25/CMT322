import { defineConfig, devices } from '@playwright/test';

/**
 * Test servers:
 * - BASE_URL set (e.g. the live Vercel URL): no local server.
 * - PW_SERVER=build (npm run verify): `next start` on the production build.
 * - otherwise: `next dev`.
 * TEST_PORT keeps parallel worktrees apart (team 1: 3100, team 2: 3200).
 */
const port = Number(process.env.TEST_PORT ?? 3100);
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;
const useBuild = process.env.PW_SERVER === 'build';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.BASE_URL ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
    locale: 'en-MY',
    timezoneId: 'Asia/Kuala_Lumpur',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'e2e', testDir: './tests/e2e' },
    { name: 'responsive', testDir: './tests/responsive' },
    { name: 'links', testDir: './tests/links' },
    { name: 'a11y', testDir: './tests/a11y' },
    { name: 'visual', testDir: './tests/visual', timeout: 120_000 },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: useBuild
          ? `npx next start --port ${port}`
          : `npx next dev --turbopack --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
