import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getFaq, getMostAskedFaq } from '@/data/api/faq';
import { prepare, settle, whenHydrated } from '../support/browser';

const { faq } = projectCopy;
const { categories, items } = await getFaq();
const mostAsked = await getMostAskedFaq();
const land = categories.find((category) => category.id === 'land');
const landItems = items.filter((item) => item.categoryId === 'land');
const notMostAsked = items.find((item) => item.mostAskedRank === null);

async function open(page: Page, path: string = routes.project.faq, width = 1440) {
  await prepare(page);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'input[type="search"]');
}

const questions = (page: Page) => page.locator('section[aria-labelledby="questions"]');
const headers = (page: Page) => questions(page).locator('h3 button');
const search = (page: Page) => page.getByRole('searchbox', { name: faq.search.label });

test.describe('faq: most asked view', () => {
  test('shows the five most asked questions with the first open', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(faq.header.title);
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
    await expect(headers(page)).toHaveCount(mostAsked.length);
    await expect(headers(page).first()).toHaveAttribute('aria-expanded', 'true');
    await expect(headers(page).nth(1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('an accordion header opens and closes, and several can be open', async ({ page }) => {
    await open(page);
    const second = headers(page).nth(1);
    const third = headers(page).nth(2);
    await second.click();
    await third.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(third).toHaveAttribute('aria-expanded', 'true');
    await expect(headers(page).first()).toHaveAttribute('aria-expanded', 'true');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  test('a header is read as the question first, then its topic', async ({ page }) => {
    await open(page);
    const first = mostAsked[0];
    const topic = categories.find((category) => category.id === first?.categoryId);
    await expect(headers(page).first()).toHaveAccessibleName(
      new RegExp(
        String.raw`^${(first?.question ?? '').replace('?', String.raw`\?`)}\s*, ${topic?.shortLabel}$`,
      ),
    );
  });

  test('an open item shows the short answer, next steps and its own feedback', async ({ page }) => {
    await open(page);
    const first = mostAsked[0];
    await expect(page.getByText(first?.answer[0] ?? '').first()).toBeVisible();
    await expect(page.getByText(faq.item.nextSteps).first()).toBeVisible();
    for (const step of first?.nextSteps ?? []) {
      await expect(page.getByRole('link', { name: step.label }).first()).toHaveAttribute(
        'href',
        step.href,
      );
    }
    await expect(page.getByText(faq.item.feedback.question).first()).toBeVisible();
    await expect(page.getByText(/Last updated/).first()).toBeVisible();
  });

  test('item feedback: No shows reasons and a reason thanks the visitor', async ({ page }) => {
    await open(page);
    const row = questions(page).getByRole('group', { name: faq.item.feedback.question }).first();
    await row.getByRole('button', { name: uiCopy.docsPage.feedback.no, exact: true }).click();
    const reasons = page.getByRole('group', { name: faq.item.feedback.reasonsLabel });
    await expect(reasons.getByRole('button')).toHaveCount(3);
    await reasons.getByRole('button').first().click();
    await expect(
      page.getByRole('status').filter({ hasText: faq.item.feedback.thanksReason }),
    ).toBeFocused();
  });

  test('item feedback: Yes thanks the visitor', async ({ page }) => {
    await open(page);
    const row = questions(page).getByRole('group', { name: faq.item.feedback.question }).first();
    await row.getByRole('button', { name: uiCopy.docsPage.feedback.yes, exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: faq.item.feedback.thanks }),
    ).toBeFocused();
  });

  test('Show all questions switches to the full list and focuses the heading', async ({ page }) => {
    await open(page);
    await page
      .getByRole('button', { name: uiCopy.actions.showAll(items.length, faq.view.nouns) })
      .click();
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.allTitle);
    await expect(page.locator('#questions')).toBeFocused();
    await expect(headers(page)).toHaveCount(items.length);
    await expect(page).toHaveURL(/view=all/);
    await expect(headers(page).first()).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('faq: topics', () => {
  test('topic cards link to ?topic= and the audience switch filters them', async ({ page }) => {
    await open(page);
    const cards = page.locator('#topics').locator('xpath=ancestor::section').locator('article');
    await expect(cards).toHaveCount(categories.length);
    for (const category of categories) {
      await expect(page.getByRole('link', { name: category.label })).toHaveAttribute(
        'href',
        routes.project.faqTopic(category.id),
      );
    }
    const audience = page.getByRole('radiogroup', { name: faq.topics.audienceLabel });
    await page.getByLabel(faq.topics.audiences.land).check({ force: true });
    await expect(cards).toHaveCount(1);
    await page.getByLabel(faq.topics.audiences['live-work']).check({ force: true });
    await expect(cards).toHaveCount(2);
    await page.getByLabel(faq.topics.audiences.everyone).check({ force: true });
    await expect(cards).toHaveCount(categories.length);
    await expect(audience.or(page.locator('fieldset')).first()).toBeVisible();
  });

  test('a topic link shows that topic, marks its card and focuses the heading', async ({
    page,
  }) => {
    await open(page);
    await page.getByRole('link', { name: land?.label ?? '' }).click();
    await expect(page).toHaveURL(/topic=land/);
    await expect(page.locator('#questions')).toHaveText(land?.label ?? '');
    await expect(page.locator('#questions')).toBeFocused();
    await expect(page.getByText(faq.topics.count(landItems.length)).first()).toBeVisible();
    await expect(headers(page)).toHaveCount(landItems.length);
    await expect(page.getByRole('link', { name: land?.label ?? '' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('Show most asked questions leaves the topic', async ({ page }) => {
    await open(page, routes.project.faqTopic('land'));
    await expect(page.locator('#questions')).toHaveText(land?.label ?? '');
    await page.getByRole('button', { name: faq.view.showMostAsked }).click();
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
    await expect(page).not.toHaveURL(/topic=/);
    await expect(page.locator('#questions')).toBeFocused();
  });

  test('Back from a topic returns to the most asked view', async ({ page }) => {
    await open(page);
    await page.getByRole('link', { name: land?.label ?? '' }).click();
    await expect(page.locator('#questions')).toHaveText(land?.label ?? '');
    await page.goBack();
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
  });

  test('an unknown topic is ignored', async ({ page }) => {
    await open(page, `${routes.project.faq}?topic=nonsense`);
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
  });
});

test.describe('faq: search', () => {
  test('filters as you type, bolds the match and writes ?q= after a pause', async ({ page }) => {
    await open(page);
    await search(page).fill('night works');
    await expect(page.locator('#questions')).toHaveText(faq.view.results('night works'));
    const count = await headers(page).count();
    expect(count).toBeGreaterThan(0);
    await expect(headers(page).first().locator('strong').first()).toBeVisible();
    await expect(page).toHaveURL(/q=night\+works|q=night%20works/);
  });

  test('matches without regard to case or accents', async ({ page }) => {
    await open(page);
    await search(page).fill('CONSTRUCTION');
    await expect(headers(page).first()).toBeVisible();
    await search(page).fill('construçtion');
    await expect(headers(page).first()).toBeVisible();
  });

  test('a popular chip fills the field and keeps focus on the chip', async ({ page }) => {
    await open(page);
    const chip = page.getByRole('button', { name: faq.search.popular[0] ?? '', exact: true });
    await chip.click();
    await expect(search(page)).toHaveValue(faq.search.popular[0] ?? '');
    await expect(chip).toBeFocused();
    await expect(chip).not.toHaveAttribute('aria-pressed', /.+/);
  });

  test('a single result opens by itself', async ({ page }) => {
    await open(page);
    await search(page).fill(notMostAsked?.question ?? '');
    await expect(headers(page)).toHaveCount(1);
    await expect(headers(page).first()).toHaveAttribute('aria-expanded', 'true');
  });

  test('Enter moves focus to the results heading', async ({ page }) => {
    await open(page);
    await search(page).fill('noise');
    await search(page).press('Enter');
    await expect(page.locator('#questions')).toBeFocused();
  });

  test('Escape clears the query and keeps focus in the field', async ({ page }) => {
    await open(page);
    await search(page).fill('noise');
    await search(page).press('Escape');
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
  });

  test('the clear button empties the field and refocuses it', async ({ page }) => {
    await open(page);
    await search(page).fill('noise');
    await page.getByRole('button', { name: uiCopy.actions.clearSearch }).first().click();
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
  });

  test('no match shows the empty block and Clear search returns to the field', async ({ page }) => {
    await open(page);
    await search(page).fill('zzzzqx');
    await expect(page.getByText(faq.search.empty.title('zzzzqx'))).toBeVisible();
    await expect(page.getByText(faq.search.empty.body)).toBeVisible();
    await expect(headers(page)).toHaveCount(0);
    await questions(page).getByRole('button', { name: uiCopy.actions.clearSearch }).click();
    await expect(search(page)).toHaveValue('');
    await expect(search(page)).toBeFocused();
    await expect(headers(page)).toHaveCount(mostAsked.length);
  });

  test('a ?q= link opens the results, and search wins over a topic', async ({ page }) => {
    await open(page, `${routes.project.faq}?q=compensation&topic=land`);
    await expect(search(page)).toHaveValue('compensation');
    await expect(page.locator('#questions')).toHaveText(faq.view.results('compensation'));
  });

  test('clearing the query returns to the topic', async ({ page }) => {
    await open(page, routes.project.faqTopic('land'));
    await search(page).fill('compensation');
    await expect(page.locator('#questions')).toHaveText(faq.view.results('compensation'));
    await search(page).fill('');
    await expect(page.locator('#questions')).toHaveText(land?.label ?? '');
  });
});

test.describe('faq: deep links', () => {
  test('#id of a most asked item opens it and focuses its header', async ({ page }) => {
    const target = mostAsked[2];
    await open(page, routes.project.faqItem(target?.id ?? ''));
    const header = page.locator(`#${target?.id} button`).first();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(header).toBeFocused();
  });

  test('#id of an item outside the view switches to all questions', async ({ page }) => {
    await open(page, routes.project.faqItem(notMostAsked?.id ?? ''));
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.allTitle);
    const header = page.locator(`#${notMostAsked?.id} button`).first();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(header).toBeFocused();
  });

  test('an unknown #id is ignored', async ({ page }) => {
    await open(page, `${routes.project.faq}#nothing-here`);
    await expect(page.locator('#questions')).toHaveText(faq.mostAsked.title);
  });
});

test.describe('faq: page furniture', () => {
  test('Still need help card has report, track and a tel link', async ({ page }) => {
    await open(page);
    const card = page.getByRole('region', { name: faq.stillNeedHelp.title });
    await expect(card.getByRole('link', { name: 'Report an issue' })).toHaveAttribute(
      'href',
      routes.reportTrack.report,
    );
    await expect(card.getByRole('link', { name: 'Track a ticket' })).toHaveAttribute(
      'href',
      routes.reportTrack.track,
    );
    await expect(card.locator('a[href^="tel:"]')).toHaveCount(1);
  });

  test('related pages link to About, Construction and the traffic map', async ({ page }) => {
    await open(page);
    const related = page.getByRole('region', { name: uiCopy.docsPage.relatedPages });
    for (const entry of faq.related) {
      await expect(related.getByRole('link', { name: new RegExp(entry.label) })).toHaveAttribute(
        'href',
        entry.href,
      );
    }
  });

  test('On this page lists the two sections', async ({ page }) => {
    await open(page);
    const toc = page.getByRole('navigation', { name: /on this page/i });
    await expect(toc.getByRole('link')).toHaveCount(2);
  });
});

test.describe('faq: layout', () => {
  test('the audience switch is vertical at 390 px and a row at 768 px', async ({ page }) => {
    await open(page, routes.project.faq, 390);
    const options = page.locator('fieldset label');
    const a = await options.nth(0).boundingBox();
    const b = await options.nth(1).boundingBox();
    expect(b?.y ?? 0).toBeGreaterThan((a?.y ?? 0) + 20);
    expect(a?.height ?? 0).toBeGreaterThanOrEqual(44);
    await page.setViewportSize({ width: 768, height: 900 });
    const c = await options.nth(0).boundingBox();
    const d = await options.nth(1).boundingBox();
    expect(Math.abs((c?.y ?? 0) - (d?.y ?? 1))).toBeLessThan(2);
  });

  test('has no horizontal scroll at 320 px', async ({ page }) => {
    await open(page, routes.project.faq, 320);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
});
