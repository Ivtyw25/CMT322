import { expect, test } from '@playwright/test';
import { routes } from '@/config/routes';
import { prepare } from '../support/browser';

for (const [path, title] of [
  [routes.legal.terms, 'Terms & Conditions'],
  [routes.legal.privacy, 'Privacy policy'],
  [routes.help.contact, 'Contact us'],
  [routes.help.accessibility, 'Accessibility'],
  [routes.help.sitemap, 'Sitemap'],
] as const) {
  test(`${title} has one main, one heading and no overflow at 320px`, async ({ page }) => {
    await prepare(page, { theme: 'dark' });
    await page.setViewportSize({ width: 320, height: 800 });
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
}

test('policy section navigation focuses the matching heading', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routes.legal.privacy);
  await page
    .getByRole('navigation', { name: 'On this page' })
    .getByRole('link', { name: '6. Cookies' })
    .click();
  await expect(page).toHaveURL(/#storage$/);
  await expect(page.getByRole('heading', { name: '6. Cookies' })).toBeFocused();
});

test('contact destinations and the sitemap use the shared routes', async ({ page }) => {
  await prepare(page);
  await page.goto(routes.help.contact);
  await expect(page.locator('article a[href^="tel:"]')).toHaveCount(1);
  await expect(page.locator('article a[href^="mailto:"]')).toHaveCount(1);
  await page.goto(routes.help.sitemap);
  const article = page.locator('article');
  for (const path of [
    routes.home,
    routes.project.overview,
    routes.traffic.overview,
    routes.account.login,
    routes.account.profile,
    routes.legal.privacy,
  ]) {
    await expect(article.locator(`a[href="${path}"]`).first()).toBeVisible();
  }
  await expect(article.locator('a[href^="/admin"]')).toHaveCount(0);
});

test('unknown routes offer recovery links and a single site shell', async ({ page }) => {
  await prepare(page);
  const response = await page.goto('/a-page-that-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('find that page');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Sitemap', exact: true }),
  ).toHaveAttribute('href', routes.help.sitemap);
});

for (const width of [390, 1440]) {
  test(`an unknown station renders one site shell at ${width}px`, async ({ page }) => {
    await prepare(page);
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(routes.project.station('does-not-exist'));
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('find that page');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(
      page.getByRole('main').getByRole('link', { name: 'Sitemap', exact: true }),
    ).toHaveAttribute('href', routes.help.sitemap);
  });
}

test('help pages use the joined sidebar; legal pages show only the Legal group', async ({
  page,
}) => {
  await prepare(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routes.help.contact);
  const sidebar = page.getByRole('navigation', { name: 'Section pages' });
  await expect(sidebar.getByText('Project', { exact: true })).toBeVisible();
  await expect(sidebar.getByText('Help', { exact: true })).toBeVisible();
  await expect(sidebar.getByText('Legal', { exact: true })).toHaveCount(0);
  for (const path of [routes.legal.terms, routes.legal.privacy]) {
    await page.goto(path);
    await expect(sidebar.getByText('Legal', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Help', { exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole('link')).toHaveCount(2);
  }
});

test('help pages show a group breadcrumb, legal pages go straight to Home and relevant help actions', async ({
  page,
}) => {
  await prepare(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routes.legal.privacy);
  await expect(
    page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'Legal', exact: true }),
  ).toHaveCount(0);
  await page.goto(routes.help.accessibility);
  await expect(
    page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'Help', exact: true }),
  ).toHaveAttribute('href', routes.help.contact);
  await expect(
    page
      .getByRole('main')
      .getByRole('link', { name: 'Contact us', exact: true })
      .filter({ hasNot: page.locator('svg') })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Read the FAQ', exact: true }),
  ).toHaveCount(0);
});
