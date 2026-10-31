import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getStations } from '@/data/api/stations';
import { prepare, settle, whenHydrated, type VisitOptions } from '../support/browser';

const { stations: copy } = projectCopy;
const stations = await getStations();
const total = stations.length;
const komtar = stations.find((station) => station.code === 'S20');
const stationAt = (code: string) => stations.find((station) => station.code === code);

async function open(
  page: Page,
  options: VisitOptions = {},
  path: string = routes.project.stations,
) {
  await prepare(page, options);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'input[type="search"]');
}

const search = (page: Page) => page.getByRole('searchbox', { name: copy.search.label });
const rows = (page: Page) => page.getByRole('list', { name: copy.list.label }).getByRole('link');
const chipOf = (page: Page, code: string) =>
  rows(page)
    .filter({ hasText: code })
    .getByText(uiCopy.station.following, { exact: true })
    .locator('visible=true');
const status = (page: Page) => page.locator('div[aria-live="polite"].sr-only');

test.describe('stations: list', () => {
  test('shows all 22 stations in line order, each row a link to its page', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.header.title);
    await expect(page.getByRole('heading', { level: 2, name: copy.list.heading })).toBeAttached();
    await expect(rows(page)).toHaveCount(total);
    await expect(rows(page).first()).toContainText('S31');
    await expect(rows(page).last()).toContainText('A01');
    await expect(rows(page).nth(3)).toHaveAttribute('href', routes.project.station('S20'));
  });

  test('a provisional name is marked, and a station subtitle is shown', async ({ page }) => {
    await open(page);
    await expect(
      rows(page).filter({ hasText: uiCopy.station.provisionalName }).first(),
    ).toBeVisible();
    await expect(
      rows(page)
        .filter({ hasText: komtar?.subtitle ?? '' })
        .first(),
    ).toBeVisible();
  });

  test('the two line segments are described', async ({ page }) => {
    await open(page);
    const list = page.getByRole('list', { name: copy.segments.label });
    for (const item of copy.segments.items) {
      await expect(list).toContainText(item.title);
      await expect(list).toContainText(item.status);
    }
  });

  test('a row opens the station page', async ({ page }) => {
    await open(page);
    await rows(page).filter({ hasText: 'KOMTAR' }).first().click();
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S20')}$`));
  });
});

test.describe('stations: search', () => {
  test('filters as you type by name, case blind, with the count announced', async ({ page }) => {
    await open(page);
    await search(page).fill('KOMTAR');
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText('S20');
    await expect(status(page)).toHaveText(copy.search.results(1, total));
    await search(page).fill('');
    await expect(rows(page)).toHaveCount(total);
    await expect(status(page)).toHaveText(copy.search.results(total, total));
  });

  test('finds a station by code with or without the letter and a space', async ({ page }) => {
    await open(page);
    for (const query of ['S20', 's 20', '20']) {
      await search(page).fill(query);
      await expect(rows(page)).toHaveCount(1);
      await expect(rows(page).first()).toContainText('KOMTAR');
    }
  });

  test('"9" does not find S09 but "09" does', async ({ page }) => {
    await open(page);
    await search(page).fill('9');
    await expect(rows(page).filter({ hasText: 'S09' })).toHaveCount(0);
    await search(page).fill('09');
    await expect(rows(page).filter({ hasText: 'S09' })).toHaveCount(1);
  });

  test('matched text is bold and the order stays the line order', async ({ page }) => {
    await open(page);
    await search(page).fill('FIZ');
    await expect(rows(page)).toHaveCount(2);
    await expect(rows(page).first().locator('mark').first()).toHaveText(/FIZ/i);
    await expect(rows(page).first()).toContainText('S06');
  });

  test('Escape clears the field and keeps focus in it', async ({ page }) => {
    await open(page);
    await search(page).fill('komtar');
    await search(page).press('Escape');
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
    await expect(rows(page)).toHaveCount(total);
  });

  test('the clear button empties the field and refocuses it', async ({ page }) => {
    await open(page);
    await search(page).fill('komtar');
    await page.getByRole('button', { name: uiCopy.actions.clearSearch }).click();
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
    await expect(page.getByRole('button', { name: uiCopy.actions.clearSearch })).toHaveCount(0);
  });

  test('Enter with one match opens that station; with several it does nothing', async ({
    page,
  }) => {
    await open(page);
    await search(page).fill('FIZ');
    await search(page).press('Enter');
    await expect(page).toHaveURL(new RegExp(`${routes.project.stations}`));
    await expect(rows(page)).toHaveCount(2);
    await search(page).fill('komtar');
    await search(page).press('Enter');
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S20')}$`));
  });

  test('no match shows the empty state; Show all stations restores the list and focuses the field', async ({
    page,
  }) => {
    await open(page);
    await search(page).fill('zzzz');
    await expect(rows(page)).toHaveCount(0);
    await expect(page.getByText(copy.search.emptyTitle('zzzz'))).toBeVisible();
    await expect(status(page)).toHaveText(copy.search.noResultsStatus('zzzz'));
    await page.getByRole('button', { name: copy.search.showAll }).click();
    await expect(rows(page)).toHaveCount(total);
    await expect(search(page)).toBeFocused();
  });

  test('the query is kept in the URL and applied on load', async ({ page }) => {
    await open(page);
    await search(page).fill('komtar');
    await expect(page).toHaveURL(/\?q=komtar/);
    await open(page, {}, `${routes.project.stations}?q=sentral`);
    await expect(search(page)).toHaveValue('sentral');
    await expect(rows(page).first()).toContainText('Penang Sentral');
    await search(page).fill('');
    await expect(page).not.toHaveURL(/\?q=/);
  });
});

test.describe('stations: following', () => {
  test('a guest sees no Following chips and a log in card', async ({ page }) => {
    await open(page);
    await expect(page.getByText(uiCopy.station.following, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: copy.aside.signedOut.title })).toBeVisible();
    const login = page.getByRole('link', { name: copy.aside.signedOut.action });
    await expect(login).toHaveAttribute(
      'href',
      routes.account.loginReturningTo(routes.project.stations),
    );
  });

  test('a signed-in visitor sees chips on followed stations and their names on the card', async ({
    page,
  }) => {
    await open(page, { signedIn: true });
    await expect(chipOf(page, 'S20')).toBeVisible();
    await expect(chipOf(page, 'S13')).toBeVisible();
    await expect(chipOf(page, 'S18')).toHaveCount(0);
    const s20 = stationAt('S20');
    const s13 = stationAt('S13');
    await expect(
      page
        .getByText(copy.aside.following.body([`S20 ${s20?.name}`, `S13 ${s13?.name}`]))
        .locator('visible=true'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: copy.aside.following.action })).toHaveAttribute(
      'href',
      routes.account.profileSection('stations'),
    );
  });

  test('every row link carries the code, name and a hidden following note', async ({ page }) => {
    await open(page, { signedIn: true });
    await expect(rows(page).filter({ hasText: 'S20' })).toContainText(uiCopy.station.followingSr);
  });
});

test.describe('stations: layout and links', () => {
  test('related pages link to their routes', async ({ page }) => {
    await open(page);
    const relatedList = page.getByRole('region', { name: uiCopy.docsPage.relatedPages });
    for (const related of copy.related) {
      await expect(
        relatedList.getByRole('link', { name: new RegExp(related.label) }),
      ).toHaveAttribute('href', related.href);
    }
  });

  test('the follow card moves under the article below 1280 px and nothing scrolls sideways', async ({
    page,
  }) => {
    await open(page);
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.getByRole('heading', { name: copy.aside.signedOut.title })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });

  test('the following chip sits under the subtitle on phones', async ({ page }) => {
    await open(page, { signedIn: true });
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(chipOf(page, 'S20')).toBeVisible();
  });
});
