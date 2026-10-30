import type { Page } from '@playwright/test';
import { homeCopy } from '@/content/home';

export type VisualState = { name: string; run: (page: Page) => Promise<void> };

/**
 * Prototype states compared with their own Figma frames (pages.json "states").
 * Reference files: <name>--<width>--<theme>.png. The home team fills in the steps.
 */
export const visualStates: Record<string, VisualState[]> = {
  home: [
    {
      name: 'home-search-suggestions',
      run: async (page) => {
        const search = page.getByRole('combobox', { name: homeCopy.search.hint });
        await search.fill('buk');
        await page.getByRole('option').first().waitFor();
      },
    },
  ],
};
