import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { THEME_STORAGE_KEY } from '@/lib/theme/theme';
import { prepare, settle } from '../../support/browser';

test.describe('theme', () => {
  test('a saved dark choice is applied before first paint', async ({ page }) => {
    await prepare(page, { theme: 'dark' });
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    // Read the attribute as soon as the HTML is parsed, before React hydrates.
    await page.goto(routes.home, { waitUntil: 'commit' });
    await page.waitForFunction(() => document.body !== null);
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    await settle(page);
    expect(
      errors.filter((e) => /hydrat/i.test(e)),
      'hydration errors',
    ).toEqual([]);
  });

  test('System follows the operating system live', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), THEME_STORAGE_KEY);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(routes.home);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('blocked storage falls back to the system theme without errors', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(routes.home);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });
});
