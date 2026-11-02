import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getAnnouncements } from '@/data/api/announcements';
import { getStation, getStations } from '@/data/api/stations';
import { getTicketsNearStation } from '@/data/api/tickets';
import {
  MOCK_SESSION,
  SESSION_STORAGE_KEY,
  prepare,
  settle,
  whenHydrated,
  type VisitOptions,
} from '../support/browser';

const { station: copy } = projectCopy;
const stations = await getStations();
const komtar = await getStation('S20');
const notStarted = stations.find((station) => station.progress === null);
const noNotices: string[] = [];
const noReports: string[] = [];
for (const station of stations) {
  const notices = (await getAnnouncements({ stationCode: station.code })).filter(
    (item) => item.status !== 'ended',
  );
  if (notices.length === 0) noNotices.push(station.code);
  if ((await getTicketsNearStation(station.code)).length === 0) noReports.push(station.code);
}

async function open(page: Page, code = 'S20', options: VisitOptions = {}, width = 1440) {
  await prepare(page, options);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(routes.project.station(code));
  await settle(page);
  await whenHydrated(page, 'main button');
}

const heading = (page: Page, name: string) => page.getByRole('heading', { name, exact: true });
const followName = (name: string) => new RegExp(`^Follow(ing| station)? ${name}$`);
const followButton = (page: Page, name: string) =>
  page.getByRole('button', { name: followName(name) }).first();
const live = (page: Page) => page.locator('div[aria-live="polite"].sr-only');

test.describe('station: template for all 22', () => {
  test('every station renders its own page with the code in the heading', async ({ request }) => {
    for (const station of stations) {
      const response = await request.get(routes.project.station(station.code));
      expect(response.status(), station.code).toBe(200);
      expect(await response.text()).toContain(station.name);
    }
  });

  test('an upper-case code shows the same page and names the lower-case address as canonical', async ({
    page,
  }) => {
    await prepare(page);
    await page.goto('/project/stations/S20');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('S20 KOMTAR');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`${routes.project.station('S20')}$`),
    );
  });

  test('an unknown code shows the 404 page', async ({ page }) => {
    await prepare(page);
    const response = await page.goto('/project/stations/zz99');
    expect(response?.status()).toBe(404);
  });

  test('the page title names the station and its code', async ({ page }) => {
    await open(page);
    await expect(page).toHaveTitle(new RegExp(`KOMTAR station \\(S20\\)`));
  });
});

test.describe('station: header', () => {
  test('reads the code then the name, with the lede, tag and breadcrumb', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('S20 KOMTAR');
    await expect(page.getByText(komtar?.lede ?? '')).toBeVisible();
    await expect(page.getByText(uiCopy.tags.construction, { exact: true }).first()).toBeVisible();
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Stations' })).toHaveAttribute(
      'href',
      routes.project.stations,
    );
  });

  test('four figures read label then value', async ({ page }) => {
    await open(page);
    const stats = page
      .getByRole('list', { name: copy.stats.label })
      .or(page.locator('dl[aria-label]'));
    await expect(stats.first()).toContainText(
      copy.stats.progressValue(komtar?.progress?.percent ?? 0),
    );
    await expect(stats.first()).toContainText(copy.stats.traffic);
    await expect(stats.first()).toContainText(copy.stats.reports);
    await expect(stats.first()).toContainText('0.79 km');
  });

  test('Report an issue here goes to the report form for this station', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('link', { name: copy.actions.report })).toHaveAttribute(
      'href',
      routes.reportTrack.reportAt('S20'),
    );
  });

  test('a station whose works have not started has no tag and says so', async ({ page }) => {
    test.skip(!notStarted, 'no station without progress');
    await open(page, notStarted?.code);
    await expect(page.locator('dl[aria-label]').first()).toContainText(
      copy.stats.progressNotStarted,
    );
    await expect(heading(page, copy.construction.notStarted.title)).toBeVisible();
    if (notStarted?.siteUpdates.length === 0) {
      await expect(page.getByText(copy.construction.siteUpdates.empty)).toBeVisible();
    }
    await expect(page.getByText(uiCopy.tags.construction, { exact: true })).toHaveCount(0);
  });
});

test.describe('station: sections', () => {
  test('has the four section headings with their ids and one h1', async ({ page }) => {
    await open(page);
    const ids = await page
      .locator('main h2[tabindex="-1"]')
      .evaluateAll((list) => list.map((h) => h.id));
    expect(ids).toEqual(['traffic', 'progress', 'worksites', 'reports']);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('traffic cards list notices with two actions that name the notice', async ({ page }) => {
    await open(page);
    const notices = (await getAnnouncements({ stationCode: 'S20' })).filter(
      (item) => item.status !== 'ended',
    );
    const first = notices[0];
    const articles = page.locator('#traffic').locator('xpath=..').locator('article');
    await expect(articles).toHaveCount(Math.min(5, notices.length));
    await expect(
      page.getByRole('link', {
        name: `${uiCopy.actions.viewNotice}${copy.traffic.actionSuffix(first?.title ?? '')}`,
      }),
    ).toHaveAttribute('href', routes.traffic.announcement(first?.id ?? ''));
    await expect(
      page.getByRole('link', {
        name: `${uiCopy.actions.viewOnMap}${copy.traffic.actionSuffix(first?.title ?? '')}`,
      }),
    ).toHaveAttribute('href', routes.traffic.mapFocus(first?.id ?? ''));
    await expect(
      page.getByRole('link', { name: copy.traffic.links.announcements }),
    ).toHaveAttribute('href', routes.traffic.announcements);
    await expect(page.getByRole('link', { name: copy.traffic.links.map }).first()).toHaveAttribute(
      'href',
      routes.traffic.map,
    );
  });

  test('a station with no road changes shows the empty text and keeps the links', async ({
    page,
  }) => {
    const code = noNotices[0];
    test.skip(!code, 'every station has notices');
    const station = await getStation(code ?? '');
    await open(page, code);
    await expect(page.getByText(copy.traffic.empty.title(station?.name ?? ''))).toBeVisible();
    await expect(page.getByRole('link', { name: copy.traffic.links.announcements })).toBeVisible();
  });

  test('progress shows the percentage, six stages with their state and the site updates', async ({
    page,
  }) => {
    await open(page);
    const percent = komtar?.progress?.percent ?? 0;
    await expect(
      page.getByText(copy.stats.progressValue(percent), { exact: true }).first(),
    ).toBeVisible();
    const stages = page
      .getByRole('list', { name: copy.construction.stagesLabel })
      .getByRole('listitem');
    await expect(stages).toHaveCount(6);
    await expect(stages.nth(0)).toContainText(uiCopy.stationStages.completedIn('Mar 2025'));
    await expect(stages.nth(2)).toContainText(uiCopy.tags.inProgress);
    await expect(stages.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(stages.nth(5)).toContainText(uiCopy.stationStages.target('Dec 2031'));
    await expect(heading(page, copy.construction.siteUpdates.title)).toBeVisible();
    await expect(page.getByRole('link', { name: copy.construction.link })).toHaveAttribute(
      'href',
      routes.project.construction,
    );
  });

  test('the worksite map is a labelled region with the OpenStreetMap credit and a centre button', async ({
    page,
  }) => {
    await open(page);
    await expect(page.getByLabel(copy.worksites.mapLabel('KOMTAR'))).toBeVisible();
    await expect(page.getByText('OpenStreetMap contributors').first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: copy.worksites.centreLabel('KOMTAR') }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: copy.worksites.link })).toHaveAttribute(
      'href',
      routes.traffic.map,
    );
  });

  test('reports are plain rows with a status tag; the prompt links to the report form', async ({
    page,
  }) => {
    await open(page);
    const tickets = await getTicketsNearStation('S20');
    const reports = page.locator('#reports').locator('xpath=..');
    await expect(reports.locator('ul > li')).toHaveCount(Math.min(5, tickets.length));
    await expect(reports.locator('ul a')).toHaveCount(0);
    await expect(heading(page, copy.reports.cta.title('KOMTAR'))).toBeVisible();
    await expect(
      page.locator('#main').getByRole('link', { name: copy.reports.cta.action, exact: true }),
    ).toHaveAttribute('href', routes.reportTrack.reportAt('S20'));
  });

  test('a station with no reports shows the empty text and keeps the prompt', async ({ page }) => {
    const code = noReports[0];
    test.skip(!code, 'every station has reports');
    const station = await getStation(code ?? '');
    await open(page, code);
    await expect(page.getByText(copy.reports.empty.title(station?.name ?? ''))).toBeVisible();
    await expect(
      page.locator('#main').getByRole('link', { name: copy.reports.cta.action, exact: true }),
    ).toBeVisible();
  });
});

test.describe('station: rail', () => {
  test('glance lists the facts and links the neighbour station', async ({ page }) => {
    await open(page);
    const rail = page.getByRole('complementary', { name: copy.railLabel });
    for (const label of Object.values(copy.glance.labels).filter(
      (value) => value !== copy.glance.labels.interchange,
    )) {
      await expect(rail.locator('dt', { hasText: label }).first()).toBeVisible();
    }
    await expect(rail.getByRole('link', { name: /S19 Macallum/ })).toHaveAttribute(
      'href',
      routes.project.station('S19'),
    );
    await expect(rail).toContainText('0.79 km');
  });

  test('the urgent help card calls the careline and mentions 999', async ({ page }) => {
    await open(page);
    const link = page.getByRole('link', { name: /MRTCareline/ }).last();
    await expect(link).toHaveAttribute('href', /^tel:/);
    await expect(page.getByText(copy.help.body)).toBeVisible();
  });
});

test.describe('station: following', () => {
  test('a guest gets a log in link that returns here, and the log in card', async ({ page }) => {
    await open(page);
    const login = routes.account.loginReturningTo(routes.project.station('S20'));
    await expect(page.getByRole('link', { name: copy.actions.follow })).toHaveAttribute(
      'href',
      login,
    );
    await expect(heading(page, copy.alerts.signedOut.title('KOMTAR'))).toBeVisible();
    await expect(page.getByRole('link', { name: copy.alerts.signedOut.action })).toHaveAttribute(
      'href',
      login,
    );
  });

  test('a signed-in visitor who follows sees the pressed button and the following card', async ({
    page,
  }) => {
    await open(page, 'S20', { signedIn: true });
    await expect(followButton(page, 'KOMTAR')).toHaveAttribute('aria-pressed', 'true');
    await expect(followButton(page, 'KOMTAR')).toContainText(uiCopy.station.following);
    await expect(heading(page, copy.alerts.following.title('KOMTAR'))).toBeVisible();
    await expect(page.getByRole('link', { name: copy.alerts.following.link })).toHaveAttribute(
      'href',
      routes.account.profileSection('notifications'),
    );
  });

  test('toggling follow updates the button, the card and the live message, and survives a reload', async ({
    page,
  }) => {
    await open(page, 'S20', { signedIn: true });
    const button = followButton(page, 'KOMTAR');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(button).toContainText(copy.actions.follow);
    await expect(live(page)).toHaveText(copy.actions.unfollowed('KOMTAR'));
    await expect(heading(page, copy.alerts.notFollowing.title('KOMTAR'))).toBeVisible();
    await expect(button).toBeFocused();
    await page.reload();
    await settle(page);
    await whenHydrated(page, 'main button');
    await expect(followButton(page, 'KOMTAR')).toHaveAttribute('aria-pressed', 'false');
    await followButton(page, 'KOMTAR').click();
    await expect(followButton(page, 'KOMTAR')).toHaveAttribute('aria-pressed', 'true');
    await expect(live(page)).toHaveText(copy.actions.followed('KOMTAR'));
  });

  test('the card button and the header button are the same follow state', async ({ page }) => {
    await open(page, 'S20', { signedIn: true });
    await followButton(page, 'KOMTAR').click();
    const buttons = page.getByRole('button', { name: followName('KOMTAR') });
    await expect(buttons).toHaveCount(2);
    await buttons.last().click();
    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');
    await expect(buttons.last()).toHaveAttribute('aria-pressed', 'true');
  });

  test('signing in or out in another tab changes the page', async ({ page }) => {
    await open(page, 'S20', { signedIn: true });
    await page.evaluate((key) => {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    }, SESSION_STORAGE_KEY);
    await expect(page.getByRole('link', { name: copy.actions.follow })).toBeVisible();
    await page.evaluate(
      ([key, value]) => {
        window.localStorage.setItem(key as string, value as string);
        window.dispatchEvent(new StorageEvent('storage', { key: key as string }));
      },
      [SESSION_STORAGE_KEY, MOCK_SESSION],
    );
    await expect(followButton(page, 'KOMTAR')).toBeVisible();
  });
});

test.describe('station: small screens', () => {
  test('has no sideways scroll from 320 px and the rail follows the sections', async ({ page }) => {
    for (const width of [320, 390, 768, 1024]) {
      await open(page, 'S20', {}, width);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
    }
    await open(page, 'S20', {}, 390);
    const reportsBottom = await page
      .locator('#reports')
      .evaluate((el) => el.getBoundingClientRect().bottom);
    const glanceTop = await page
      .getByRole('heading', { name: copy.glance.title })
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(glanceTop).toBeGreaterThan(reportsBottom);
  });

  test('a long station name wraps in the heading at 320 px', async ({ page }) => {
    await open(page, 'S03', {}, 320);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Penang International Airport',
    );
  });
});
