import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { notificationCopy } from '@/content/notifications';
import { prepare, settle } from '../../support/browser';

test('mobile header and notice buttons have 44 px targets', async ({ page }) => {
  await prepare(page, { signedIn: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(routes.reportTrack.overview);
  await settle(page);
  const controls = page.locator(
    '[data-header="mobile"] button, [data-header="mobile"] [data-auth="signed-in"]',
  );
  await expect(controls).toHaveCount(3);
  for (const button of [
    ...(await controls.all()),
    page.getByRole('button', { name: notificationCopy.dismiss }),
  ]) {
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});
