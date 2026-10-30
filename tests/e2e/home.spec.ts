import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import { getAnnouncements } from '@/data/api/announcements';
import { getAreas } from '@/data/api/areas';
import { getConstructionUpdates } from '@/data/api/construction';
import { getMostAskedFaq } from '@/data/api/faq';
import { getRoadWorks } from '@/data/api/road-works';
import { getSiteInfo } from '@/data/api/site-info';
import { getStations } from '@/data/api/stations';
import { getCurrentUser } from '@/data/api/user';
import { toWorksItems } from '@/features/home/works-items';
import { formatDate } from '@/lib/format/dates';
import { prepare, settle } from '../support/browser';

const [areas, announcements, roadWorks, stations, updates, faqItems, siteInfo, user] =
  await Promise.all([
    getAreas(),
    getAnnouncements(),
    getRoadWorks(),
    getStations(),
    getConstructionUpdates(),
    getMostAskedFaq(),
    getSiteInfo(),
    getCurrentUser(),
  ]);

const worksItems = toWorksItems(announcements, roadWorks);
const bukitJambul = areas.find((area) => area.id === 'bukit-jambul');
const butterworth = areas.find((area) => area.id === 'butterworth');
if (!bukitJambul || !butterworth) throw new Error('Mock areas changed: update home.spec.ts');
const firstThree = (areaId: string) =>
  worksItems.filter((item) => item.areaIds.some((id) => id === areaId)).slice(0, 3);

const DESKTOP = { width: 1440, height: 900 };
const TABLET = { width: 1024, height: 800 };
const PHONE = { width: 390, height: 844 };

/** A 1 × 1 transparent PNG, so the map's tiles "load" without touching OpenStreetMap. */
const TILE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

async function visit(page: Page, path: string = routes.home, signedIn = false) {
  await prepare(page, { signedIn });
  await page.goto(path);
  await settle(page);
}

const worksSection = (page: Page) => page.locator('section[aria-labelledby="works-heading"]');
const section = (page: Page, headingId: string) =>
  page.locator(`section[aria-labelledby="${headingId}"]`);
const searchBox = (page: Page) => page.getByRole('combobox', { name: homeCopy.search.hint });
const workTitles = (page: Page) => worksSection(page).getByRole('heading', { level: 3 });

/** Types into the search box, retrying until the page has hydrated and the panel reacts. */
async function typeQuery(page: Page, query: string) {
  const box = searchBox(page);
  await expect(async () => {
    await box.fill(query);
    await expect(box).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass();
}

test.describe('home: hero search', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  test('"buk" opens grouped suggestions: one station, one road, one area', async ({ page }) => {
    await typeQuery(page, 'buk');
    const panel = page.locator('#home-search-panel');
    const groups = panel.getByRole('group');
    for (const label of Object.values(homeCopy.search.groups)) {
      await expect(panel.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(panel.getByRole('option')).toHaveCount(3);
    await expect(groups.filter({ hasText: homeCopy.search.groups.station })).toHaveCount(1);
    await expect(page.getByText(homeCopy.search.resultCount(3))).toBeAttached();
  });

  test('one character does not open the panel', async ({ page }) => {
    await searchBox(page).fill('b');
    await expect(searchBox(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#home-search-panel')).toBeHidden();
  });

  test('arrow keys move the active option and Enter opens the station page', async ({ page }) => {
    await typeQuery(page, 'buk');
    const box = searchBox(page);
    const options = page.getByRole('option');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    const first = await box.getAttribute('aria-activedescendant');
    await box.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    expect(await box.getAttribute('aria-activedescendant')).not.toBe(first);
    await box.press('ArrowUp');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[aria-selected="true"]')).toHaveCount(1);
    await box.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S09')}$`));
  });

  test('Escape closes the panel first, then clears the box; Alt+ArrowUp also closes', async ({
    page,
  }) => {
    await typeQuery(page, 'buk');
    const box = searchBox(page);
    await box.press('Alt+ArrowUp');
    await expect(box).toHaveAttribute('aria-expanded', 'false');
    await box.press('ArrowDown');
    await expect(box).toHaveAttribute('aria-expanded', 'true');
    await box.press('Escape');
    await expect(box).toHaveAttribute('aria-expanded', 'false');
    await expect(box).toHaveValue('buk');
    await box.press('Escape');
    await expect(box).toHaveValue('');
  });

  test('a road option opens the traffic route for its station', async ({ page }) => {
    await typeQuery(page, 'buk');
    await page.getByRole('option', { name: /Jalan Bukit Jambul/ }).click();
    await expect(page).toHaveURL(new RegExp(routes.traffic.routeAt('S09').replace('?', '\\?')));
  });

  test('an area option filters Works in your area and moves focus to its heading', async ({
    page,
  }) => {
    await typeQuery(page, 'buk');
    await page.getByRole('option', { name: /Bukit Jambul, Bayan Lepas/ }).click();
    await expect(page).toHaveURL(/\?area=bukit-jambul/);
    await expect(page.getByRole('heading', { name: homeCopy.works.title })).toBeFocused();
    await expect(
      worksSection(page).getByRole('button', { name: bukitJambul.label }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('the Search button chooses the active option', async ({ page }) => {
    await typeQuery(page, 'komtar');
    await page.getByRole('button', { name: uiCopy.actions.search }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S20')}$`));
  });

  test('no matches shows the message and the two links', async ({ page }) => {
    await typeQuery(page, 'zzzz');
    await expect(page.getByText(uiCopy.empty.noResults('zzzz'))).toBeVisible();
    await expect(page.getByText(uiCopy.empty.noResultsHint)).toBeVisible();
    const links = homeCopy.search.noResultsLinks;
    await expect(
      page.getByRole('link', { name: links.stations.label(stations.length) }),
    ).toHaveAttribute('href', links.stations.href);
    await expect(page.getByRole('link', { name: links.trafficMap.label })).toHaveAttribute(
      'href',
      links.trafficMap.href,
    );
  });
});

test.describe('home: hero links', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  test('the four Try chips and the two hero actions go where they say', async ({ page }) => {
    for (const chip of homeCopy.hero.tryChips) {
      await expect(page.getByRole('link', { name: chip.label, exact: true })).toHaveAttribute(
        'href',
        chip.target,
      );
    }
    const { trafficMap, report } = homeCopy.hero.actions;
    await expect(page.getByRole('link', { name: trafficMap.label })).toHaveAttribute(
      'href',
      trafficMap.href,
    );
    await expect(
      page.getByRole('main').getByRole('link', { name: report.label }).first(),
    ).toHaveAttribute('href', report.href);
  });

  test('an area Try chip filters the Works list', async ({ page }) => {
    await page.getByRole('link', { name: 'Bukit Jambul', exact: true }).click();
    await expect(page).toHaveURL(/\?area=bukit-jambul#works/);
    await expect(workTitles(page).filter({ hasNotText: /Get updates/ })).toHaveCount(
      firstThree('bukit-jambul').length,
    );
  });
});

test.describe('home: works in your area', () => {
  test.use({ viewport: DESKTOP });

  test('all areas shows at most three items, earliest start first', async ({ page }) => {
    await visit(page);
    const expected = firstThree('').length;
    expect(expected).toBe(0);
    const all = worksItems.slice(0, 3);
    await expect(
      workTitles(page).filter({ hasNotText: homeCopy.works.subscribe.titleAllAreas }),
    ).toHaveCount(all.length);
    for (const [index, item] of all.entries()) {
      await expect(workTitles(page).nth(index)).toHaveText(item.title);
    }
  });

  test('an area chip filters the list, updates the URL and pressed state', async ({ page }) => {
    await visit(page);
    const chip = worksSection(page).getByRole('button', { name: bukitJambul.label });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(async () => {
      await chip.click();
      await expect(chip).toHaveAttribute('aria-pressed', 'true', { timeout: 1000 });
    }).toPass();
    await expect(page).toHaveURL(/\?area=bukit-jambul/);
    await expect(
      worksSection(page).getByRole('button', { name: uiCopy.filters.allAreas }),
    ).toHaveAttribute('aria-pressed', 'false');
    for (const [index, item] of firstThree('bukit-jambul').entries()) {
      await expect(workTitles(page).nth(index)).toHaveText(item.title);
    }
    await expect(
      page.getByText(
        homeCopy.works.resultCount(firstThree('bukit-jambul').length, bukitJambul.label),
      ),
    ).toBeAttached();
  });

  test('Bukit Jambul lists the 12 Oct, 26 Oct and 3 Nov changes first', async ({ page }) => {
    await visit(page, `${routes.home}?area=bukit-jambul`);
    const items = worksSection(page)
      .getByRole('listitem')
      .filter({ has: page.getByRole('heading', { level: 3 }) });
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('12 Oct');
    await expect(items.nth(1)).toContainText('26 Oct');
    await expect(items.nth(2)).toContainText('3 Nov');
  });

  test('each item has dates, hours and a View on map link named after it', async ({ page }) => {
    await visit(page, `${routes.home}?area=bukit-jambul`);
    const [item] = firstThree('bukit-jambul');
    const first = worksSection(page).getByRole('listitem').first();
    await expect(first).toContainText(homeCopy.works.item.datesLabel);
    await expect(first).toContainText(homeCopy.works.item.hoursLabel);
    const link = first.getByRole('link', { name: new RegExp(uiCopy.actions.viewOnMap) });
    await expect(link).toHaveAttribute('href', homeCopy.works.item.viewOnMapHref(item?.id ?? ''));
    await expect(link).toHaveAccessibleName(
      new RegExp(
        `^${uiCopy.actions.viewOnMap}\\s*${homeCopy.works.item.viewOnMapLabel(item?.title ?? '')}$`,
      ),
    );
  });

  test('an area with no works shows the empty state and still offers sign-up', async ({ page }) => {
    await visit(page, `${routes.home}?area=butterworth`);
    await expect(page.getByText(homeCopy.works.empty.title(butterworth.label))).toBeVisible();
    await expect(page.getByText(homeCopy.works.empty.textRight)).toBeVisible();
    await expect(
      worksSection(page).getByRole('button', { name: homeCopy.works.subscribe.submit }),
    ).toBeVisible();
  });

  test('"All announcements" goes to the announcements page', async ({ page }) => {
    await visit(page);
    await expect(
      worksSection(page).getByRole('link', { name: homeCopy.works.allAnnouncements.label }),
    ).toHaveAttribute('href', homeCopy.works.allAnnouncements.href);
  });
});

test.describe('home: works sign-up card', () => {
  test.use({ viewport: DESKTOP });
  const copy = homeCopy.works.subscribe;
  const card = (page: Page) => worksSection(page);
  const email = (page: Page) => card(page).getByLabel(copy.emailLabel);
  const submit = (page: Page) => card(page).getByRole('button', { name: copy.submit });

  test.beforeEach(async ({ page }) => visit(page, `${routes.home}?area=bukit-jambul`));

  test('the card names the chosen area', async ({ page }) => {
    await expect(card(page).getByRole('heading', { name: copy.title })).toBeVisible();
    await expect(card(page).getByText(copy.text(bukitJambul.label))).toBeVisible();
  });

  test('an empty address shows the required message and focuses the field', async ({ page }) => {
    await submit(page).click();
    await expect(card(page).getByText(uiCopyErrors.emailRequired)).toBeVisible();
    await expect(email(page)).toHaveAttribute('aria-invalid', 'true');
    await expect(email(page)).toBeFocused();
  });

  test('a bad format shows the format message, which clears once it is valid', async ({ page }) => {
    await email(page).fill('meiling');
    await email(page).press('Enter');
    await expect(card(page).getByText(uiCopyErrors.emailInvalid)).toBeVisible();
    await email(page).fill('meiling@example.com');
    await expect(card(page).getByText(uiCopyErrors.emailInvalid)).toBeHidden();
  });

  test('a valid address shows sending, then a success message that takes focus', async ({
    page,
  }) => {
    await email(page).fill('meiling@example.com');
    await submit(page).click();
    await expect(card(page).getByRole('button', { name: copy.submitting })).toBeVisible();
    await expect(email(page)).toBeDisabled();
    const status = card(page).getByRole('status');
    await expect(status).toHaveText(copy.success('meiling@example.com', bukitJambul.label));
    await expect(status).toBeFocused();
    await expect(email(page)).toHaveCount(0);
  });

  test('a failing address shows the error and returns focus to the button', async ({ page }) => {
    await email(page).fill('meiling@fail.test');
    await submit(page).click();
    await expect(card(page).getByText(copy.sendFailed)).toBeVisible();
    await expect(submit(page)).toBeFocused();
    await expect(email(page)).toBeEnabled();
  });

  test('a signed-in visitor sees their address already filled in', async ({ page }) => {
    await visit(page, `${routes.home}?area=bukit-jambul`, true);
    await expect(email(page)).toHaveValue(user?.email ?? '');
  });
});

/** The shared form error messages used by the sign-up card. */
const uiCopyErrors = uiCopy.form.errors;

test.describe('home: line preview', () => {
  const stationLinks = (page: Page) =>
    section(page, 'line-heading').getByRole('link', { name: /^(S|A)\d\d/ });

  test('on a phone: the rail lists all stations in line order, with no toggle', async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await visit(page);
    const line = section(page, 'line-heading');
    await expect(stationLinks(page)).toHaveCount(stations.length);
    await expect(stationLinks(page).first()).toContainText(stations[0]?.name ?? '');
    await expect(stationLinks(page).last()).toContainText(stations.at(-1)?.name ?? '');
    await expect(line.getByRole('radio')).toHaveCount(0);
    await stationLinks(page).nth(2).click();
    await expect(page).toHaveURL(new RegExp(routes.project.station(stations[2]?.code ?? '')));
  });

  test('at 1024: the toggle shows the rail in a card; Route view is the default', async ({
    page,
  }) => {
    await page.setViewportSize(TABLET);
    await visit(page);
    const line = section(page, 'line-heading');
    await expect(line.getByRole('radio', { name: homeCopy.line.viewToggle.route })).toBeChecked();
    await expect(line.getByText(homeCopy.line.captions.route)).toBeVisible();
    await expect(stationLinks(page)).toHaveCount(stations.length);
    await expect(line.getByText(homeCopy.line.legend.line, { exact: true })).toBeHidden();
  });

  test('at 1440: the diagram has one link per station, in line order, with full names', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await visit(page);
    const diagram = section(page, 'line-heading')
      .locator('ol')
      .filter({ has: page.locator('a[href$="/s31"]') });
    const links = diagram.getByRole('link');
    await expect(links).toHaveCount(stations.length);
    for (const [index, station] of stations.entries()) {
      await expect(links.nth(index)).toHaveAttribute('href', routes.project.station(station.code));
    }
    await expect(
      diagram.getByRole('link', { name: /^S19 Macallum.*two routes meet/ }),
    ).toBeVisible();
    await expect(diagram.getByRole('link', { name: /^S30 .*provisional name/ })).toBeVisible();
    await expect(
      section(page, 'line-heading').getByText(homeCopy.line.legend.nearby),
    ).toBeVisible();
    await diagram.getByRole('link', { name: /^S13 / }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S13')}$`));
  });

  test('arrow keys move between Route view and Map view, and the caption follows', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await visit(page);
    const line = section(page, 'line-heading');
    const route = line.getByRole('radio', { name: homeCopy.line.viewToggle.route });
    const map = line.getByRole('radio', { name: homeCopy.line.viewToggle.map });
    await expect(async () => {
      await route.focus();
      await route.press('ArrowRight');
      await expect(map).toBeChecked({ timeout: 1000 });
    }).toPass();
    await expect(map).toBeFocused();
    await expect(line.getByText(homeCopy.line.captions.map)).toBeVisible();
    await expect(line.getByRole('region', { name: homeCopy.line.map.label })).toBeVisible();
    await map.press('ArrowLeft');
    await expect(route).toBeChecked();
    await expect(line.getByText(homeCopy.line.captions.route)).toBeVisible();
    await expect(line.getByRole('region', { name: homeCopy.line.map.label })).toBeHidden();
  });

  test.describe('map view', () => {
    test.use({ viewport: DESKTOP });
    const openMap = async (page: Page) => {
      const line = section(page, 'line-heading');
      const map = line.getByRole('radio', { name: homeCopy.line.viewToggle.map });
      await expect(async () => {
        await map.check({ force: true });
        await expect(map).toBeChecked({ timeout: 1000 });
      }).toPass();
      return line.getByRole('region', { name: homeCopy.line.map.label });
    };

    test('shows loading, then markers, zoom buttons and the attribution', async ({ page }) => {
      await prepare(page);
      await page.route(/tile\.openstreetmap\.org/, (route) =>
        route.fulfill({ contentType: 'image/png', body: TILE_PNG }),
      );
      await page.goto(routes.home);
      await settle(page);
      const region = await openMap(page);
      await expect(region.locator('.leaflet-marker-icon')).toHaveCount(stations.length);
      await expect(region.getByRole('status')).toBeHidden();
      await expect(
        region.getByRole('link', { name: new RegExp(homeCopy.line.map.attribution.label) }),
      ).toHaveAttribute('href', homeCopy.line.map.attribution.href);
      await expect(region.getByText(homeCopy.line.map.caption)).toBeVisible();
      const zoomOut = region.getByRole('button', { name: homeCopy.line.map.zoomOut });
      const zoomIn = region.getByRole('button', { name: homeCopy.line.map.zoomIn });
      await expect(zoomIn).toBeEnabled();
      if (await zoomOut.isEnabled()) {
        await zoomOut.click();
      }
      await expect(zoomIn).toBeEnabled();
    });

    test('a marker opens a popup with a link to its station page', async ({ page }) => {
      await prepare(page);
      await page.route(/tile\.openstreetmap\.org/, (route) =>
        route.fulfill({ contentType: 'image/png', body: TILE_PNG }),
      );
      await page.goto(routes.home);
      await settle(page);
      const region = await openMap(page);
      const marker = region.getByRole('button', { name: /^S20 KOMTAR/ });
      await marker.focus();
      await marker.press('Enter');
      const link = region.getByRole('link', {
        name: homeCopy.line.map.openStationPage('KOMTAR'),
      });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${routes.project.station('S20')}$`));
    });

    test('Escape closes a marker popup', async ({ page }) => {
      await prepare(page);
      await page.route(/tile\.openstreetmap\.org/, (route) =>
        route.fulfill({ contentType: 'image/png', body: TILE_PNG }),
      );
      await page.goto(routes.home);
      await settle(page);
      const region = await openMap(page);
      const marker = region.getByRole('button', { name: /^S20 KOMTAR/ });
      await marker.focus();
      await marker.press('Enter');
      const link = region.getByRole('link', {
        name: homeCopy.line.map.openStationPage('KOMTAR'),
      });
      await expect(link).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(link).toBeHidden();
    });

    test('the zoom buttons disable at the limits', async ({ page }) => {
      await prepare(page);
      await page.route(/tile\.openstreetmap\.org/, (route) =>
        route.fulfill({ contentType: 'image/png', body: TILE_PNG }),
      );
      await page.goto(routes.home);
      await settle(page);
      const region = await openMap(page);
      const zoomIn = region.getByRole('button', { name: homeCopy.line.map.zoomIn });
      const zoomOut = region.getByRole('button', { name: homeCopy.line.map.zoomOut });
      await expect(zoomIn).toBeEnabled();
      await expect(async () => {
        if (await zoomIn.isEnabled()) await zoomIn.click();
        await expect(zoomIn).toBeDisabled({ timeout: 500 });
      }).toPass({ timeout: 20_000 });
      await expect(zoomOut).toBeEnabled();
      await expect(async () => {
        if (await zoomOut.isEnabled()) await zoomOut.click();
        await expect(zoomOut).toBeDisabled({ timeout: 500 });
      }).toPass({ timeout: 20_000 });
      await expect(zoomIn).toBeEnabled();
    });

    test('with no tiles the map shows the error, and Try again retries', async ({ page }) => {
      await visit(page);
      const region = await openMap(page);
      await expect(region.getByText(homeCopy.line.map.errorTitle)).toBeVisible();
      await expect(region.getByText(homeCopy.line.map.errorText)).toBeVisible();
      const retryButton = region.getByRole('button', { name: uiCopy.actions.tryAgain });
      await expect(retryButton).toBeVisible();
      await retryButton.click();
      await expect(region.getByText(homeCopy.line.map.errorTitle)).toBeVisible();
    });
  });
});

test.describe('home: about, guide and safety', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  test('About shows its heading, the photo with its alt text and the link', async ({ page }) => {
    const about = section(page, 'about-heading');
    await expect(
      about.getByRole('heading', { level: 2, name: homeCopy.about.title }),
    ).toBeVisible();
    await expect(about.getByRole('img', { name: homeCopy.about.imageAlt })).toBeVisible();
    await expect(about.getByRole('link', { name: homeCopy.about.link.label })).toHaveAttribute(
      'href',
      homeCopy.about.link.href,
    );
  });

  test('every guide card is a link to its destination', async ({ page }) => {
    const guide = section(page, 'guide-heading');
    await expect(guide.getByRole('heading', { level: 3 })).toHaveCount(homeCopy.guide.cards.length);
    for (const card of homeCopy.guide.cards) {
      await expect(guide.getByRole('link', { name: card.title })).toHaveAttribute(
        'href',
        card.href,
      );
    }
  });

  test('a guide card opens its page when clicked anywhere on the card', async ({ page }) => {
    const card = homeCopy.guide.cards[0];
    await section(page, 'guide-heading')
      .getByText(card?.text ?? '')
      .click({ force: true });
    await expect(page).toHaveURL(new RegExp(`${card?.href}$`));
  });

  test('a guide card link shows a focus ring from the keyboard', async ({ page }) => {
    const link = section(page, 'guide-heading').getByRole('link').first();
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link.locator('xpath=ancestor::article')).toHaveCSS('outline-style', 'solid');
  });

  test('safety tips are plain text: six tips and no links', async ({ page }) => {
    const safety = section(page, 'safety-heading');
    await expect(safety.getByRole('heading', { level: 3 })).toHaveCount(
      homeCopy.safety.tips.length,
    );
    await expect(safety.getByRole('link')).toHaveCount(0);
    await expect(safety.getByRole('button')).toHaveCount(0);
  });
});

test.describe('home: construction progress', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  test('shows the three newest updates, each linking to its update', async ({ page }) => {
    const progress = section(page, 'progress-heading');
    const newest = updates.slice(0, 3);
    await expect(progress.getByRole('heading', { level: 3 })).toHaveCount(3);
    for (const update of newest) {
      await expect(progress.getByRole('link', { name: update.title })).toHaveAttribute(
        'href',
        homeCopy.progress.cardHref(update.id),
      );
      await expect(progress.getByText(formatDate(update.date), { exact: true })).toBeVisible();
    }
    await expect(progress.locator('time')).toHaveCount(3);
  });

  test('See all updates goes to Construction progress', async ({ page }) => {
    await expect(
      section(page, 'progress-heading').getByRole('link', { name: homeCopy.progress.seeAll.label }),
    ).toHaveAttribute('href', homeCopy.progress.seeAll.href);
  });
});

test.describe('home: help strip', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  test('has a hidden heading, three columns and the right destinations', async ({ page }) => {
    const help = section(page, 'help-heading');
    await expect(help.getByRole('heading', { level: 2, name: homeCopy.help.title })).toBeAttached();
    await expect(help.getByRole('heading', { level: 3 })).toHaveCount(3);
    const { report, property } = homeCopy.help;
    await expect(help.getByRole('link', { name: report.primary.label })).toHaveAttribute(
      'href',
      report.primary.href,
    );
    await expect(help.getByRole('link', { name: report.secondary.label })).toHaveAttribute(
      'href',
      report.secondary.href,
    );
    await expect(help.getByRole('link', { name: property.link.label })).toHaveAttribute(
      'href',
      property.link.href,
    );
  });

  test('the careline title is a phone link with a descriptive name', async ({ page }) => {
    const { label, number, tel } = siteInfo.careline;
    const link = section(page, 'help-heading').getByRole('link', {
      name: homeCopy.help.careline.callLabel(label, number),
    });
    await expect(link).toHaveAttribute('href', tel);
    await expect(link).toHaveText(homeCopy.help.careline.title(label, number));
    await expect(link).not.toHaveAttribute('target', '_blank');
  });

  test('on a phone the columns stack and nothing overflows sideways', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const help = section(page, 'help-heading');
    const boxes = await help
      .getByRole('heading', { level: 3 })
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
    expect(boxes[1]).toBeGreaterThan(boxes[0] ?? 0);
    expect(boxes[2]).toBeGreaterThan(boxes[1] ?? 0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test.describe('home: common questions', () => {
  test.use({ viewport: DESKTOP });
  test.beforeEach(async ({ page }) => visit(page));

  const questions = (page: Page) =>
    section(page, 'faq-heading').getByRole('button', { expanded: undefined });

  test('lists the five most asked questions with only the first open', async ({ page }) => {
    const buttons = questions(page);
    await expect(buttons).toHaveCount(faqItems.length);
    for (const [index, item] of faqItems.entries()) {
      await expect(buttons.nth(index)).toHaveText(item.question);
      await expect(buttons.nth(index)).toHaveAttribute(
        'aria-expanded',
        index === 0 ? 'true' : 'false',
      );
    }
    await expect(section(page, 'faq-heading').getByText(faqItems[0]?.summary ?? '')).toBeVisible();
  });

  test('clicking a question opens it and several can be open at once', async ({ page }) => {
    const buttons = questions(page);
    await expect(async () => {
      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass();
    await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(section(page, 'faq-heading').getByText(faqItems[1]?.summary ?? '')).toBeVisible();
    await buttons.nth(0).click();
    await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(section(page, 'faq-heading').getByText(faqItems[0]?.summary ?? '')).toBeHidden();
  });

  test('Enter and Space toggle a focused question', async ({ page }) => {
    const button = questions(page).nth(2);
    await expect(async () => {
      await button.focus();
      await button.press('Enter');
      await expect(button).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass();
    await button.press('Space');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('items use home-prefixed ids and See all goes to the FAQ page', async ({ page }) => {
    const faq = section(page, 'faq-heading');
    await expect(faq.locator('[id^="home-faq-"]')).toHaveCount(faqItems.length);
    await expect(faq.getByRole('link', { name: homeCopy.faq.seeAll.label })).toHaveAttribute(
      'href',
      homeCopy.faq.seeAll.href,
    );
  });
});

test.describe('home: structure', () => {
  test.use({ viewport: DESKTOP });

  test('one h1, then the section headings in reading order', async ({ page }) => {
    await visit(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(homeCopy.hero.title);
    const h2 = await page.getByRole('main').getByRole('heading', { level: 2 }).allTextContents();
    expect(h2).toEqual([
      homeCopy.works.title,
      homeCopy.line.title,
      homeCopy.about.title,
      homeCopy.guide.title,
      homeCopy.safety.title,
      homeCopy.progress.title,
      homeCopy.help.title,
      homeCopy.faq.title,
    ]);
  });
});
