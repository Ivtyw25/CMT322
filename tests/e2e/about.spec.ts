import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getStations } from '@/data/api/stations';
import { prepare, settle, whenHydrated } from '../support/browser';

const { about } = projectCopy;
const stations = await getStations();
const stationAt = (index: number) => stations[index];
const liveCard = (page: Page) =>
  page.locator('div[aria-live="polite"][aria-atomic="true"]:not(.sr-only)');

async function open(page: Page, width = 1440) {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(routes.project.about);
  await settle(page);
}

test.describe('about the line', () => {
  test('has one h1 and seven sections with the documented ids', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(about.header.title);
    const ids = await page
      .locator('article h2[tabindex="-1"]')
      .evaluateAll((list) => list.map((h) => h.id));
    expect(ids).toEqual([
      'overview',
      'key-figures',
      'routes',
      'stations',
      'travelling',
      'benefits',
      'timeline',
    ]);
  });

  test('key figures read label then value', async ({ page }) => {
    await open(page);
    for (const item of about.figures.items) {
      await expect(page.locator('dl dt', { hasText: item.label }).first()).toBeVisible();
      await expect(page.locator('dl dd', { hasText: item.value }).first()).toBeVisible();
    }
  });

  test('route tabs switch the panel and keep the shared note', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="tablist"]');
    const [first, second] = about.routes.tabs;
    const tabs = page.getByRole('tablist', { name: about.routes.tabsLabel });
    await expect(tabs.getByRole('tab', { name: first?.label })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByText(first?.intro ?? '')).toBeVisible();
    await tabs.getByRole('tab', { name: second?.label }).click();
    await expect(page.getByText(second?.intro ?? '')).toBeVisible();
    await expect(page.getByText(first?.intro ?? '')).toBeHidden();
    await expect(page.getByText(about.routes.note)).toBeVisible();
  });

  test('route tabs move with the arrow keys, Home and End', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="tablist"]');
    const tabs = page.getByRole('tablist', { name: about.routes.tabsLabel }).getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('benefit tabs show one paragraph at a time', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="tablist"]');
    const list = page.getByRole('tablist', { name: about.benefits.tabsLabel });
    await expect(list.getByRole('tab')).toHaveCount(4);
    for (const tab of about.benefits.tabs) {
      await list.getByRole('tab', { name: tab.label }).click();
      await expect(page.getByText(tab.body)).toBeVisible();
    }
  });

  test('travelling table lists the six rows', async ({ page }) => {
    await open(page);
    for (const row of about.travelling.rows) {
      await expect(page.locator('dt', { hasText: row.label }).first()).toBeVisible();
    }
  });

  test('timeline lists the milestones and the source note', async ({ page }) => {
    await open(page);
    await expect(
      page.locator('#timeline').locator('xpath=ancestor::section').locator('ol > li'),
    ).not.toHaveCount(0);
    await expect(page.getByText(about.timeline.note)).toBeVisible();
  });
});

test.describe('route diagram (1440 px)', () => {
  const group = (page: Page) => page.getByRole('radiogroup', { name: about.stations.groupLabel });

  test('shows 22 stops and starts on S13', async ({ page }) => {
    await open(page);
    await expect(group(page).getByRole('radio')).toHaveCount(22);
    await expect(group(page).getByRole('radio', { name: /^S13 / })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(page.getByRole('link', { name: 'Jalan Universiti' }).last()).toBeVisible();
  });

  test('clicking a stop selects it and updates the live card', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="radiogroup"] button');
    const target = stations.find((station) => station.code === 'S20');
    await group(page)
      .getByRole('radio', { name: new RegExp(`^S20 `) })
      .click();
    const card = liveCard(page);
    await expect(card.getByRole('link', { name: target?.name })).toHaveAttribute(
      'href',
      routes.project.station('S20'),
    );
    await expect(card).toContainText(target?.serves ?? '');
    await expect(group(page).getByRole('radio', { name: /^S20 / })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('only the selected stop is in the tab order', async ({ page }) => {
    await open(page);
    const tabbable = group(page).locator('[role="radio"][tabindex="0"]');
    await expect(tabbable).toHaveCount(1);
    await expect(tabbable).toHaveAccessibleName(/^S13 /);
  });

  test('arrow keys move along the line, Home and End jump to the ends', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="radiogroup"] button');
    const radios = group(page).getByRole('radio');
    await group(page).locator('[tabindex="0"]').focus();
    await page.keyboard.press('ArrowRight');
    const next = stationAt(10);
    await expect(radios.nth(10)).toBeFocused();
    await expect(radios.nth(10)).toHaveAttribute('aria-checked', 'true');
    await expect(radios.nth(10)).toHaveAccessibleName(new RegExp(`^${next?.code} `));
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(8)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(radios.first()).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('End');
    await expect(radios.last()).toHaveAttribute('aria-checked', 'true');
    await expect(radios.last()).toBeFocused();
  });

  test('Space selects a focused stop', async ({ page }) => {
    await open(page);
    await whenHydrated(page, '[role="radiogroup"] button');
    const radio = group(page).getByRole('radio', { name: /^S18 / });
    await radio.focus();
    await page.keyboard.press('Space');
    await expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  test('hovering a stop fills it', async ({ page }) => {
    await open(page);
    const stop = group(page).getByRole('radio', { name: /^S16 / });
    await stop.hover();
    await expect(stop.locator('span')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  test('the station rail is hidden at this width', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('list', { name: about.stations.title })).toBeHidden();
  });
});

test.describe('station rail (below 1280 px)', () => {
  test('lists 22 links to station pages and hides the diagram', async ({ page }) => {
    await open(page, 1024);
    const rail = page.getByRole('list', { name: about.stations.title });
    await expect(rail.getByRole('link')).toHaveCount(22);
    await expect(rail.getByRole('link').first()).toHaveAttribute(
      'href',
      routes.project.station(stations[0]?.code ?? ''),
    );
    await expect(page.getByRole('radiogroup')).toBeHidden();
  });

  test('a rail row opens the station page', async ({ page }) => {
    await open(page, 390);
    await page.getByRole('link', { name: /S20/ }).first().click();
    await expect(page).toHaveURL(new RegExp(`${routes.project.station('S20')}$`));
  });

  test('has no horizontal scroll at 320 px', async ({ page }) => {
    await open(page, 320);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
});

test.describe('page feedback and related pages', () => {
  const feedback = uiCopy.docsPage.feedback;

  test('Yes replaces the row with a thanks message and takes focus', async ({ page }) => {
    await open(page);
    await whenHydrated(page, 'button[aria-pressed]');
    await page.getByRole('button', { name: feedback.yes, exact: true }).click();
    const thanks = page.getByRole('status').filter({ hasText: feedback.thanks });
    await expect(thanks).toBeFocused();
    await expect(page.getByRole('button', { name: feedback.yes, exact: true })).toHaveCount(0);
  });

  test('No shows three reasons, focuses the first, and a reason thanks the visitor', async ({
    page,
  }) => {
    await open(page);
    await whenHydrated(page, 'button[aria-pressed]');
    const no = page.getByRole('button', { name: feedback.no, exact: true });
    await no.click();
    await expect(no).toHaveAttribute('aria-pressed', 'true');
    const reasons = page.getByRole('group', { name: feedback.reasonsLabel }).getByRole('button');
    await expect(reasons).toHaveCount(3);
    await expect(reasons.first()).toBeFocused();
    await reasons.nth(1).click();
    await expect(page.getByRole('status').filter({ hasText: feedback.thanksReason })).toBeFocused();
    await expect(page.getByRole('group', { name: feedback.reasonsLabel })).toHaveCount(0);
  });

  test('related pages link to construction, the traffic map and the FAQ', async ({ page }) => {
    await open(page);
    const related = page.getByRole('region', { name: uiCopy.docsPage.relatedPages });
    await expect(related.getByRole('link')).toHaveCount(3);
    for (const entry of about.related) {
      await expect(related.getByRole('link', { name: new RegExp(entry.label) })).toHaveAttribute(
        'href',
        entry.href,
      );
    }
  });

  test('On this page jumps to a section and focuses its heading', async ({ page }) => {
    await open(page);
    await whenHydrated(page, 'a[href="#timeline"]');
    await page
      .getByRole('navigation', { name: /on this page/i })
      .getByRole('link', { name: about.toc.timeline })
      .click();
    await expect(page.locator('#timeline')).toBeFocused();
  });
});
