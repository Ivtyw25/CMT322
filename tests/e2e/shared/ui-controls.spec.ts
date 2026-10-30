import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { navCopy } from '@/content/nav';
import { prepare, settle, whenHydrated } from '../../support/browser';

const { samples } = devCopy;

test.beforeEach(async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(routes.dev.components);
  await settle(page);
  for (const id of ['accordion', 'tabs', 'switch', 'segmented-control', 'filter-chips']) {
    await whenHydrated(page, `section:has(#${id}) :is(button, [role="tab"], input)`);
  }
});

test.describe('accordion', () => {
  const section = '#accordion';
  const item = (page: Page, index: number) =>
    page
      .locator('section', { has: page.locator(section) })
      .getByRole('button', { name: samples.accordion[index]?.title ?? '' });

  test('the first item starts open, the others closed', async ({ page }) => {
    await expect(item(page, 0)).toHaveAttribute('aria-expanded', 'true');
    await expect(item(page, 1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('Enter and Space toggle an item, and several can be open', async ({ page }) => {
    // Keys pressed before the page has hydrated are lost, so repeat until the item reacts.
    await expect(async () => {
      if ((await item(page, 1).getAttribute('aria-expanded')) !== 'true') {
        await item(page, 1).focus();
        await page.keyboard.press('Enter');
      }
      await expect(item(page, 1)).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass();
    await item(page, 2).focus();
    await page.keyboard.press('Space');
    await expect(item(page, 2)).toHaveAttribute('aria-expanded', 'true');
    await expect(item(page, 0)).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(item(page, 2)).toHaveAttribute('aria-expanded', 'false');
  });

  test('closed content stays in the page for find-in-page', async ({ page }) => {
    const body = page.getByText(samples.accordion[2]?.body ?? '');
    await expect(body).toBeAttached();
    await expect(body).toBeHidden();
  });

  test('a #id link opens and scrolls to its item', async ({ page }) => {
    // A deep link is a fresh page load that already carries the hash.
    await page.goto('about:blank');
    await page.goto(`${routes.dev.components}#gallery-faq-3`);
    // Hydration of this long page can take a while on the dev server.
    await expect(item(page, 2)).toHaveAttribute('aria-expanded', 'true', { timeout: 30_000 });
  });
});

test.describe('tabs', () => {
  const tabs = (page: Page) => page.getByRole('tablist', { name: samples.fieldLabel });

  test('arrow keys move and select, Home and End jump', async ({ page }) => {
    const list = tabs(page).nth(1);
    const names = samples.tabsWrapping;
    await list.getByRole('tab', { name: names[0] }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(list.getByRole('tab', { name: names[1] })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(list.getByRole('tab', { name: names[1] })).toBeFocused();
    await page.keyboard.press('End');
    await expect(list.getByRole('tab', { name: names[3] })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('Home');
    await expect(list.getByRole('tab', { name: names[0] })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('the selected tab shows its own panel', async ({ page }) => {
    const list = tabs(page).first();
    await expect(async () => {
      await list.getByRole('tab', { name: samples.tabsTwo[1] }).click();
      await expect(page.getByRole('tabpanel', { name: samples.tabsTwo[1] })).toBeVisible({
        timeout: 1000,
      });
    }).toPass();
  });

  test('tabs wrap instead of scrolling sideways in a narrow box', async ({ page }) => {
    const list = tabs(page).nth(1);
    const tops = await list
      .getByRole('tab')
      .evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().top)),
      );
    expect(new Set(tops).size).toBeGreaterThan(1);
  });
});

test.describe('segmented control', () => {
  test('arrow keys move the selection', async ({ page }) => {
    const group = page.getByRole('radiogroup').or(page.locator('fieldset')).filter({
      hasText: samples.segmented[0],
    });
    const first = group.first().getByRole('radio', { name: samples.segmented[0] });
    const second = group.first().getByRole('radio', { name: samples.segmented[1] });
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(second).toBeChecked();
    await expect(second).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(first).toBeChecked();
  });
});

test.describe('theme switcher', () => {
  test('the toolbar control sets, saves and announces the theme', async ({ page }) => {
    const toolbar = page.getByRole('region', { name: devCopy.toolbar.label });
    await toolbar.getByText(navCopy.appearance.options.dark.shortLabel, { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(
      page.getByText(navCopy.appearance.changed(navCopy.appearance.options.dark.label)),
    ).toBeAttached();
    expect(await page.evaluate(() => window.localStorage.getItem('mlc-theme'))).toBe('dark');
  });

  test('arrow keys move between Light, Dark and System', async ({ page }) => {
    const toolbar = page.getByRole('region', { name: devCopy.toolbar.label });
    const light = toolbar.getByRole('radio', { name: navCopy.appearance.options.light.shortLabel });
    await light.focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      toolbar.getByRole('radio', { name: navCopy.appearance.options.dark.shortLabel }),
    ).toBeChecked();
  });
});

test.describe('switch and filter chips', () => {
  test('Space toggles a switch', async ({ page }) => {
    const toggle = page.getByRole('switch', { name: samples.switchLabel }).nth(1);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(async () => {
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-checked', 'true', { timeout: 1000 });
    }).toPass();
  });

  test('only one chip is pressed at a time', async ({ page }) => {
    const group = page.getByRole('group', { name: samples.fieldLabel });
    await group.getByRole('button', { name: samples.chips[2] }).click();
    await expect(group.getByRole('button', { name: samples.chips[2] })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(group.getByRole('button', { name: samples.chips[0] })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

test.describe('gallery', () => {
  test('has a section with an id for every entry in the spec', async ({ page }) => {
    for (const section of devCopy.sections) {
      await expect(page.locator(`h2#${section.id}`)).toHaveCount(1);
    }
  });

  test('the toolbar signs in and out', async ({ page }) => {
    const toolbar = page.getByRole('region', { name: devCopy.toolbar.label });
    await toolbar.getByRole('switch', { name: devCopy.toolbar.signedIn }).click();
    await expect(page.locator('html')).toHaveAttribute('data-session', 'signed-in');
    await toolbar.getByRole('switch', { name: devCopy.toolbar.signedIn }).click();
    await expect(page.locator('html')).toHaveAttribute('data-session', 'guest');
  });
});
