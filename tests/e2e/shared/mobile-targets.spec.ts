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
    // A `hit-area` control may look smaller; its ::after grows the tap area to 44 px.
    const target = await button.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const after = el.classList.contains('hit-area') ? getComputedStyle(el, '::after') : null;
      return {
        width: Math.max(rect.width, after ? parseFloat(after.width) : 0),
        height: Math.max(rect.height, after ? parseFloat(after.height) : 0),
      };
    });
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
  }
});
