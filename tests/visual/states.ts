import type { Page } from '@playwright/test';

export type VisualState = { name: string; run: (page: Page) => Promise<void> };

/**
 * Prototype states compared with their own Figma frames (pages.json "states").
 * Reference files: <name>--<width>--<theme>.png. The home team fills in the steps.
 */
export const visualStates: Record<string, VisualState[]> = {
  home: [],
};
