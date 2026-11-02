import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { uiCopy } from '@/content/ui';
import { loadTrafficData } from '@/features/traffic/traffic-data';
import { prepare, settle, whenHydrated } from '../support/browser';

const copy = trafficCopy.map;
const { entries } = await loadTrafficData();

const total = entries.length;
const byLayer = (layer: string) => entries.filter((entry) => entry.layer === layer);
const closure = entries.find((entry) => entry.layer === 'closure' && entry.announcementId);
const hazard = entries.find((entry) => entry.layer === 'hazard');
/** A hazard reported on the road: no working hours. */
const reportedHazard = entries.find(
  (entry) => entry.layer === 'hazard' && entry.hoursText === null,
);
const construction = entries.find((entry) => entry.layer === 'construction');
if (!closure || !hazard || !reportedHazard || !construction)
  throw new Error('Mock traffic data changed: update spec');
const nowCount = entries.filter((entry) => entry.status === 'active').length;
const weekCount = entries.filter((entry) => entry.inWeek).length;
const upcomingCount = entries.filter((entry) => entry.status === 'upcoming').length;

const DESKTOP = { width: 1440, height: 900 };
const TABLET = { width: 1024, height: 800 };
const PHONE = { width: 390, height: 844 };

async function visit(page: Page, path: string = routes.traffic.map, size = DESKTOP) {
  await prepare(page);
  await page.setViewportSize(size);
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'fieldset input[type="radio"]');
}

const panel = (page: Page) => page.locator('section[aria-labelledby="traffic-title"]');
const listHeading = (page: Page) => page.locator('#road-changes-list');
const search = (page: Page) =>
  page.getByRole('searchbox', { name: copy.filters.placeSearch.label });
const item = (page: Page, id: string) => page.locator(`#road-change-${id}`);
const popup = (page: Page) => page.locator('.leaflet-popup');
const timeOption = (page: Page, label: string) => page.getByRole('radio', { name: label });
const layerBox = (page: Page, name: string) =>
  page.getByRole('checkbox', { name: new RegExp(`^${name}`) });

test.describe('panel', () => {
  test('shows the title, the update time and every road change that has not ended', async ({
    page,
  }) => {
    await visit(page);
    await expect(page.getByRole('heading', { level: 1, name: copy.header.title })).toBeVisible();
    await expect(page.getByText(copy.header.updated('14:20'))).toBeVisible();
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
    await expect(
      page.getByRole('list', { name: copy.results.listLabel }).getByRole('listitem'),
    ).toHaveCount(total);
    await expect(page).toHaveTitle(/Traffic map/);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  });

  test('layer counts follow the time filter and ignore whether a layer is shown', async ({
    page,
  }) => {
    await visit(page);
    const name = copy.filters.layers;
    await expect(layerBox(page, name.closures)).toHaveAccessibleName(
      copy.filters.layerCount(name.closures, byLayer('closure').length),
    );
    await expect(layerBox(page, name.hazards)).toHaveAccessibleName(
      copy.filters.layerCount(name.hazards, byLayer('hazard').length),
    );
    await layerBox(page, name.hazards).click();
    await expect(layerBox(page, name.hazards)).toHaveAccessibleName(
      copy.filters.layerCount(name.hazards, byLayer('hazard').length),
    );
  });

  test('the view switch marks Map view as current and keeps the filters for Route view', async ({
    page,
  }) => {
    await visit(page, `${routes.traffic.map}?when=week&hide=hazard,lrt`);
    const nav = page.getByRole('navigation', { name: copy.viewSwitch.label });
    await expect(nav.getByRole('link', { name: copy.viewSwitch.map })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(nav.getByRole('link', { name: copy.viewSwitch.route })).toHaveAttribute(
      'href',
      `${routes.traffic.route}?when=week&hide=hazard`,
    );
  });
});

test.describe('time filter', () => {
  test('choosing a window filters the list and writes it to the address with replace', async ({
    page,
  }) => {
    await visit(page);
    await timeOption(page, copy.filters.time.now).click({ force: true });
    await expect(page).toHaveURL(/when=now/);
    await expect(listHeading(page)).toHaveText(copy.results.title(nowCount));
    await timeOption(page, copy.filters.time.week).click({ force: true });
    await expect(page).toHaveURL(/when=week/);
    await expect(listHeading(page)).toHaveText(copy.results.title(weekCount));
    await timeOption(page, copy.filters.time.upcoming).click({ force: true });
    await expect(listHeading(page)).toHaveText(copy.results.title(upcomingCount));
    expect(await page.evaluate(() => window.history.length)).toBeLessThanOrEqual(2);
  });

  test('the arrow keys move and select; choosing the selected window again shows everything', async ({
    page,
  }) => {
    await visit(page, `${routes.traffic.map}?when=now`);
    await timeOption(page, copy.filters.time.now).focus();
    await page.keyboard.press('ArrowRight');
    await expect(timeOption(page, copy.filters.time.week)).toBeChecked();
    await expect(page).toHaveURL(/when=week/);
    await timeOption(page, copy.filters.time.week).click({ force: true });
    await expect(page).not.toHaveURL(/when=/);
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });

  test('an invalid value in the address is ignored', async ({ page }) => {
    await visit(page, `${routes.traffic.map}?when=never&hide=nothing`);
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });
});

test.describe('layer toggles', () => {
  test('hiding a layer removes its markers and list items and is written to the address', async ({
    page,
  }) => {
    await visit(page);
    await layerBox(page, copy.filters.layers.hazards).click();
    await expect(page).toHaveURL(/hide=hazard/);
    await expect(listHeading(page)).toHaveText(
      copy.results.title(total - byLayer('hazard').length),
    );
    await expect(item(page, hazard.id)).toHaveCount(0);
    await layerBox(page, copy.filters.layers.hazards).click();
    await expect(page).not.toHaveURL(/hide=/);
    await expect(item(page, hazard.id)).toBeVisible();
  });

  test('hiding the LRT alignment keeps the count and removes the line', async ({ page }) => {
    await visit(page);
    await expect(page.locator('.leaflet-pane path.stroke-primary-600').first()).toBeAttached({
      timeout: 30_000,
    });
    await layerBox(page, copy.filters.layers.alignment).click();
    await expect(page).toHaveURL(/hide=lrt/);
    await expect(page.locator('.leaflet-pane path.stroke-primary-600')).toHaveCount(0);
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });

  test('with every layer hidden the list says so, and "Clear filters" brings everything back', async ({
    page,
  }) => {
    await visit(page);
    for (const name of [
      copy.filters.layers.closures,
      copy.filters.layers.construction,
      copy.filters.layers.hazards,
    ]) {
      await layerBox(page, name).click();
    }
    await expect(listHeading(page)).toHaveText(copy.results.title(0));
    await expect(panel(page).getByText(copy.filters.noMatch.layers)).toBeVisible();
    await panel(page).getByRole('button', { name: copy.filters.clearFilters }).click();
    await expect(page).not.toHaveURL(/hide=/);
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });

  test('a change in the filters is announced politely', async ({ page }) => {
    await visit(page);
    await layerBox(page, copy.filters.layers.hazards).click();
    await expect(panel(page).getByRole('status')).toHaveText(
      copy.filters.liveRegion(total - byLayer('hazard').length),
    );
  });
});

test.describe('search', () => {
  test('filters the list as you type and writes q to the address after a pause', async ({
    page,
  }) => {
    await visit(page);
    await search(page).fill('gelugor');
    const matching = entries.filter((entry) => entry.searchText.includes('gelugor')).length;
    expect(matching).toBeGreaterThan(0);
    await expect(listHeading(page)).toHaveText(copy.results.title(matching));
    await expect(page).toHaveURL(/q=gelugor/);
  });

  test('matches without regard to case or the hyphen, and Escape clears the field', async ({
    page,
  }) => {
    await visit(page);
    await search(page).fill('JALAN-sultan');
    await expect(item(page, closure.id)).toBeVisible();
    await search(page).press('Escape');
    await expect(search(page)).toHaveValue('');
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
    await expect(page).not.toHaveURL(/q=/);
  });

  test('a search with no match shows the empty block and the clear button empties the field', async ({
    page,
  }) => {
    await visit(page);
    await search(page).fill('zzzz');
    await expect(listHeading(page)).toHaveText(copy.results.title(0));
    await expect(panel(page).getByText(copy.filters.noMatch.title)).toBeVisible();
    await page.getByRole('button', { name: uiCopy.form.search.clear }).click();
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });

  test('is limited to 60 characters', async ({ page }) => {
    await visit(page);
    await expect(search(page)).toHaveAttribute('maxlength', '60');
  });

  test('an empty time range says nothing is planned, and clearing filters resets it', async ({
    page,
  }) => {
    await visit(page, `${routes.traffic.map}?when=now&q=night`);
    const fromNight = entries.filter(
      (entry) => entry.status === 'active' && entry.searchText.includes('night'),
    ).length;
    await expect(listHeading(page)).toHaveText(copy.results.title(fromNight));
    if (fromNight === 0) {
      await expect(panel(page).getByText(copy.filters.noMatch.range)).toBeVisible();
    }
    await timeOption(page, copy.filters.time.upcoming).click({ force: true });
    await expect(page).toHaveURL(/when=upcoming/);
  });
});

test.describe('list, markers and popup', () => {
  test('choosing a list item selects it, opens its popup and writes focus to the address', async ({
    page,
  }) => {
    await visit(page);
    await item(page, closure.id).click();
    await expect(item(page, closure.id)).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(new RegExp(`focus=${closure.id}`));
    await expect(popup(page)).toContainText(closure.title);
    await expect(popup(page)).toContainText(closure.dateText);
    await expect(popup(page)).toContainText(closure.hoursText ?? '');
    const dialog = popup(page).getByRole('dialog', { name: closure.title });
    await expect(dialog.getByRole('link', { name: copy.popup.readAnnouncement })).toHaveAttribute(
      'href',
      routes.traffic.announcement(closure.announcementId ?? ''),
    );
    await expect(dialog.getByRole('link', { name: copy.popup.reportProblem })).toHaveAttribute(
      'href',
      routes.reportTrack.reportAt(closure.stationCodes[0] ?? ''),
    );
  });

  test('choosing the selected item again deselects it and closes the popup', async ({ page }) => {
    await visit(page, `${routes.traffic.map}?focus=${closure.id}`);
    await expect(popup(page)).toBeVisible();
    await item(page, closure.id).click();
    await expect(item(page, closure.id)).toHaveAttribute('aria-pressed', 'false');
    await expect(popup(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/focus=/);
  });

  test('a marker opens its popup from the keyboard, selects the list item, and Escape closes it', async ({
    page,
  }) => {
    await visit(page);
    const marker = page.getByRole('button', {
      name: `${copy.filters.layerSingular.hazard}: ${hazard.title}, ${hazard.dateText}`,
    });
    await expect(marker).toBeAttached({ timeout: 30_000 });
    await marker.focus();
    await page.keyboard.press('Enter');
    await expect(popup(page)).toContainText(hazard.title);
    await expect(item(page, hazard.id)).toHaveAttribute('aria-pressed', 'true');
    await expect(popup(page).getByRole('link', { name: copy.popup.readAnnouncement })).toHaveCount(
      0,
    );
    await page.keyboard.press('Escape');
    await expect(popup(page)).toHaveCount(0);
    await expect(item(page, hazard.id)).toHaveAttribute('aria-pressed', 'false');
  });

  test('a hazard popup has no hours, and a road work has no announcement link', async ({
    page,
  }) => {
    await visit(page, `${routes.traffic.map}?focus=${reportedHazard.id}`);
    await expect(popup(page)).toContainText(reportedHazard.dateText);
    await expect(popup(page).locator('svg.lucide-clock')).toHaveCount(0);
    await visit(page, `${routes.traffic.map}?focus=${construction.id}`);
    const links = popup(page).getByRole('link');
    if (!construction.announcementId) {
      await expect(links.filter({ hasText: copy.popup.readAnnouncement })).toHaveCount(0);
    }
    await expect(links.filter({ hasText: copy.popup.reportProblem })).toBeVisible();
  });

  test('the popup closes with its close button', async ({ page }) => {
    await visit(page, `${routes.traffic.map}?focus=${closure.id}`);
    await popup(page).locator('.leaflet-popup-close-button').click();
    await expect(popup(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/focus=/);
  });

  test('a link to an item that the filters hide clears them so it still lands', async ({
    page,
  }) => {
    const upcoming = entries.find((entry) => entry.status === 'upcoming');
    if (!upcoming) throw new Error('No upcoming item in the mock data');
    await visit(
      page,
      `${routes.traffic.map}?when=now&hide=closure,construction,hazard&focus=${upcoming.id}`,
    );
    await expect(item(page, upcoming.id)).toHaveAttribute('aria-pressed', 'true');
    await expect(page).not.toHaveURL(/when=|hide=/);
    await expect(popup(page)).toContainText(upcoming.title);
  });

  test('a filter that removes the selected item closes the popup', async ({ page }) => {
    await visit(page, `${routes.traffic.map}?focus=${hazard.id}`);
    await expect(popup(page)).toBeVisible();
    await layerBox(page, copy.filters.layers.hazards).click();
    await expect(popup(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/focus=/);
  });

  test('an unknown focus id is ignored', async ({ page }) => {
    await visit(page, `${routes.traffic.map}?focus=nothing-here`);
    await expect(popup(page)).toHaveCount(0);
    await expect(listHeading(page)).toHaveText(copy.results.title(total));
  });
});

test.describe('map', () => {
  test('has named controls, a region name, the OpenStreetMap credit and the unavailable text', async ({
    page,
  }) => {
    await visit(page);
    const region = page.getByRole('region', { name: copy.layout.mapLabel });
    await expect(region).toBeVisible();
    await expect(page.getByRole('button', { name: uiCopy.map.zoomIn })).toBeEnabled();
    await expect(page.getByRole('button', { name: uiCopy.map.zoomOut })).toBeEnabled();
    await expect(page.getByRole('button', { name: copy.controls.resetView })).toBeVisible();
    const credit = page.getByRole('link', { name: new RegExp(uiCopy.map.attribution) });
    await expect(credit).toHaveAttribute('href', uiCopy.map.attributionHref);
    await expect(credit).toHaveAttribute('target', '_blank');
    await expect(page.getByText(copy.layout.unavailable)).toBeVisible({ timeout: 30_000 });
  });

  test('zooming changes the zoom buttons state at the limit', async ({ page }) => {
    await visit(page);
    const zoomOut = page.getByRole('button', { name: uiCopy.map.zoomOut });
    await expect(async () => {
      if (await zoomOut.isEnabled()) await zoomOut.click();
      await expect(zoomOut).toBeDisabled({ timeout: 500 });
    }).toPass({ timeout: 15_000 });
  });

  test('the skip link moves focus to the list of road changes', async ({ page }) => {
    await visit(page);
    const skip = page.getByRole('link', { name: copy.filters.skipToList });
    await skip.focus();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(listHeading(page)).toBeFocused();
  });
});

test.describe('breakpoints', () => {
  test('at 1440 the panel is 400 wide beside the map and the page does not scroll', async ({
    page,
  }) => {
    await visit(page, routes.traffic.map, DESKTOP);
    const panelBox = await panel(page).boundingBox();
    const mapBox = await page.getByRole('region', { name: copy.layout.mapLabel }).boundingBox();
    expect(panelBox?.width).toBeCloseTo(400, 0);
    expect(mapBox?.x).toBeGreaterThanOrEqual(399);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight),
    ).toBe(true);
  });

  test('at 1024 the panel keeps its width and the map fills the rest', async ({ page }) => {
    await visit(page, routes.traffic.map, TABLET);
    const mapBox = await page.getByRole('region', { name: copy.layout.mapLabel }).boundingBox();
    expect(mapBox?.width).toBeCloseTo(624, 0);
  });

  test('on a phone the map comes first, then the panel, and nothing scrolls sideways', async ({
    page,
  }) => {
    for (const width of [320, PHONE.width, 768]) {
      await visit(page, routes.traffic.map, { width, height: 844 });
      const mapBox = await page.getByRole('region', { name: copy.layout.mapLabel }).boundingBox();
      const panelBox = await panel(page).boundingBox();
      expect(mapBox && panelBox && mapBox.y < panelBox.y).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  });

  test('on a phone choosing a list item brings the map into view', async ({ page }) => {
    await visit(page, routes.traffic.map, PHONE);
    await item(page, closure.id).scrollIntoViewIfNeeded();
    await item(page, closure.id).click();
    await expect(popup(page)).toBeVisible();
    await expect
      .poll(() =>
        page.locator('#traffic-map').evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(120);
  });
});
