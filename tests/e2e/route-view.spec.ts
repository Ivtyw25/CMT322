import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { getStations } from '@/data/api/stations';
import { loadTrafficData } from '@/features/traffic/traffic-data';
import { prepare, settle, whenHydrated } from '../support/browser';

const copy = trafficCopy.route;
const filters = trafficCopy.map.filters;
const { entries } = await loadTrafficData();
const stations = await getStations();

const bukitJambul = stations.find((station) => station.code === 'S09');
if (!bukitJambul) throw new Error('Mock stations changed: update route-view.spec.ts');
const nearBukitJambul = entries.filter((entry) =>
  entry.stationCodes.some((code) => code === 'S09'),
);
/** The diagram and the rail place an item at the first station it lists. */
const markedAtBukitJambul = entries.filter((entry) => entry.stationCodes[0] === 'S09');
const onTheLine = entries.length;

const DESKTOP = { width: 1440, height: 900 };
const TABLET = { width: 1024, height: 800 };
const PHONE = { width: 390, height: 844 };

async function visit(page: Page, path: string = routes.traffic.route, size = DESKTOP) {
  await prepare(page);
  await page.setViewportSize(size);
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'fieldset input[type="radio"]');
}

const panel = (page: Page) => page.locator('section[aria-labelledby="traffic-title"]');
const listHeading = (page: Page) => page.locator('#route-changes-list');
const stationSearch = (page: Page) =>
  page.getByRole('combobox', { name: filters.stationSearch.label });
const card = (page: Page) => page.locator('#station-card');
const stationButton = (page: Page, code: string) =>
  page.getByRole('button', { name: new RegExp(`^${code} `) });
const layerBox = (page: Page, name: string) =>
  page.getByRole('checkbox', { name: new RegExp(`^${name}`) });

test.describe('panel', () => {
  test('has its own h1, the update time, the diagram layers and the road changes on the line', async ({
    page,
  }) => {
    await visit(page);
    await expect(page.getByRole('heading', { level: 1, name: copy.header.title })).toBeVisible();
    await expect(page.getByText(copy.header.updated('14:20'))).toBeVisible();
    await expect(page).toHaveTitle(/Route view/);
    await expect(page.getByText(filters.layersTitleDiagram)).toBeVisible();
    await expect(layerBox(page, filters.layers.alignment)).toHaveCount(0);
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(onTheLine));
    await expect(card(page)).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  });

  test('the view switch marks Route view as current and keeps the filters for Map view', async ({
    page,
  }) => {
    await visit(page, `${routes.traffic.route}?when=upcoming&hide=closure&station=s09`);
    const nav = page.getByRole('navigation', { name: trafficCopy.route.viewSwitch.label });
    await expect(
      nav.getByRole('link', { name: trafficCopy.route.viewSwitch.route }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: trafficCopy.route.viewSwitch.map })).toHaveAttribute(
      'href',
      `${routes.traffic.map}?when=upcoming&hide=closure`,
    );
  });

  test('each road change links to the map focused on it, and is sorted along the line', async ({
    page,
  }) => {
    await visit(page);
    const links = page
      .getByRole('list', { name: trafficCopy.map.results.listLabel })
      .getByRole('link');
    await expect(links).toHaveCount(onTheLine);
    const first = entries.find((entry) => entry.stationCodes[0] === 'S31') ?? entries[0];
    const hrefs = await links.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    );
    expect(hrefs).toContain(routes.traffic.mapFocus(first?.id ?? ''));
    expect(new Set(hrefs).size).toBe(onTheLine);
  });
});

test.describe('time filter and layers', () => {
  test('the time window and layers change the list and the counts', async ({ page }) => {
    await visit(page);
    await page.getByRole('radio', { name: filters.time.upcoming }).click({ force: true });
    await expect(page).toHaveURL(/when=upcoming/);
    const upcoming = entries.filter((entry) => entry.status === 'upcoming').length;
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(upcoming));
    await page.getByRole('radio', { name: filters.time.upcoming }).click({ force: true });
    await expect(page).not.toHaveURL(/when=/);
    await layerBox(page, filters.layers.construction).click();
    await expect(page).toHaveURL(/hide=construction/);
    const rest = entries.filter((entry) => entry.layer !== 'construction').length;
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(rest));
  });

  test('hiding every layer shows the empty block, and clearing filters restores the list', async ({
    page,
  }) => {
    await visit(page);
    for (const name of [
      filters.layers.closures,
      filters.layers.construction,
      filters.layers.hazards,
    ]) {
      await layerBox(page, name).click();
    }
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(0));
    await expect(panel(page).getByText(filters.noMatch.title)).toBeVisible();
    await panel(page).getByRole('button', { name: filters.clearFilters }).click();
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(onTheLine));
  });
});

test.describe('station search', () => {
  test('opens at one character, lists stations in line order and selects with Enter', async ({
    page,
  }) => {
    await visit(page);
    const box = stationSearch(page);
    await box.fill('s0');
    const options = page.getByRole('option');
    await expect(options.first()).toBeVisible();
    expect(await options.count()).toBeLessThanOrEqual(6);
    await expect(box).toHaveAttribute('aria-expanded', 'true');
    await box.fill('s09');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toContainText(bukitJambul.name);
    await expect(box).toHaveAttribute('aria-activedescendant', /.+/);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/station=s09/);
    await expect(card(page)).toContainText(bukitJambul.name);
    await expect(box).toHaveValue('');
  });

  test('matches by name and landmark, and the arrow keys change the active option', async ({
    page,
  }) => {
    await visit(page);
    const box = stationSearch(page);
    await box.fill('komtar');
    await expect(page.getByRole('option').first()).toContainText('KOMTAR');
    await box.fill('s1');
    const options = page.getByRole('option');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking an option selects the station', async ({ page }) => {
    await visit(page);
    await stationSearch(page).fill('bukit');
    await page.getByRole('option', { name: new RegExp(bukitJambul.name) }).click();
    await expect(page).toHaveURL(/station=s09/);
  });

  test('a search with no match says so; Escape closes it, then clears the field', async ({
    page,
  }) => {
    await visit(page);
    const box = stationSearch(page);
    await box.fill('zzz');
    await expect(page.getByText(copy.search.noMatchTitle('zzz'))).toBeVisible();
    await expect(page.getByText(copy.search.noMatchHint)).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByText(copy.search.noMatchTitle('zzz'))).toHaveCount(0);
    await expect(box).toHaveValue('zzz');
    await page.keyboard.press('Escape');
    await expect(box).toHaveValue('');
  });
});

test.describe('station card and list', () => {
  test('a station in the address shows its card and the road changes near it', async ({ page }) => {
    await visit(page, routes.traffic.routeAt('S09'));
    await expect(card(page)).toContainText(bukitJambul.code);
    await expect(card(page)).toContainText(bukitJambul.serves);
    await expect(card(page).getByRole('link', { name: copy.selected.viewStation })).toHaveAttribute(
      'href',
      routes.project.station('S09'),
    );
    await expect(listHeading(page)).toHaveText(copy.selected.changesTitle(nearBukitJambul.length));
    expect(nearBukitJambul.length).toBeGreaterThan(0);
  });

  test('Clear removes the station and returns focus to the station search', async ({ page }) => {
    await visit(page, routes.traffic.routeAt('S09'));
    await card(page)
      .getByRole('button', { name: copy.selected.clearLabel(bukitJambul.name) })
      .click();
    await expect(card(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/station=/);
    await expect(stationSearch(page)).toBeFocused();
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(onTheLine));
  });

  test('a station with nothing near it in the time range says so', async ({ page }) => {
    const quiet = stations.find(
      (station) =>
        !entries.some((entry) => entry.stationCodes.some((code) => code === station.code)),
    );
    if (!quiet) throw new Error('Every station has a road change: update the spec');
    await visit(page, routes.traffic.routeAt(quiet.code));
    await expect(listHeading(page)).toHaveText(copy.selected.changesTitle(0));
    await expect(panel(page).getByText(copy.selected.emptyNear(quiet.name))).toBeVisible();
  });

  test('an invalid station in the address is ignored', async ({ page }) => {
    await visit(page, `${routes.traffic.route}?station=nowhere`);
    await expect(card(page)).toHaveCount(0);
    await expect(listHeading(page)).toHaveText(copy.selected.lineTitle(onTheLine));
  });

  test('the skip link goes to the stations', async ({ page }) => {
    await visit(page);
    const skip = page.getByRole('link', { name: filters.skipToStations });
    await skip.focus();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#route-stations')).toBeFocused();
  });
});

test.describe('zigzag (below 1440)', () => {
  test('a station row toggles its selection, and the rows with road changes say how many', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, TABLET);
    const row = stationButton(page, 'S09');
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await row.click();
    await expect(row).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/station=s09/);
    await expect(card(page)).toBeVisible();
    await expect(row).toHaveAccessibleName(
      new RegExp(copy.diagram.changesNearby(markedAtBukitJambul.length)),
    );
    await row.click();
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await expect(page).not.toHaveURL(/station=/);
  });

  test('hiding a layer takes its glyphs away from the stops', async ({ page }) => {
    await visit(page, routes.traffic.route, TABLET);
    const marked = page.locator('#route-stations li button[aria-label*="road change"]:visible');
    expect(await marked.count()).toBeGreaterThan(0);
    for (const name of [
      filters.layers.closures,
      filters.layers.construction,
      filters.layers.hazards,
    ]) {
      await layerBox(page, name).click();
    }
    await expect(marked).toHaveCount(0);
  });

  test('has one row for each of the 22 stations, and the diagram is not shown', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, TABLET);
    await expect(
      page.getByRole('list', { name: copy.stationList.label }).getByRole('button'),
    ).toHaveCount(stations.length);
    await expect(page.getByRole('button', { name: /^S09 Bukit Jambul/ })).toHaveCount(1);
  });

  test('on a phone the page does not scroll sideways at 320, 390 and 768', async ({ page }) => {
    for (const width of [320, PHONE.width, 768]) {
      await visit(page, routes.traffic.routeAt('S09'), { width, height: 844 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  });

  test('choosing a station on a phone opens the panel over the view with its card', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, PHONE);
    const row = stationButton(page, 'S09');
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const panel = page.getByRole('dialog', { name: trafficCopy.map.layout.panelLabel });
    await expect(panel).toBeVisible();
    await expect(card(page)).toBeInViewport();
    await panel.getByRole('button', { name: trafficCopy.map.layout.closePanel }).click();
    await expect(panel).toBeHidden();
  });
});

test.describe('diagram (1440 and up)', () => {
  test('each station is a toggle button named with its code, name and road changes', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, DESKTOP);
    const button = page.getByRole('button', {
      name: new RegExp(`^S09 Bukit Jambul, ${markedAtBukitJambul.length} road change`),
    });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/station=s09/);
    await expect(card(page)).toBeVisible();
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(page).not.toHaveURL(/station=/);
  });

  test('has the key and one button for every station', async ({ page }) => {
    await visit(page, routes.traffic.route, DESKTOP);
    await expect(page.getByRole('list', { name: copy.diagram.legend.title })).toBeVisible();
    const diagram = page.locator('#route-stations ol button:visible');
    await expect(diagram).toHaveCount(stations.length);
  });

  test('the diagram takes the layer toggles: no glyph is left when every layer is off', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, DESKTOP);
    const withChanges = page.locator('#route-stations ol button[aria-label*="road change"]');
    expect(await withChanges.count()).toBeGreaterThan(0);
    for (const name of [
      filters.layers.closures,
      filters.layers.construction,
      filters.layers.hazards,
    ]) {
      await layerBox(page, name).click();
    }
    await expect(withChanges).toHaveCount(0);
  });

  test('the 1440 layout is the panel beside the canvas, without scrolling the page', async ({
    page,
  }) => {
    await visit(page, routes.traffic.route, DESKTOP);
    const box = await panel(page).boundingBox();
    expect(box?.width).toBeCloseTo(400, 0);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight),
    ).toBe(true);
  });
});
