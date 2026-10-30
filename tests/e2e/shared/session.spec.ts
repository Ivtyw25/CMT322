import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { prepare, SESSION_STORAGE_KEY, settle } from '../../support/browser';

test.describe('mock session', () => {
  test('a guest on a protected route is sent to Log in, which remembers where to return', async ({
    page,
  }) => {
    await prepare(page);
    await page.goto(routes.reportTrack.report);
    await settle(page);
    await expect(page).toHaveURL(
      new RegExp(
        `${routes.account.loginReturningTo(routes.reportTrack.report).replace('?', '\\?')}$`,
      ),
    );
  });

  test('the redirect keeps the search and hash of the page', async ({ page }) => {
    await prepare(page);
    await page.goto(`${routes.account.profile}?x=1#reports`);
    await settle(page);
    await expect(page).toHaveURL(
      new RegExp(
        encodeURIComponent(`${routes.account.profile}?x=1#reports`).replaceAll('.', '\\.'),
      ),
    );
  });

  test('a signed-in visitor stays on a protected route', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.reportTrack.report);
    await settle(page);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp(`${routes.reportTrack.report}$`));
  });

  test('the head script sets the session before first paint', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.traffic.overview, { waitUntil: 'commit' });
    await settle(page);
    await page.waitForFunction(() => document.body !== null);
    expect(await page.evaluate(() => document.documentElement.dataset.session)).toBe('signed-in');
  });

  test('signing out on a protected route goes Home', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(routes.account.profile);
    await settle(page);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /^Account menu/ }).click();
    await page.getByRole('menuitem', { name: /Log out/ }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.home}$`));
  });

  test('a change in another tab signs this one out', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.traffic.overview);
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-session', 'signed-in');
    await page.evaluate((key) => {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    }, SESSION_STORAGE_KEY);
    await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
  });

  test('blocked storage means guest, without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
    await page.goto(routes.traffic.overview);
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
    expect(errors).toEqual([]);
  });
});
