import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { getAnnouncements } from '@/data/api/announcements';
import { prepare, settle, whenHydrated } from '../support/browser';

const copy = trafficCopy.announcements;
const all = await getAnnouncements();
const count = (status: string) => all.filter((item) => item.status === status).length;
const PAGE = copy.pagination.pageSize;
const onPageTwo = all[PAGE + 1];
if (!onPageTwo) throw new Error('Mock announcements changed: update announcements.spec.ts');

async function visit(page: Page, path: string = routes.traffic.announcements, width = 1440) {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, '[role="tab"]');
}

const tab = (page: Page, name: string) => page.getByRole('tab', { name: new RegExp(`^${name}`) });
const rows = (page: Page) => page.locator('tbody tr');
const viewOnMap = new RegExp(`^${copy.table.viewOnMapLabel}`);
const viewNotice = new RegExp(`^${copy.table.viewNoticeLabel}`);

test('shows six rows, the summary and the tab counts', async ({ page }) => {
  await visit(page);
  await expect(rows(page)).toHaveCount(PAGE);
  await expect(page.getByText(copy.pagination.summary(1, PAGE, all.length))).toBeVisible();
  await expect(tab(page, copy.tabs.all)).toContainText(String(all.length));
  await expect(tab(page, copy.tabs.current)).toContainText(String(count('active')));
  await expect(page.getByRole('table', { name: copy.table.label })).toBeVisible();
});

test('a status tab filters the list and the address, and arrow keys move between tabs', async ({
  page,
}) => {
  await visit(page);
  await tab(page, copy.tabs.upcoming).click();
  await expect(rows(page)).toHaveCount(count('upcoming'));
  await expect(page).toHaveURL(/status=upcoming/);
  await tab(page, copy.tabs.upcoming).press('ArrowRight');
  await expect(tab(page, copy.tabs.past)).toHaveAttribute('aria-selected', 'true');
});

test('search narrows the list, and the counts and address follow it', async ({ page }) => {
  await visit(page);
  await page.getByRole('searchbox', { name: copy.filters.searchLabel }).fill('bus stops');
  await expect(rows(page)).toHaveCount(1);
  await expect(tab(page, copy.tabs.all)).toContainText('1');
  await expect(page).toHaveURL(/q=bus\+stops|q=bus%20stops/);
});

test('no match shows the empty state, and Clear filters restores the list', async ({ page }) => {
  await visit(page);
  await page.getByRole('searchbox', { name: copy.filters.searchLabel }).fill('zzzzqq');
  await expect(page.getByText(copy.empty.filtered.title)).toBeVisible();
  await page.getByRole('button', { name: copy.empty.filtered.reset }).click();
  await expect(rows(page)).toHaveCount(PAGE);
});

test('the pager changes the page, announces it and moves focus to the summary', async ({
  page,
}) => {
  await visit(page);
  await page.getByRole('link', { name: 'Page 2' }).click();
  await expect(page).toHaveURL(/page=2/);
  const summary = page
    .locator('p[tabindex="-1"]')
    .filter({ hasText: copy.pagination.summary(PAGE + 1, PAGE * 2, all.length) });
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
});

test('an out-of-range page clamps to the last page', async ({ page }) => {
  await visit(page, `${routes.traffic.announcements}?page=99`);
  await expect(page.locator('nav a[aria-current="page"]')).toHaveText('4');
});

test('a deep link resets the filters, opens the right page and highlights the row', async ({
  page,
}) => {
  await visit(page, `${routes.traffic.announcements}?status=past&q=zzz#${onPageTwo.id}`);
  const row = page.locator(`[id="${onPageTwo.id}"]`);
  await expect(row).toBeVisible();
  await expect(row).toHaveAttribute('data-linked', 'true');
  await expect(row).toBeFocused();
  await expect(page).toHaveURL(/page=2/);
  await expect(page).not.toHaveURL(/status=/);
});

test('an unknown deep link shows a dismissible message', async ({ page }) => {
  await visit(page, `${routes.traffic.announcements}#no-such-notice`);
  await expect(page.getByRole('status').filter({ hasText: copy.notFound.text })).toBeVisible();
  await page.getByRole('button', { name: copy.notFound.dismiss }).click();
  await expect(page.getByText(copy.notFound.text)).toBeHidden();
});

test('below 1280 px the rows are cards with labelled values and two actions', async ({ page }) => {
  await visit(page, routes.traffic.announcements, 390);
  const first = rows(page).first();
  await expect(first.getByText(copy.table.card.dates)).toBeVisible();
  await expect(first.getByRole('link', { name: viewNotice })).toBeVisible();
  await expect(first.getByRole('link', { name: viewOnMap })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('View on map goes to the map with that item focused', async ({ page }) => {
  await visit(page);
  const first = all[0];
  if (!first) throw new Error('No announcements');
  await rows(page).first().getByRole('link', { name: viewOnMap }).click();
  await expect(page).toHaveURL(new RegExp(`focus=${first.id}`));
});
