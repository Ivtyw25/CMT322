import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { getRoadChangesThisWeek } from '@/data/api/traffic';
import { prepare, settle } from '../support/browser';

const copy = trafficCopy.overview;
const weekItems = await getRoadChangesThisWeek(3);

async function visit(page: Page, width = 1440) {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(routes.traffic.overview);
  await settle(page);
}

test('shows the title, the three page cards and their links', async ({ page }) => {
  await visit(page);
  await expect(page.getByRole('heading', { level: 1, name: copy.header.title })).toBeVisible();
  const targets = [routes.traffic.map, routes.traffic.route, routes.traffic.announcements];
  for (const [index, card] of copy.pages.cards.entries()) {
    await expect(
      page.locator('article').getByRole('link', { name: card.title, exact: true }),
    ).toHaveAttribute('href', targets[index] ?? '');
  }
});

test('a page card opens its page', async ({ page }) => {
  await visit(page);
  await page
    .locator('article')
    .getByRole('link', { name: copy.pages.cards[2]?.title ?? '', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`${routes.traffic.announcements}$`));
});

test('lists the road changes of the week with a link to each on the map', async ({ page }) => {
  await visit(page);
  const list = page.getByRole('list', { name: copy.week.listLabel });
  for (const item of weekItems) {
    await expect(list.getByRole('heading', { name: item.title })).toBeVisible();
    await expect(
      list.getByRole('link', { name: copy.week.viewOnMapNamed(item.title) }),
    ).toHaveAttribute('href', routes.traffic.mapFocus(item.id));
  }
  await expect(page.getByRole('link', { name: copy.week.seeAll })).toHaveAttribute(
    'href',
    routes.traffic.announcements,
  );
});

test('popular questions open and close', async ({ page }) => {
  await visit(page);
  const question = page.getByRole('button', { name: /road closures and traffic/i });
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'false');
});

test('the help block links to report and track', async ({ page }) => {
  await visit(page);
  const help = page.getByRole('region', { name: copy.help.title });
  await expect(help.getByRole('link', { name: copy.help.report })).toHaveAttribute(
    'href',
    routes.reportTrack.report,
  );
  await expect(help.getByRole('link', { name: copy.help.track })).toHaveAttribute(
    'href',
    routes.reportTrack.track,
  );
});

test('has no horizontal scroll at 320 px', async ({ page }) => {
  await visit(page, 320);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
