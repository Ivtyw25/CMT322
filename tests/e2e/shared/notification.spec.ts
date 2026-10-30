import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { notificationCopy } from '@/content/notifications';
import { getSiteNotice } from '@/data/api/announcements';
import { prepare, settle } from '../../support/browser';

const notice = await getSiteNotice();

test.describe('notification bar', () => {
  test.skip(!notice, 'No notice is published at the mock date.');

  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.goto(routes.project.overview);
    await settle(page);
  });

  test('shows the notice with a link to the announcements', async ({ page }) => {
    const bar = page.getByRole('region', { name: 'Site notice' });
    await expect(bar.getByText(notice?.message ?? '')).toBeVisible();
    await expect(
      bar.getByRole('link', { name: new RegExp(notificationCopy.viewDetails) }),
    ).toHaveAttribute('href', routes.traffic.announcements);
  });

  test('the close button hides it, moves focus to main and keeps it hidden on reload', async ({
    page,
  }) => {
    const bar = page.getByRole('region', { name: 'Site notice' });
    await bar.getByRole('button', { name: notificationCopy.dismiss }).click();
    await expect(bar).toBeHidden();
    await expect(page.locator('main#main')).toBeFocused();
    await page.reload();
    await expect(bar).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('data-notice', 'dismissed');
  });

  test('a different notice id shows again after a dismissal', async ({ page }) => {
    await page.evaluate(() =>
      window.sessionStorage.setItem('mlc-notice-dismissed', 'an-older-notice'),
    );
    await page.reload();
    await expect(page.getByRole('region', { name: 'Site notice' })).toBeVisible();
  });

  test('a new browser session shows it again', async ({ browser }) => {
    const first = await browser.newContext();
    const firstPage = await first.newPage();
    await prepare(firstPage);
    await firstPage.goto(routes.project.overview);
    await settle(firstPage);
    await firstPage
      .getByRole('region', { name: 'Site notice' })
      .getByRole('button', { name: notificationCopy.dismiss })
      .click();
    await first.close();
    const second = await browser.newContext();
    const secondPage = await second.newPage();
    await prepare(secondPage);
    await secondPage.goto(routes.project.overview);
    await settle(secondPage);
    await expect(secondPage.getByRole('region', { name: 'Site notice' })).toBeVisible();
    await second.close();
  });
});
