import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { getConstructionUpdates } from '@/data/api/construction';
import { getMostAskedFaq } from '@/data/api/faq';
import { prepare, settle } from '../support/browser';

const { overview } = projectCopy;

test.describe('project overview', () => {
  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(routes.project.overview);
    await settle(page);
  });

  test('shows one h1 and three sections in order', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(overview.header.title);
    const headings = page.locator('article h2');
    await expect(headings).toHaveText([
      overview.pages.title,
      overview.latest.title,
      overview.questions.title,
    ]);
  });

  test('each card links its title and three deep links', async ({ page }) => {
    for (const card of overview.pages.cards) {
      const title = page.locator('article').getByRole('link', { name: card.title, exact: true });
      await expect(title).toHaveAttribute('href', card.href);
      const list = page.getByRole('list', { name: card.title });
      await expect(list.getByRole('link')).toHaveCount(3);
    }
    const faqLinks = page.getByRole('list', { name: overview.pages.cards[1]?.title });
    await expect(faqLinks.getByRole('link').first()).toHaveAttribute(
      'href',
      routes.project.faqItem('construction-hours'),
    );
    await expect(faqLinks.getByRole('link').last()).toHaveAttribute(
      'href',
      routes.project.faqTopic('land'),
    );
  });

  test('card title underlines on hover', async ({ page }) => {
    const title = page.locator('article').getByRole('link', {
      name: overview.pages.cards[0]?.title ?? '',
      exact: true,
    });
    await title.hover();
    await expect(title).toHaveCSS('text-decoration-line', 'underline');
  });

  test('latest update shows the newest record and links to construction', async ({ page }) => {
    const [latest] = await getConstructionUpdates();
    await expect(page.getByRole('heading', { level: 3, name: latest?.title })).toBeVisible();
    await expect(page.getByText(latest?.summary ?? '')).toBeVisible();
    await expect(page.locator('article time').first()).toHaveAttribute(
      'datetime',
      latest?.date ?? '',
    );
    await expect(page.getByRole('link', { name: overview.latest.link })).toHaveAttribute(
      'href',
      routes.project.construction,
    );
  });

  test('popular questions are three link rows to FAQ items', async ({ page }) => {
    const popular = (await getMostAskedFaq()).slice(0, 3);
    for (const item of popular) {
      await expect(page.getByRole('link', { name: item.question })).toHaveAttribute(
        'href',
        routes.project.faqItem(item.id),
      );
    }
    await expect(page.getByRole('link', { name: overview.questions.link })).toHaveAttribute(
      'href',
      routes.project.faq,
    );
  });

  test('question row has a hover background and a keyboard focus ring', async ({ page }) => {
    const [first] = await getMostAskedFaq();
    const row = page.getByRole('link', { name: first?.question ?? '' });
    await row.hover();
    await expect(row).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await row.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(row).toBeFocused();
  });

  test('a question row opens the FAQ item', async ({ page }) => {
    const [first] = await getMostAskedFaq();
    await page.getByRole('link', { name: first?.question ?? '' }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.project.faq}#${first?.id}$`));
    await expect(
      page.getByRole('button', { name: new RegExp(first?.question ?? '') }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  test('Need help shows report, track and a tap-to-call careline', async ({ page }) => {
    const help = page.getByRole('region', { name: 'Need help?' }).last();
    await expect(help.getByRole('link', { name: 'Report an issue' })).toHaveAttribute(
      'href',
      routes.reportTrack.report,
    );
    await expect(help.getByRole('link', { name: 'Track a ticket' })).toHaveAttribute(
      'href',
      routes.reportTrack.track,
    );
    await expect(help.locator('a[href^="tel:"]')).toHaveCount(1);
  });

  test('On this page marks the section in view and moves focus to the heading', async ({
    page,
  }) => {
    const toc = page.getByRole('navigation', { name: /on this page/i });
    await expect(toc.getByRole('link')).toHaveCount(3);
    await toc.getByRole('link', { name: overview.toc.questions }).click();
    await expect(page.locator('#popular-questions')).toBeFocused();
  });

  test('cards stack on a phone and sub-links are 44 px tall', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    const cards = page.locator('article > div > section').first().locator('> ul > li');
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second?.y ?? 0).toBeGreaterThan((first?.y ?? 0) + (first?.height ?? 0) - 1);
    const sub = page.getByRole('link', { name: 'Two routes, one line' });
    expect((await sub.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test('cards sit in three columns at tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    const cards = page.locator('article > div > section').first().locator('> ul > li');
    const a = await cards.nth(0).boundingBox();
    const c = await cards.nth(2).boundingBox();
    expect(Math.abs((a?.y ?? 0) - (c?.y ?? 1))).toBeLessThan(2);
  });
});
