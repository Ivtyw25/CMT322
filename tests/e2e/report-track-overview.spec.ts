import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { prepare, settle } from '../support/browser';

const { overview } = reportTrackCopy;

test.describe('report and track overview', () => {
  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(routes.reportTrack.overview);
    await settle(page);
  });

  test('the sidebar careline is one blue tap-to-call line', async ({ page }) => {
    const help = page.getByRole('region', { name: reportTrackCopy.shared.needHelp.title });
    const careline = help.locator('a[href^="tel:"]');
    await expect(careline).toHaveText('MRTCareline 1800-88-6782');
    const { lines, color, link } = await careline.evaluate((element) => {
      const style = getComputedStyle(element);
      const probe = document.createElement('a');
      probe.className = 'text-primary-700';
      document.body.append(probe);
      const linkColor = getComputedStyle(probe).color;
      probe.remove();
      return {
        lines: Math.round(element.getBoundingClientRect().height / parseFloat(style.lineHeight)),
        color: style.color,
        link: linkColor,
      };
    });
    expect(lines).toBeLessThanOrEqual(1);
    expect(color).toBe(link);
  });

  test('shows one h1 and three sections in order', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(overview.header.title);
    await expect(page.locator('article h2')).toHaveText([
      overview.pages.title,
      overview.howItWorks.title,
      overview.faq.title,
    ]);
  });

  test('the two cards link to the report form and to tracking', async ({ page }) => {
    const [report, track] = overview.pages.cards;
    const article = page.locator('article');
    await expect(article.getByRole('link', { name: report.title, exact: true })).toHaveAttribute(
      'href',
      routes.reportTrack.report,
    );
    await expect(article.getByRole('link', { name: track.title, exact: true })).toHaveAttribute(
      'href',
      routes.reportTrack.track,
    );
    await expect(article.getByText(report.points[0], { exact: true })).toBeVisible();
  });

  test('card title does not underline on hover', async ({ page }) => {
    const card = page.locator('article li').filter({ hasText: overview.pages.cards[0].title });
    await card.first().hover();
    await expect(card.first().getByRole('heading')).toHaveCSS('text-decoration-line', 'none');
  });

  test('lists the four steps', async ({ page }) => {
    const steps = page.getByRole('list').filter({ hasText: overview.howItWorks.steps[0].title });
    await expect(steps.getByRole('listitem')).toHaveCount(overview.howItWorks.steps.length);
  });

  test('the emergency note is plain text, not an alert', async ({ page }) => {
    await expect(page.getByText(overview.emergency)).toBeVisible();
    await expect(page.locator('article').getByRole('alert')).toHaveCount(0);
  });

  test('question rows open the FAQ at that question', async ({ page }) => {
    for (const item of overview.faq.items) {
      await expect(page.getByRole('link', { name: item.question })).toHaveAttribute(
        'href',
        routes.project.faqItem(item.faqId),
      );
    }
    await expect(page.getByRole('link', { name: overview.faq.seeAll })).toHaveAttribute(
      'href',
      routes.project.faq,
    );
  });

  test('guests read the account sentence; signed-in visitors do not', async ({ page }) => {
    await expect(page.getByText(overview.header.ledeGuest)).toBeVisible();
    const signedIn = await page.context().newPage();
    await prepare(signedIn, { signedIn: true });
    await signedIn.setViewportSize({ width: 1440, height: 900 });
    await signedIn.goto(routes.reportTrack.overview);
    await settle(signedIn);
    await expect(signedIn.getByText(overview.header.ledeGuest)).toBeHidden();
  });

  test('has no horizontal scroll at 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
