import { expect, type Page } from '@playwright/test';
import { homeCopy } from '@/content/home';
import { navCopy, navGroups } from '@/content/nav';
import { reportTrackCopy } from '@/content/report-track';

export type VisualState = { name: string; run: (page: Page) => Promise<void> };

/** Widths from this one up show the desktop header (below it the mobile header and drawer). */
const DESKTOP_MIN_WIDTH = 1024;

const { report } = reportTrackCopy;
const MEGABYTE = 1024 * 1024;

/** Fills the report form the way the Figma frame shows it (two uploaded photos, email focused). */
async function fillReportForm(page: Page): Promise<void> {
  const form = page.getByRole('form', { name: report.header.title });
  await page
    .getByLabel(report.category.label)
    .selectOption({ label: 'Blocked access to home or business' });
  await form.getByLabel(report.details.subject.label).fill('Driveway blocked by site hoarding');
  await page
    .getByLabel(report.details.description.label)
    .fill(
      'Since Monday the new hoarding on Lebuh Kampung Jawa covers half of our shop driveway. Delivery lorries cannot turn in and customers park on the road instead.',
    );
  await form.getByLabel(report.location.address.label).fill('Lebuh Kampung Jawa, Bayan Lepas');
  // The tiles are blocked in tests, so the keyboard button places the pin.
  await form.getByRole('button', { name: report.location.map.dropPin }).focus();
  await page.keyboard.press('Enter');
  await form.getByLabel(report.contact.phone.label).fill('012-345 6789');
  await form.locator('input[type="file"]').setInputFiles([
    {
      name: 'driveway-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(Math.round(2.1 * MEGABYTE)),
    },
    {
      name: 'hoarding-close-up.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(Math.round(1.6 * MEGABYTE)),
    },
  ]);
  await expect(page.getByText('1.6 MB, uploaded')).toBeVisible();
  await form.getByRole('checkbox').check();
  await form.getByLabel(report.contact.email.label).focus();
}

/**
 * Prototype states compared with their own Figma frames (pages.json "states").
 * Reference files: <name>--<width>--<theme>.png. The home team fills in the steps.
 */
export const visualStates: Record<string, VisualState[]> = {
  /** Figma shows a filled example; the form itself starts empty. A state named like its page replaces the plain shot. */
  report: [{ name: 'report', run: fillReportForm }],
  home: [
    {
      name: 'home-menu-open',
      run: async (page) => {
        const desktop = (page.viewportSize()?.width ?? 0) >= DESKTOP_MIN_WIDTH;
        if (desktop) {
          const trigger = page
            .locator('[data-header="desktop"]')
            .getByRole('button', { name: navGroups.project.label });
          await trigger.click();
          await expect(trigger).toHaveAttribute('aria-expanded', 'true');
          return;
        }
        const mobile = page.locator('[data-header="mobile"]');
        await mobile.getByRole('button', { name: navCopy.mobile.openMenu }).click();
        // The button's name changes once the menu is open.
        await expect(
          mobile.getByRole('button', { name: navCopy.mobile.closeMenu }),
        ).toHaveAttribute('aria-expanded', 'true');
      },
    },
    {
      name: 'home-search-suggestions',
      run: async (page) => {
        const search = page.getByRole('combobox', { name: homeCopy.search.hint });
        await search.fill('buk');
        await page.locator('#home-search-panel').waitFor();
      },
    },
  ],
};
