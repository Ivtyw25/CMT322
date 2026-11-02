import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { mockUser } from '@/data/mock/user';
import { prepare, settle } from '../support/browser';
import { SAMPLE_TICKET_ID } from '../support/pages';

const { submitted } = reportTrackCopy;
const STORE_KEY = 'mlc-submitted-reports';

async function open(page: Page, path: string, signedIn = true, width = 1440) {
  await prepare(page, { signedIn });
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
}

test.describe('report submitted', () => {
  test('the owner sees the confirmation', async ({ page }) => {
    await open(page, routes.reportTrack.submitted(SAMPLE_TICKET_ID));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(submitted.header.title);
    await expect(page.getByText(submitted.header.lede('Mei Ling', mockUser.email))).toBeVisible();
    await expect(page.locator('#ticket-id-value')).toHaveText(SAMPLE_TICKET_ID);
    await expect(page.locator('article h2')).toHaveText([
      submitted.ticket.label,
      submitted.next.title,
      submitted.sent.title,
      submitted.email.title,
    ]);
    await expect(
      page.getByRole('list', { name: 'Ticket status' }).getByRole('listitem'),
    ).toHaveCount(4);
    await expect(page.getByText('Driveway blocked by site hoarding').first()).toBeVisible();
  });

  test('Copy ID puts the ID on the clipboard and says Copied for two seconds', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await open(page, routes.reportTrack.submitted(SAMPLE_TICKET_ID));
    await page.getByRole('button', { name: submitted.ticket.copy }).click();
    await expect(page.getByText(submitted.ticket.copied)).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(SAMPLE_TICKET_ID);
    await expect(page.getByRole('button', { name: submitted.ticket.copy })).toBeVisible();
    await expect(page.getByText(submitted.ticket.copied)).toBeHidden({ timeout: 4000 });
  });

  test('the actions go to tracking, a new report and home', async ({ page }) => {
    await open(page, routes.reportTrack.submitted(SAMPLE_TICKET_ID));
    const { actions } = submitted;
    await expect(page.getByRole('link', { name: actions.track })).toHaveAttribute(
      'href',
      routes.reportTrack.ticket(SAMPLE_TICKET_ID),
    );
    await expect(page.getByRole('link', { name: actions.another })).toHaveAttribute(
      'href',
      routes.reportTrack.report,
    );
    await expect(page.getByRole('link', { name: actions.home })).toHaveAttribute(
      'href',
      routes.home,
    );
  });

  test('a report sent from this browser shows too', async ({ page }) => {
    await page.addInitScript(
      ([key, user]) => {
        const at = new Date().toISOString();
        window.localStorage.setItem(
          key,
          JSON.stringify([
            {
              id: 'MLC-261029-0500',
              type: 'feedback',
              categoryId: 'noise',
              title: 'Night work is loud',
              description: 'Too loud.',
              location: 'Jalan Sultan Azlan Shah',
              stationCode: null,
              status: 'submitted',
              submittedAt: at,
              updatedAt: at,
              reporterId: user,
              attachmentCount: 0,
              updates: [],
              resolution: null,
            },
          ]),
        );
      },
      [STORE_KEY, mockUser.id] as const,
    );
    await open(page, routes.reportTrack.submitted('MLC-261029-0500'));
    await expect(page.locator('#ticket-id-value')).toHaveText('MLC-261029-0500');
    await expect(page.getByText('Night work is loud').first()).toBeVisible();
  });

  test('unknown IDs get the unavailable note without a log in button', async ({ page }) => {
    await open(page, routes.reportTrack.submitted('MLC-000000-0000'));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      submitted.unavailable.heading,
    );
    await expect(page.getByText(submitted.unavailable.title)).toBeVisible();
    await expect(page.getByRole('link', { name: submitted.unavailable.login })).toHaveCount(0);
  });

  test('guests get the unavailable note with a log in button', async ({ page }) => {
    await open(page, routes.reportTrack.submitted(SAMPLE_TICKET_ID), false);
    await expect(page.getByText(submitted.unavailable.title)).toBeVisible();
    await expect(page.getByRole('link', { name: submitted.unavailable.login })).toBeVisible();
    await expect(page.locator('#ticket-id-value')).toHaveCount(0);
  });

  test('has no horizontal scroll at 320 px', async ({ page }) => {
    await open(page, routes.reportTrack.submitted(SAMPLE_TICKET_ID), true, 320);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
