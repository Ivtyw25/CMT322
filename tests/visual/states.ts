import { expect, type Page } from '@playwright/test';
import { homeCopy } from '@/content/home';
import { navCopy, navGroups } from '@/content/nav';

export type VisualState = { name: string; run: (page: Page) => Promise<void> };

/** Widths from this one up show the desktop header (below it the mobile header and drawer). */
const DESKTOP_MIN_WIDTH = 1024;

/**
 * Prototype states compared with their own Figma frames (pages.json "states").
 * Reference files: <name>--<width>--<theme>.png. The home team fills in the steps.
 */
export const visualStates: Record<string, VisualState[]> = {
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
