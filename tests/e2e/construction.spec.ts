import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getAreas } from '@/data/api/areas';
import { getConstructionUpdates, getMilestones } from '@/data/api/construction';
import type { ConstructionPhase } from '@/data/models/construction-update';
import { prepare, settle, whenHydrated } from '../support/browser';

const { construction: copy } = projectCopy;
const PAGE = 4;
const updates = await getConstructionUpdates();
const milestones = await getMilestones();
const areas = await getAreas();
const phases = Object.keys(uiCopy.constructionPhases).filter(
  (key) => key !== 'all',
) as ConstructionPhase[];
const emptyPair = phases
  .flatMap((phase) => areas.map((area) => ({ phase, area })))
  .find(({ phase, area }) => !updates.some((u) => u.phase === phase && u.areaId === area.id));
const piling = updates.filter((item) => item.phase === 'piling');
const oldest = updates[updates.length - 1];

async function open(page: Page, path: string = routes.project.construction, width = 1440) {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'button[aria-pressed]');
}

const entries = (page: Page) => page.locator('#updates').locator('xpath=..').locator('article');
const chip = (page: Page, phase: string) => page.getByRole('button', { name: phase, exact: true });
const areaSelect = (page: Page) =>
  page
    .getByRole('region', { name: copy.updates.title })
    .getByRole('combobox', { name: copy.updates.areaLabel });
const live = (page: Page) => page.locator('div[aria-live="polite"].sr-only');
const loadOlder = (page: Page) => page.getByRole('button', { name: uiCopy.actions.loadOlder });

test.describe('construction: page', () => {
  test('has one h1, the newest update date and the two sections', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.header.title);
    await expect(page.getByText(uiCopy.time.updatedOn('22 Oct 2026'))).toBeVisible();
    const ids = await page
      .locator('article h2[tabindex="-1"]')
      .evaluateAll((list) => list.map((h) => h.id));
    expect(ids).toEqual(['timeline', 'updates']);
  });

  test('the timeline lists every milestone as done or planned, with Today between', async ({
    page,
  }) => {
    await open(page);
    const items = page.locator('#timeline').locator('xpath=..').locator('ol > li');
    await expect(items).toHaveCount(milestones.length + 1);
    await expect(items.filter({ hasText: uiCopy.timeline.past }).first()).toBeAttached();
    await expect(items.filter({ hasText: uiCopy.timeline.future }).first()).toBeAttached();
    await expect(page.getByText(uiCopy.time.today, { exact: true }).first()).toBeVisible();
  });

  test('the timeline is a row from 1280 px and a column below', async ({ page }) => {
    await open(page);
    const list = page.locator('#timeline').locator('xpath=..').locator('ol');
    expect(await list.evaluate((el) => getComputedStyle(el).flexDirection)).toBe('row');
    await page.setViewportSize({ width: 1100, height: 900 });
    expect(await list.evaluate((el) => getComputedStyle(el).flexDirection)).toBe('column');
  });

  test('the note links to the traffic map and related pages link on', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('link', { name: copy.updates.note.link })).toHaveAttribute(
      'href',
      routes.traffic.map,
    );
    const relatedList = page.getByRole('region', { name: uiCopy.docsPage.relatedPages });
    for (const related of copy.related) {
      await expect(
        relatedList.getByRole('link', { name: new RegExp(related.label) }),
      ).toHaveAttribute('href', related.href);
    }
  });
});

test.describe('construction: site updates', () => {
  test('starts with the four newest updates, All updates pressed', async ({ page }) => {
    await open(page);
    await expect(entries(page)).toHaveCount(PAGE);
    await expect(entries(page).first().getByRole('heading', { level: 3 })).toContainText(
      updates[0]?.timelineTitle ?? updates[0]?.title ?? '',
    );
    await expect(chip(page, uiCopy.constructionPhases.all)).toHaveAttribute('aria-pressed', 'true');
    await expect(areaSelect(page)).toHaveValue('all');
  });

  test('a phase chip filters the list, updates the URL and announces the count', async ({
    page,
  }) => {
    await open(page);
    await chip(page, uiCopy.constructionPhases.piling).click();
    await expect(chip(page, uiCopy.constructionPhases.piling)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(chip(page, uiCopy.constructionPhases.all)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(entries(page)).toHaveCount(Math.min(PAGE, piling.length));
    await expect(page).toHaveURL(/\?phase=piling/);
    await expect(live(page)).toContainText(uiCopy.constructionPhases.piling);
    await expect(chip(page, uiCopy.constructionPhases.piling)).toBeFocused();
  });

  test('the area select combines with the phase and writes both to the URL', async ({ page }) => {
    await open(page);
    const area = areas.find((item) =>
      updates.some((u) => u.areaId === item.id && u.phase === 'piling'),
    );
    await chip(page, uiCopy.constructionPhases.piling).click();
    await areaSelect(page).focus();
    await areaSelect(page).selectOption(area?.id ?? '');
    const expected = piling.filter((item) => item.areaId === area?.id).length;
    await expect(entries(page)).toHaveCount(Math.min(PAGE, expected));
    await expect(page).toHaveURL(new RegExp(`phase=piling&area=${area?.id}`));
    await expect(areaSelect(page)).toBeFocused();
  });

  test('filters in the URL are applied on load; unknown values fall back to All', async ({
    page,
  }) => {
    await open(page, `${routes.project.construction}?phase=piling`);
    await expect(chip(page, uiCopy.constructionPhases.piling)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await open(page, `${routes.project.construction}?phase=nonsense&area=nowhere`);
    await expect(chip(page, uiCopy.constructionPhases.all)).toHaveAttribute('aria-pressed', 'true');
    await expect(areaSelect(page)).toHaveValue('all');
  });

  test('a filter with no match shows the empty state; Show all updates resets and focuses All updates', async ({
    page,
  }) => {
    test.skip(!emptyPair, 'every phase and area pair has an update');
    await open(page);
    await chip(page, uiCopy.constructionPhases[emptyPair?.phase ?? 'piling']).click();
    await areaSelect(page).selectOption(emptyPair?.area.id ?? '');
    await expect(page.locator('#main p', { hasText: copy.updates.empty.title })).toBeVisible();
    await expect(live(page)).toHaveText(copy.updates.status.none);
    await expect(loadOlder(page)).toHaveCount(0);
    await page.getByRole('button', { name: copy.updates.empty.action }).click();
    await expect(entries(page)).toHaveCount(PAGE);
    await expect(chip(page, uiCopy.constructionPhases.all)).toBeFocused();
    await expect(page).not.toHaveURL(/phase=|area=/);
  });

  test('Load older updates appends four, moves focus to the first new heading, then ends', async ({
    page,
  }) => {
    await open(page);
    await loadOlder(page).click();
    await expect(entries(page)).toHaveCount(PAGE * 2);
    await expect(entries(page).nth(PAGE).getByRole('heading', { level: 3 })).toBeFocused();
    await loadOlder(page).click();
    await expect(entries(page)).toHaveCount(updates.length);
    await expect(page.getByText(copy.updates.allLoaded)).toBeVisible();
    await expect(loadOlder(page)).toHaveCount(0);
  });

  test('photos follow the photo count, at most three, as placeholders', async ({ page }) => {
    await open(page);
    const first = entries(page).first();
    const expected = Math.min(3, updates[0]?.photoCount ?? 0);
    await expect(first.getByText(copy.updates.photosNote(expected))).toBeAttached();
    await expect(first.locator('[aria-hidden="true"] svg')).toHaveCount(expected);
  });

  test('each entry shows date, place, phase label and the byline', async ({ page }) => {
    await open(page);
    const first = entries(page).first();
    await expect(first.locator('time')).toHaveAttribute('datetime', updates[0]?.date ?? '');
    await expect(first).toContainText(updates[0]?.location ?? '');
    await expect(first).toContainText(uiCopy.constructionPhases[updates[0]?.phase ?? 'piling']);
    await expect(first).toContainText(copy.updates.postedBy);
  });
});

test.describe('construction: deep links and On this page', () => {
  test('a link to an older update loads it, scrolls to it and focuses its heading', async ({
    page,
  }) => {
    await open(page, routes.project.constructionUpdate(oldest?.id ?? ''));
    const target = page.locator(`[id="${oldest?.id}"]`);
    await expect(target).toBeVisible();
    await expect(target.getByRole('heading', { level: 3 })).toBeFocused();
    await expect(target).toBeInViewport();
  });

  test('a link to a hidden update resets the filters that hide it', async ({ page }) => {
    const other = updates.find((item) => item.phase !== 'piling');
    await open(page, `${routes.project.construction}?phase=piling#${other?.id}`);
    await expect(page.locator(`[id="${other?.id}"]`)).toBeVisible();
    await expect(chip(page, uiCopy.constructionPhases.all)).toHaveAttribute('aria-pressed', 'true');
  });

  test('the aside lists the two sections and one sub-item per rendered update', async ({
    page,
  }) => {
    await open(page);
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside.getByRole('link', { name: copy.toc.timeline })).toHaveAttribute(
      'href',
      '#timeline',
    );
    await expect(aside.getByRole('link', { name: copy.toc.updates })).toHaveAttribute(
      'href',
      '#updates',
    );
    await expect(aside.getByRole('link')).toHaveCount(2 + PAGE);
    await loadOlder(page).click();
    await expect(aside.getByRole('link')).toHaveCount(2 + 6);
    await chip(page, uiCopy.constructionPhases.piling).click();
    await expect(aside.getByRole('link')).toHaveCount(2 + Math.min(PAGE, piling.length));
  });

  test('a sub-item scrolls to its update', async ({ page }) => {
    await open(page);
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await aside.getByRole('link').last().click();
    await expect(page).toHaveURL(new RegExp(`#${updates[PAGE - 1]?.id}$`));
  });
});

test.describe('construction: small screens', () => {
  test('has no sideways scroll from 320 px; the timeline is vertical and entries stack', async ({
    page,
  }) => {
    for (const width of [320, 390, 768, 1024]) {
      await open(page, routes.project.construction, width);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test('Load older updates works on a phone', async ({ page }) => {
    await open(page, routes.project.construction, 390);
    await loadOlder(page).click();
    await expect(entries(page)).toHaveCount(PAGE * 2);
  });
});
