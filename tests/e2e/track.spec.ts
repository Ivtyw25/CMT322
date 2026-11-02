import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { prepare, settle, whenHydrated } from '../support/browser';
import { SAMPLE_TICKET_ID } from '../support/pages';

const { track } = reportTrackCopy;
const STORE_KEY = 'mlc-submitted-reports';

async function open(page: Page, path: string, signedIn = false, width = 1440) {
  await prepare(page, { signedIn });
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'form input');
}

test.describe('track a ticket: search', () => {
  test('the empty page shows only the search', async ({ page }) => {
    await open(page, routes.reportTrack.track);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(track.header.title);
    await expect(page.getByRole('search', { name: track.search.formLabel })).toBeVisible();
    await expect(page.locator('#result')).toHaveCount(0);
  });

  test('an empty submit and a wrong format show their errors', async ({ page }) => {
    await open(page, routes.reportTrack.track);
    const input = page.getByLabel(track.search.label);
    await page.getByRole('button', { name: track.search.submit }).click();
    await expect(page.getByText(track.errors.empty)).toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.fill('abc');
    await input.blur();
    await expect(page.getByText(track.errors.invalid)).toBeVisible();
    expect(page.url()).toContain(routes.reportTrack.track);
  });

  test('a valid ID, even pasted with an en dash and spaces, opens the ticket', async ({
    page,
  }) => {
    await open(page, routes.reportTrack.track);
    await page.getByLabel(track.search.label).fill('mlc–261028 – 0482');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${routes.reportTrack.ticket(SAMPLE_TICKET_ID)}$`));
    await expect(page.locator('#result')).toBeFocused();
    await expect(page.getByLabel(track.search.label)).toHaveValue(SAMPLE_TICKET_ID);
  });

  test('a malformed ID in the address shows the error, not a 404', async ({ page }) => {
    await open(page, routes.reportTrack.ticket('abc'));
    await expect(page.getByLabel(track.search.label)).toHaveValue('ABC');
    await expect(page.getByText(track.errors.invalid)).toBeVisible();
    await expect(page.locator('#result')).toHaveCount(0);
  });

  test('an unknown ID shows the not-found note and Try another focuses the field', async ({
    page,
  }) => {
    await open(page, routes.reportTrack.ticket('MLC-000000-0000'));
    await expect(page.getByRole('heading', { name: track.notFound.title })).toBeVisible();
    await page.getByRole('button', { name: track.notFound.action }).click();
    await expect(page.getByLabel(track.search.label)).toBeFocused();
  });
});

test.describe('track a ticket: result', () => {
  test('the sample ticket shows status, replies and the owner report', async ({ page }) => {
    await open(page, routes.reportTrack.ticket(SAMPLE_TICKET_ID), true);
    await expect(page.locator('#result h2')).toHaveText('Driveway blocked by site hoarding');
    const steps = page.getByRole('list', { name: 'Ticket status' });
    await expect(steps.getByRole('listitem')).toHaveCount(4);
    await expect(steps.locator('[aria-current="step"]')).toContainText('In progress');
    await expect(page.locator('time')).toHaveCount(3);
    await expect(page.getByText('Since Monday the new hoarding')).toBeVisible();
    await expect(page.getByRole('img', { name: track.result.attachmentAlt(1, 2) })).toBeVisible();
    await expect(page.getByText(track.result.resolution.pending)).toBeVisible();
  });

  test('guests see status and replies but not the report text', async ({ page }) => {
    await open(page, routes.reportTrack.ticket(SAMPLE_TICKET_ID));
    await expect(page.locator('#result h2')).toBeVisible();
    await expect(page.getByText('Since Monday the new hoarding')).toHaveCount(0);
    await expect(page.getByText(track.result.privateTitle)).toBeVisible();
    await expect(page.getByRole('link', { name: track.result.login })).toHaveAttribute(
      'href',
      routes.account.loginReturningTo(routes.reportTrack.ticket(SAMPLE_TICKET_ID)),
    );
  });

  test('a resolved ticket completes every step and shows the resolution', async ({ page }) => {
    await open(page, routes.reportTrack.ticket('MLC-261015-0233'), true);
    const steps = page.getByRole('list', { name: 'Ticket status' });
    await expect(steps.getByText('Completed')).toHaveCount(4);
    await expect(page.getByText(track.result.resolution.title)).toBeVisible();
    await expect(page.getByText(track.result.resolution.pending)).toHaveCount(0);
  });

  test('long histories show five updates and reveal the rest with focus', async ({ page }) => {
    await page.addInitScript(
      ([key]) => {
        const updates = Array.from({ length: 8 }, (_, index) => ({
          id: `long-${index}`,
          at: `2026-10-2${index}T10:00:00+08:00`,
          status: 'pending',
          author: 'Penang Island City Council',
          message: `Update number ${index + 1}`,
        }));
        window.localStorage.setItem(
          key,
          JSON.stringify([
            {
              id: 'MLC-261020-0600',
              type: 'complaint',
              categoryId: 'noise',
              title: 'Long history',
              description: 'Text',
              location: 'Somewhere',
              stationCode: null,
              status: 'pending',
              submittedAt: '2026-10-20T10:00:00+08:00',
              updatedAt: '2026-10-27T10:00:00+08:00',
              reporterId: 'user-meiling',
              attachmentCount: 0,
              updates,
              resolution: null,
            },
          ]),
        );
      },
      [STORE_KEY] as const,
    );
    await open(page, routes.reportTrack.ticket('MLC-261020-0600'), true);
    await expect(page.getByText(/Update number/)).toHaveCount(5);
    await page.getByRole('button', { name: track.result.earlier(3) }).click();
    await expect(page.getByText(/Update number/)).toHaveCount(8);
    await expect(page.locator('[data-update="long-2"]')).toBeFocused();
  });

  test('has no horizontal scroll at 320 px', async ({ page }) => {
    await open(page, routes.reportTrack.ticket(SAMPLE_TICKET_ID), true, 320);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
