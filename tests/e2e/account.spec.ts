import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { prepare, settle } from '../support/browser';
import { accountCopy } from '@/content/account';

test('desktop auth form retains its intended width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepare(page);
  await page.goto(routes.account.login);
  const email = page.getByLabel(accountCopy.login.fields.email.label, { exact: true });
  await expect(email).toBeVisible();
  const fieldWidth = (await email.boundingBox())?.width ?? 0;
  expect(fieldWidth).toBeGreaterThanOrEqual(390);
  expect(fieldWidth).toBeLessThanOrEqual(400);
  const panel = page.locator('aside');
  expect((await panel.boundingBox())?.height).toBe(900);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect((await panel.boundingBox())?.y).toBe(0);
});

test('desktop confirmation dialog retains its intended width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepare(page, { signedIn: true });
  await page.goto(routes.account.profile);
  await page.getByRole('button', { name: accountCopy.account.delete.action, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('max-width', '512px');
  expect((await dialog.boundingBox())?.width).toBe(512);
});

test('successful sign-in works for this page view when storage is blocked, then signs out', async ({
  page,
}) => {
  await prepare(page);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
    Storage.prototype.removeItem = () => {
      throw new Error('blocked');
    };
  });
  await page.goto(routes.account.loginReturningTo(routes.account.profile));
  await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
  await page.getByLabel('Email address', { exact: true }).fill('meiling.tan@example.com');
  await page.getByLabel('Password', { exact: true }).fill('Mutiara123');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(routes.account.profile);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tan Mei Ling');
  await page.getByRole('main').getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL(routes.home);
  await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
});

test('password descriptions retain checklist and validation errors and show Caps Lock', async ({
  page,
}) => {
  await prepare(page);
  await page.goto(routes.account.signup);
  const password = page.getByLabel('Password', { exact: true });
  await password.fill('short');
  await password.blur();
  await expect(password).toHaveAttribute('aria-invalid', 'true');
  const described = await password.getAttribute('aria-describedby');
  expect(described?.split(' ')).toContain('signup-password-rules');
  expect(described?.split(' ').length).toBe(2);
  await password.focus();
  await password.evaluate((input) =>
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', bubbles: true, modifierCapsLock: true }),
    ),
  );
  await expect(page.getByText('Caps Lock is on', { exact: true })).toBeVisible();
  await password.blur();
  await expect(page.getByText('Caps Lock is on', { exact: true })).toHaveCount(0);
});

test('mobile account section bar follows selected headings and tolerates malformed hashes', async ({
  page,
}) => {
  await prepare(page, { signedIn: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${routes.account.profile}#%`);
  const bar = page.locator('[data-section-bar]');
  await expect(bar).toHaveCSS('position', 'sticky');
  await bar.getByRole('button').click();
  await bar.getByRole('link', { name: 'Notifications', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Email notifications', exact: true }),
  ).toBeFocused();
  await expect(bar.getByRole('button')).toContainText('Notifications');
  // Click the sticky control at its painted position; locator.click scrolls it to its layout box.
  const trigger = await bar.getByRole('button').boundingBox();
  expect(trigger).not.toBeNull();
  await page.mouse.click(trigger!.x + trigger!.width / 2, trigger!.y + trigger!.height / 2);
  await expect(bar.getByRole('link', { name: 'Notifications', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.keyboard.press('Escape');
  await expect(bar.getByRole('button')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(bar.getByRole('link', { name: 'Notifications', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('login validates credentials and returns to the protected destination', async ({ page }) => {
  await prepare(page);
  await page.goto(routes.account.loginReturningTo(routes.account.profile));
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Fix 2 things/ })).toBeFocused();
  await page.getByLabel('Email address', { exact: true }).fill('meiling.tan@example.com');
  await page.getByLabel('Password', { exact: true }).fill('incorrect');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('form', { name: 'Log in' }).getByRole('alert')).toContainText(
    'Email or password is incorrect',
  );
  await page.getByLabel('Password', { exact: true }).fill('Mutiara123');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(routes.account.profile);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tan Mei Ling');
});

test('signup saves demo details and rejects an external return destination', async ({ page }) => {
  await prepare(page);
  await page.goto(`${routes.account.signup}?next=${encodeURIComponent('//example.com')}`);
  await page.getByLabel('Full name', { exact: true }).fill('Demo Resident');
  await page.getByLabel('Email address', { exact: true }).fill('resident@example.com');
  await page.getByLabel('Password', { exact: true }).fill('Example123');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL(routes.home);
  await page.getByRole('button', { name: /^Account menu/ }).click();
  await page.getByRole('menuitem', { name: 'Profile & settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Demo Resident');
});

test('password reset shows a generic confirmation and a resend cooldown', async ({ page }) => {
  await prepare(page);
  await page.goto(routes.account.forgotPassword);
  await page.getByLabel('Email address', { exact: true }).fill('unknown@example.com');
  await page.getByRole('button', { name: 'Send reset link', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeFocused();
  await expect(page.getByRole('button', { name: /Send the link again in/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Use a different email' }).click();
  await expect(page.getByLabel('Email address', { exact: true })).toBeFocused();
});

test('profile edits and notification preferences persist through reload', async ({ page }) => {
  await prepare(page, { signedIn: true });
  await page.goto(routes.account.profile);
  const details = page.getByRole('region', { name: 'Profile details', exact: true });
  await details.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await details.getByLabel('Full name', { exact: true }).fill('Updated Demo Name');
  await details.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Updated Demo Name');
  await expect(page.getByRole('button', { name: 'Account menu, Updated Demo Name' })).toBeVisible();
  const preference = page.getByRole('switch', { name: 'Ticket updates', exact: true });
  await preference.uncheck();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Updated Demo Name');
  await expect(preference).not.toBeChecked();
});

test('follow removal supports undo and deletion requires a confirmation', async ({ page }) => {
  await prepare(page, { signedIn: true });
  await page.goto(routes.account.profile);
  await settle(page);
  const remove = page.getByRole('button', { name: /^Stop following/ }).first();
  const label = await remove.getAttribute('aria-label');
  await remove.click();
  await expect(page.getByRole('button', { name: label!, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('button', { name: label!, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete account', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Delete account', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Delete account', exact: true }).click();
  await dialog.getByRole('button', { name: 'Delete my account' }).click();
  await expect(page).toHaveURL(routes.home);
  await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('mlc-profile') ?? '{}')),
  ).toEqual({});
});

test('saved profile details hydrate without errors and security changes require the demo password', async ({
  page,
}) => {
  await prepare(page, { signedIn: true });
  await page.addInitScript(() =>
    localStorage.setItem('mlc-profile', JSON.stringify({ name: 'Saved Demo Name' })),
  );
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(routes.account.profile);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Saved Demo Name');
  const security = page.getByRole('region', { name: 'Sign-in & security', exact: true });
  await security.getByRole('button', { name: 'Change', exact: true }).click();
  await security.getByLabel('Current password', { exact: true }).fill('incorrect');
  await security.getByLabel('New password', { exact: true }).fill('NewExample123');
  await security.getByRole('button', { name: 'Change password', exact: true }).click();
  await expect(
    security.getByText('Your current password is not right. Check it and try again.'),
  ).toBeVisible();
  await expect(security.getByLabel('Current password', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(security.getByLabel('New password', { exact: true })).not.toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(security.getByLabel('New password', { exact: true })).toHaveAttribute(
    'aria-describedby',
    'profile-password-rules',
  );
  await security.getByLabel('Current password', { exact: true }).fill('Mutiara123');
  await security.getByRole('button', { name: 'Change password', exact: true }).click();
  await expect(security.getByText('Last changed just now')).toBeVisible();
  await expect(security.getByRole('button', { name: 'Change', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});
