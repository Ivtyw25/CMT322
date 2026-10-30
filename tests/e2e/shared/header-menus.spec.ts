import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { navCopy, navGroups } from '@/content/nav';
import { prepare, settle } from '../../support/browser';

const header = '[data-header="desktop"]';

/** A panel row's name also holds its description, so match on the start of it. */
const startsWith = (label: string) => new RegExp(`^${label}`);

test.describe('desktop header menus', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.goto(routes.traffic.overview);
    await settle(page);
  });

  test('a nav trigger opens its panel on click and closes on a second click', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.project.label });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = page
      .locator(header)
      .getByRole('link', { name: startsWith(navGroups.project.items[2].label) });
    await expect(panel).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });

  test('only one panel is open: clicking another trigger swaps it', async ({ page }) => {
    const project = page.locator(header).getByRole('button', { name: navGroups.project.label });
    const traffic = page.locator(header).getByRole('button', { name: navGroups.traffic.label });
    await project.click();
    await traffic.click();
    await expect(project).toHaveAttribute('aria-expanded', 'false');
    await expect(traffic).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText(navCopy.trafficPanel.title)).toBeVisible();
  });

  test('Escape closes the panel and returns focus to its trigger', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.traffic.label });
    await trigger.click();
    await page
      .locator(header)
      .getByRole('link', { name: startsWith(navGroups.traffic.items[1].label) })
      .focus();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('a click outside the header closes the panel', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.reportTrack.label });
    await trigger.click();
    await page.locator('main').click({ position: { x: 20, y: 100 } });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('choosing a link in the panel navigates and closes it', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.traffic.label });
    await trigger.click();
    await page
      .locator(header)
      .getByRole('link', { name: startsWith(navGroups.traffic.items[1].label) })
      .click();
    await expect(page).toHaveURL(new RegExp(`${routes.traffic.map}$`));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('keyboard: Arrow Down opens and focuses the first link, arrows move between triggers', async ({
    page,
  }) => {
    const project = page.locator(header).getByRole('button', { name: navGroups.project.label });
    const traffic = page.locator(header).getByRole('button', { name: navGroups.traffic.label });
    await project.focus();
    await page.keyboard.press('ArrowDown');
    await expect(project).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page
        .locator(header)
        .getByRole('link', { name: startsWith(navGroups.project.items[0].label) }),
    ).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(
      page
        .locator(header)
        .getByRole('link', { name: startsWith(navGroups.project.items[1].label) }),
    ).toBeFocused();
    await project.focus();
    await page.keyboard.press('ArrowRight');
    await expect(traffic).toBeFocused();
    await expect(traffic).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Home');
    await expect(project).toBeFocused();
  });

  test('Tab out of the open panel closes it', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.project.label });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('the current group shows "current section" for screen readers', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.traffic.label });
    await expect(trigger).toContainText(navCopy.currentGroup);
  });

  test('the appearance menu: button opens it, a choice applies, saves and returns focus', async ({
    page,
  }) => {
    const button = page.locator(header).getByRole('button', { name: /^Appearance/ });
    await button.click();
    await expect(page.getByRole('menu')).toBeVisible();
    // prepare() saved Light, so Light is the checked option.
    await expect(
      page.getByRole('menuitemradio', { name: navCopy.appearance.options.light.label }),
    ).toBeChecked();
    await page.getByRole('menuitemradio', { name: navCopy.appearance.options.dark.label }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAccessibleName(
      navCopy.appearance.buttonLabel(navCopy.appearance.options.dark.label),
    );
    await expect(page.getByText(navCopy.appearance.changed('Dark'))).toBeAttached();
  });

  test('Escape closes the appearance menu without a change', async ({ page }) => {
    const button = page.locator(header).getByRole('button', { name: /^Appearance/ });
    await button.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('account menu', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('lists the account links and logs out', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.traffic.overview);
    await settle(page);
    const chip = page.locator(header).getByRole('button', { name: /^Account menu/ });
    await chip.click();
    for (const item of navCopy.account.items) {
      await expect(page.getByRole('menuitem', { name: item.label })).toBeVisible();
    }
    await page.getByRole('menuitem', { name: navCopy.account.logOut }).click();
    await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
    await expect(
      page.locator(header).getByRole('link', { name: navCopy.header.logIn }),
    ).toBeFocused();
  });

  test('a guest sees Log in instead, pointing back to the current page', async ({ page }) => {
    await prepare(page);
    await page.goto(routes.traffic.overview);
    await settle(page);
    const login = page.locator(header).getByRole('link', { name: navCopy.header.logIn });
    await expect(login).toHaveAttribute('href', navCopy.header.logInHref(routes.traffic.overview));
    await expect(page.locator(header).getByRole('button', { name: /^Account menu/ })).toBeHidden();
  });
});

test.describe('desktop header menus: closing and placement (QA round 1)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.goto(routes.traffic.overview);
    await settle(page);
  });

  test('resizing below 1024 px closes an open panel for good', async ({ page }) => {
    const trigger = page.locator(header).getByRole('button', { name: navGroups.project.label });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.setViewportSize({ width: 900, height: 800 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('the appearance menu focuses the checked option and arrow keys wrap', async ({ page }) => {
    const button = page.locator(header).getByRole('button', { name: /^Appearance/ });
    await button.click();
    // prepare() saves Light, so Light is the checked option and takes focus (spec §4).
    const light = page.getByRole('menuitemradio', {
      name: startsWith(navCopy.appearance.options.light.label),
    });
    const system = page.getByRole('menuitemradio', {
      name: startsWith(navCopy.appearance.options.system.label),
    });
    await expect(light).toHaveAttribute('aria-checked', 'true');
    await expect(light).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(system).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(light).toBeFocused();
  });

  test('the appearance and account menus open 8 px below the header', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.traffic.overview);
    await settle(page);
    const headerBottom = await page
      .locator(header)
      .evaluate((e) => e.getBoundingClientRect().bottom);
    for (const name of [/^Appearance/, /^Account menu/]) {
      await page.locator(header).getByRole('button', { name }).click();
      const top = await page.getByRole('menu').evaluate((e) => e.getBoundingClientRect().top);
      expect(Math.round(top - headerBottom)).toBe(8);
      await page.keyboard.press('Escape');
    }
  });
});
