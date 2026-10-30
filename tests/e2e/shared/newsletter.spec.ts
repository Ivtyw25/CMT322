import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { footerCopy } from '@/content/footer';
import { getCurrentUser } from '@/data/api/user';
import { prepare, settle } from '../../support/browser';

const copy = footerCopy.newsletter;
const user = await getCurrentUser();

test.describe('footer newsletter', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await prepare(page);
    await page.goto(routes.project.overview);
    await settle(page);
  });

  const form = (page: Page) => page.getByRole('contentinfo');

  test('an empty address shows the required message and focuses the field', async ({ page }) => {
    await form(page).getByRole('button', { name: copy.submit }).click();
    const input = form(page).getByLabel(copy.emailLabel);
    await expect(form(page).getByText(copy.errors.emailRequired)).toBeVisible();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeFocused();
  });

  test('a bad format shows the format message, which clears as soon as it is valid', async ({
    page,
  }) => {
    const input = form(page).getByLabel(copy.emailLabel);
    await input.fill('meiling');
    await input.press('Enter');
    await expect(form(page).getByText(copy.errors.emailInvalid)).toBeVisible();
    await input.fill('meiling@example.com');
    await expect(form(page).getByText(copy.errors.emailInvalid)).toBeHidden();
  });

  test('a valid address shows sending, then a success message for the chosen area', async ({
    page,
  }) => {
    const input = form(page).getByLabel(copy.emailLabel);
    await input.fill('visitor@example.com');
    await form(page).getByLabel(copy.areaLabel).selectOption({ label: copy.allAreasOption });
    await form(page).getByRole('button', { name: copy.submit }).click();
    await expect(form(page).getByRole('button', { name: copy.submitting })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(input).toBeDisabled();
    const status = form(page).getByRole('status');
    await expect(status).toHaveText(copy.success('visitor@example.com', copy.allAreasInSentence));
    await expect(status).toBeFocused();
  });

  test('a failing address shows the error and keeps the values', async ({ page }) => {
    const input = form(page).getByLabel(copy.emailLabel);
    await input.fill('visitor@fail.test');
    await form(page).getByRole('button', { name: copy.submit }).click();
    await expect(form(page).getByText(copy.errors.sendFailed)).toBeVisible();
    await expect(input).toHaveValue('visitor@fail.test');
    await expect(form(page).getByRole('button', { name: copy.submit })).toBeFocused();
  });

  test('a signed-in visitor starts with their own address, which they can change', async ({
    page,
  }) => {
    await prepare(page, { signedIn: true });
    await page.goto(routes.project.overview);
    await settle(page);
    const input = form(page).getByLabel(copy.emailLabel);
    await expect(input).toHaveValue(user.email);
    await input.fill('another@example.com');
    await expect(input).toHaveValue('another@example.com');
  });
});

test.describe('footer on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('has no area select and no back-to-top button', async ({ page }) => {
    await prepare(page);
    await page.goto(routes.project.overview);
    await settle(page);
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByLabel(copy.areaLabel)).toBeHidden();
    await expect(footer.getByRole('button', { name: footerCopy.backToTop })).toBeHidden();
  });
});

test.describe('footer social names', () => {
  test('are plain text: not links, not buttons, not focusable', async ({ page }) => {
    await prepare(page);
    await page.goto(routes.project.overview);
    await settle(page);
    const socials = page
      .getByRole('contentinfo')
      .getByRole('list', { name: footerCopy.social.title });
    await expect(socials.getByRole('listitem')).toHaveCount(6);
    await expect(socials.getByRole('link')).toHaveCount(0);
    await expect(socials.getByRole('button')).toHaveCount(0);
  });
});
