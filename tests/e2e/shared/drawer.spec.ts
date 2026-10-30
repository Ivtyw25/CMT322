import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { navCopy, navGroups } from '@/content/nav';
import { prepare, settle } from '../../support/browser';

const header = '[data-header="mobile"]';

/** Opens the drawer, repeating the click until the page has hydrated and it reacts. */
async function openDrawer(page: Page) {
  const button = page.locator(header).getByRole('button', { name: /menu$/i });
  await expect(async () => {
    if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass();
}

test.describe('mobile drawer', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.goto(routes.traffic.overview);
    await settle(page);
  });

  test('the menu button opens and closes the drawer and renames itself', async ({ page }) => {
    const open = page.locator(header).getByRole('button', { name: navCopy.mobile.openMenu });
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await open.click();
    const close = page.locator(header).getByRole('button', { name: navCopy.mobile.closeMenu });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeVisible();
    await close.click();
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeHidden();
  });

  test('lists every group, marks the current page and locks the page behind it', async ({
    page,
  }) => {
    await openDrawer(page);
    const drawer = page.getByRole('navigation', { name: 'Site menu' });
    for (const group of Object.values(navGroups)) {
      await expect(drawer.getByText(group.label, { exact: true })).toBeVisible();
    }
    await expect(
      drawer
        .getByRole('list', { name: navGroups.traffic.label })
        .getByRole('link', { name: navGroups.traffic.items[0].label }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await expect(page.locator('html')).toHaveAttribute('data-scroll-locked', '');
  });

  test('Escape closes it and returns focus to the menu button', async ({ page }) => {
    const open = page.getByRole('button', { name: navCopy.mobile.openMenu });
    await open.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeHidden();
    await expect(page.getByRole('button', { name: navCopy.mobile.openMenu })).toBeFocused();
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  });

  test('choosing a link closes the drawer, even for the current page', async ({ page }) => {
    await openDrawer(page);
    await page

      .getByRole('navigation', { name: 'Site menu' })
      .getByRole('list', { name: navGroups.traffic.label })
      .getByRole('link', { name: navGroups.traffic.items[0].label })
      .click();
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeHidden();
    await settle(page);
    await openDrawer(page);
    await page
      .getByRole('navigation', { name: 'Site menu' })
      .getByRole('link', { name: navGroups.traffic.items[1].label })
      .click();
    await expect(page).toHaveURL(new RegExp(`${routes.traffic.map}$`));
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeHidden();
  });

  test('a guest gets Log in and Create an account in the drawer', async ({ page }) => {
    await openDrawer(page);
    const drawer = page.getByRole('navigation', { name: 'Site menu' });
    await expect(drawer.getByRole('link', { name: navCopy.mobile.logIn })).toBeVisible();
    await expect(drawer.getByRole('link', { name: navCopy.mobile.createAccount })).toHaveAttribute(
      'href',
      navCopy.mobile.createAccountHref(routes.traffic.overview),
    );
  });

  test('the appearance control in the drawer sets the theme and keeps the drawer open', async ({
    page,
  }) => {
    await openDrawer(page);
    const drawer = page.getByRole('navigation', { name: 'Site menu' });
    await drawer.getByText(navCopy.appearance.options.dark.shortLabel, { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(drawer).toBeVisible();
  });

  test('a signed-in visitor sees their name, a profile avatar and Log out', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.traffic.overview);
    await settle(page);
    await expect(page.locator(header).getByRole('link', { name: /^Your profile/ })).toHaveAttribute(
      'href',
      routes.account.profile,
    );
    await openDrawer(page);
    const drawer = page.getByRole('navigation', { name: 'Site menu' });
    await drawer.getByRole('button', { name: navCopy.account.logOut }).click();
    await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
    await expect(drawer).toBeHidden();
  });
});

test.describe('header variant by width', () => {
  for (const [width, kind] of [
    [1023, 'mobile'],
    [1024, 'desktop'],
  ] as const) {
    test(`${width}px shows the ${kind} header`, async ({ page }) => {
      await prepare(page);
      await page.setViewportSize({ width, height: 800 });
      await page.goto(routes.traffic.overview);
      await settle(page);
      await expect(page.locator(`[data-header="${kind}"]`)).toBeVisible();
      await expect(
        page.locator(`[data-header="${kind === 'mobile' ? 'desktop' : 'mobile'}"]`),
      ).toBeHidden();
    });
  }
});

test.describe('mobile drawer: resizing (QA round 1)', () => {
  test('resizing to 1024 px or wider closes the drawer for good', async ({ page }) => {
    await prepare(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes.traffic.overview);
    await settle(page);
    await openDrawer(page);
    await page.setViewportSize({ width: 1100, height: 844 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(header).getByRole('button', { name: /menu$/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
