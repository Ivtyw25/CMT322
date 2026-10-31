import { expect, test, type Locator, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { notificationCopy } from '@/content/notifications';
import { uiCopy } from '@/content/ui';
import { prepare, settle, whenHydrated } from '../../support/browser';

const { traffic } = devCopy;

async function openGallery(page: Page, width = 1280, hash = '') {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${routes.dev.components}${hash}`);
  await settle(page);
}

const section = (page: Page, id: string) =>
  page.locator('section', { has: page.locator(`#${id}`) });

const specimen = (page: Page, id: string, caption: string): Locator =>
  section(page, id)
    .locator('div', { has: page.getByRole('heading', { name: caption, exact: true }) })
    .last();

test.describe('pagination', () => {
  test('7 pages or fewer show every number; the current page is marked', async ({ page }) => {
    await openGallery(page);
    const nav = specimen(page, 'pagination', traffic.paginationFew).getByRole('navigation', {
      name: traffic.paginationLabel,
    });
    await expect(nav.getByRole('link')).toHaveCount(7);
    await expect(nav.getByRole('link', { name: uiCopy.pagination.page(2) })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(nav.getByRole('link', { name: uiCopy.pagination.page(3) })).toHaveAttribute(
      'href',
      `${routes.dev.components}?page=3#pagination`,
    );
    await expect(nav.getByRole('link', { name: uiCopy.pagination.previous })).toBeVisible();
  });

  test('more pages show first, last, current and its neighbours, with unfocusable gaps', async ({
    page,
  }) => {
    await openGallery(page);
    const nav = specimen(page, 'pagination', traffic.paginationMany).getByRole('navigation', {
      name: traffic.paginationLabel,
    });
    const numbers = nav.getByRole('link').filter({ hasText: /^\d+$/ });
    await expect(numbers).toHaveText(['1', '5', '6', '7', '12']);
    await expect(nav.getByText(uiCopy.pagination.ellipsis)).toHaveCount(2);
    await expect(nav.getByRole('link', { name: uiCopy.pagination.page(6) })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('on the last page "next" is disabled and not a link', async ({ page }) => {
    await openGallery(page);
    const nav = specimen(page, 'pagination', traffic.paginationEnd).getByRole('navigation', {
      name: traffic.paginationLabel,
    });
    await expect(nav.getByRole('link', { name: uiCopy.pagination.next })).toHaveCount(0);
    await expect(nav.locator('[aria-disabled="true"]')).toHaveAttribute(
      'aria-label',
      uiCopy.pagination.next,
    );
  });
});

test.describe('tabs with counts', () => {
  test('the count is part of the tab name, and arrow keys move between tabs', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#tabs) [role="tab"]');
    const box = specimen(page, 'tabs', traffic.tabsCountCaption);
    const first = box.getByRole('tab', { name: 'Current, 3' });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(box.getByRole('tab', { name: 'Upcoming, 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

test.describe('segmented control as links', () => {
  test('it is a navigation of links; the current one has aria-current', async ({ page }) => {
    await openGallery(page);
    const nav = specimen(page, 'segmented-control', traffic.segmentedLinksCaption).getByRole(
      'navigation',
      { name: traffic.segmentedLinks.label },
    );
    await expect(nav.getByRole('link')).toHaveCount(2);
    await expect(nav.getByRole('link', { name: traffic.segmentedLinks.route })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const map = nav.getByRole('link', { name: traffic.segmentedLinks.map });
    await expect(map).toHaveAttribute('href', routes.traffic.map);
    await expect(map).not.toHaveAttribute('aria-current', 'page');
  });
});

test.describe('search input', () => {
  test('the clear button appears with text, empties the field and returns focus', async ({
    page,
  }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#form-fields) input');
    const box = specimen(page, 'form-fields', traffic.searchCaption);
    const input = box.getByRole('searchbox', { name: traffic.searchLabel });
    const clear = box.getByRole('button', { name: uiCopy.form.search.clear });
    await expect(clear).toHaveCount(0);
    await input.fill('Jalan');
    await expect(clear).toBeVisible();
    await clear.click();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await expect(clear).toHaveCount(0);
  });
});

test.describe('line diagram and rail in select mode', () => {
  const stationButton = (box: Locator, name: RegExp) => box.getByRole('button', { name });

  test('the diagram stations are toggle buttons that show road changes', async ({ page }) => {
    await openGallery(page, 1440);
    await whenHydrated(page, 'section:has(#line-diagram) button');
    const box = specimen(page, 'line-diagram', traffic.lineCaption);
    await expect(box.getByRole('button', { name: /^[SA]\d+ / })).toHaveCount(22);
    const s09 = stationButton(box, /^S09 .*2 road changes nearby$/);
    await expect(s09).toHaveAttribute('aria-pressed', 'false');
    await s09.click();
    await expect(s09).toHaveAttribute('aria-pressed', 'true');
    await expect(box.getByRole('status')).toContainText(traffic.lineSelected(''));
    await s09.click();
    await expect(s09).toHaveAttribute('aria-pressed', 'false');
    await expect(box.getByRole('status')).toHaveText(traffic.lineNone);
  });

  test('the rail rows are toggle buttons with a hidden count', async ({ page }) => {
    await openGallery(page, 390);
    await whenHydrated(page, 'section:has(#line-diagram) button');
    const box = specimen(page, 'line-diagram', traffic.lineCaption);
    const rows = box.locator('ol[aria-label] > li').getByRole('button');
    await expect(rows).toHaveCount(22);
    const s09 = rows.filter({ hasText: traffic.lineNote(2) }).filter({ hasText: 'S09' });
    await expect(s09).toHaveCount(1);
    await s09.click();
    await expect(s09).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('map with traffic layers', () => {
  const map = (page: Page) => specimen(page, 'map', traffic.mapCaption);
  const status = (box: Locator, text: string) => box.getByText(text, { exact: true });

  /** The map is loaded on demand: wait for its markers before using it. */
  async function ready(box: Locator) {
    await expect(box.locator('.leaflet-marker-icon').first()).toBeAttached({ timeout: 30_000 });
  }

  test('a marker is chosen with the keyboard and opens its popup; Escape closes it', async ({
    page,
  }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#map) button');
    const box = map(page);
    await ready(box);
    const hazard = box.getByRole('button', { name: 'Uneven road surface', exact: true });
    await hazard.focus();
    await page.keyboard.press('Enter');
    await expect(status(box, traffic.mapSelected('sample-hazard'))).toBeVisible();
    await expect(box.locator('.leaflet-popup')).toContainText('Uneven road surface');
    await page.keyboard.press('Escape');
    await expect(box.locator('.leaflet-popup')).toHaveCount(0);
    await expect(status(box, traffic.mapNone)).toBeVisible();
  });

  test('"focus" opens the popup again for the same item when the key changes', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#map) button');
    const box = map(page);
    await ready(box);
    const focusButton = box.getByRole('button', { name: traffic.mapFocusButton });
    await focusButton.click();
    await expect(box.locator('.leaflet-popup')).toContainText('Uneven road surface');
    await box.getByRole('button', { name: traffic.mapClearButton }).click();
    await expect(box.locator('.leaflet-popup')).toHaveCount(0);
    await focusButton.click();
    await expect(box.locator('.leaflet-popup')).toContainText('Uneven road surface');
  });

  test('the selected marker has the halo; the others do not', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#map) button');
    const box = map(page);
    await ready(box);
    await box.getByRole('button', { name: traffic.mapFocusButton }).click();
    await expect(box.locator('.leaflet-marker-icon[data-selected="true"]')).toHaveCount(1);
    await expect(box.locator('.leaflet-marker-icon[data-selected="false"]')).toHaveCount(1);
  });

  test('a label shows from its zoom level; the reset button and 40 px controls are there', async ({
    page,
  }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#map) button');
    const box = map(page);
    await ready(box);
    await expect(box.getByText(traffic.mapTag.text, { exact: true })).toBeVisible();
    const zoomOut = box.getByRole('button', { name: uiCopy.map.zoomOut });
    expect((await zoomOut.boundingBox())?.width).toBe(40);
    await zoomOut.click();
    // Leaflet ignores a zoom click while the 250 ms zoom animation is running.
    await page.waitForTimeout(400);
    await zoomOut.click();
    await expect(box.getByText(traffic.mapTag.text, { exact: true })).toHaveCount(0);
    await box.getByRole('button', { name: traffic.mapCentreLabel }).click();
    await expect(box.getByText(traffic.mapTag.text, { exact: true })).toBeVisible();
  });
});

test.describe('useQueryParams', () => {
  test('writes with replace, drops the default and keeps the hash', async ({ page }) => {
    await openGallery(page, 1280, '#query-params');
    await whenHydrated(page, 'section:has(#query-params) button');
    const box = specimen(page, 'query-params', traffic.queryCaption);
    const status = box.getByRole('status');
    const entries = await page.evaluate(() => window.history.length);
    await box.getByRole('button', { name: traffic.queryWeek }).click();
    await expect(status).toHaveText(traffic.queryShow('week', traffic.queryNone));
    await expect(page).toHaveURL(/\?when=week#query-params$/);
    await box.getByRole('button', { name: traffic.queryHide }).click();
    await expect(page).toHaveURL(/\?when=week&hide=closure#query-params$/);
    await box.getByRole('button', { name: traffic.queryNow }).click();
    await expect(page).toHaveURL(/\?hide=closure#query-params$/);
    expect(await page.evaluate(() => window.history.length)).toBe(entries);
  });
});

test.describe('workspace layout', () => {
  async function openWorkspace(page: Page, width: number) {
    await prepare(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto(routes.dev.workspace);
    await settle(page);
    await whenHydrated(page, 'main#main');
  }

  const chromeHeight = (page: Page) =>
    page.evaluate(() => {
      const shell = document.querySelector('main#main')?.parentElement;
      return parseFloat(shell?.style.getPropertyValue('--chrome-h') ?? '');
    });

  test('from 1024 px there is no footer and the content fills the window under the header', async ({
    page,
  }) => {
    await openWorkspace(page, 1280);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: traffic.workspaceTitle })).toBeVisible();
    await expect.poll(() => chromeHeight(page)).toBeGreaterThan(60);
    const main = await page.locator('main#main').boundingBox();
    const chrome = await chromeHeight(page);
    expect(main?.y).toBeCloseTo(chrome, 0);
    expect(main?.height).toBeCloseTo(800 - chrome, 0);
  });

  test('closing the site notice makes the content taller', async ({ page }) => {
    await openWorkspace(page, 1280);
    await expect.poll(() => chromeHeight(page)).toBeGreaterThan(60);
    const before = await chromeHeight(page);
    await page
      .getByRole('region', { name: 'Site notice' })
      .getByRole('button', { name: notificationCopy.dismiss })
      .click();
    await expect.poll(() => chromeHeight(page)).toBeLessThan(before);
    const chrome = await chromeHeight(page);
    expect((await page.locator('main#main').boundingBox())?.height).toBeCloseTo(800 - chrome, 0);
  });

  test('below 1024 px the page scrolls as usual', async ({ page }) => {
    await openWorkspace(page, 390);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    const overflow = await page
      .locator('main#main')
      .evaluate((main) => getComputedStyle(main).overflowY);
    expect(overflow).toBe('visible');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });
});
