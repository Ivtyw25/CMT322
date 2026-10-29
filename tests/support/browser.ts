import type { Page } from '@playwright/test';
import { THEME_STORAGE_KEY, type ResolvedTheme } from '@/lib/theme/theme';

/** Storage key of the simulated session. src/lib/session must use the same key. */
export const SESSION_STORAGE_KEY = 'mlc-session';
export const MOCK_SESSION = JSON.stringify({ userId: 'user-meiling' });

export type VisitOptions = { theme?: ResolvedTheme; signedIn?: boolean };

/** Sets theme and session before any page script runs. */
export async function prepare(
  page: Page,
  { theme = 'light', signedIn = false }: VisitOptions = {},
) {
  await page.addInitScript(
    ([themeKey, themeValue, sessionKey, session]) => {
      try {
        window.localStorage.setItem(themeKey, themeValue);
        if (session) window.localStorage.setItem(sessionKey, session);
        else window.localStorage.removeItem(sessionKey);
      } catch {
        // Storage blocked: the page falls back to defaults.
      }
    },
    [THEME_STORAGE_KEY, theme, SESSION_STORAGE_KEY, signedIn ? MOCK_SESSION : ''] as const,
  );
  // Be kind to the OpenStreetMap tile servers: tests never need real tiles.
  await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
}

/** Waits until fonts, images and client components have settled. */
export async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) => new Promise((done) => image.addEventListener('load', done, { once: true })),
        ),
    );
  });
}
