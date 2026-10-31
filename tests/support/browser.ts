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

/**
 * Waits until the page, fonts and images have settled. Not `networkidle`: in production the Next
 * router leaves the bodies of 404 prefetches unread, so Chrome keeps those requests open forever.
 */
export async function settle(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((done) => {
              const timer = setTimeout(done, 2000);
              const finish = () => {
                clearTimeout(timer);
                done(undefined);
              };
              image.addEventListener('load', finish, { once: true });
              image.addEventListener('error', finish, { once: true });
            }),
        ),
    );
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

/**
 * Waits until React has attached to the first element matching `selector`, so clicks and key
 * presses are not lost to a page that is still hydrating (slow on the dev server).
 */
export async function whenHydrated(page: Page, selector: string) {
  await page.waitForFunction((css) => {
    const element = document.querySelector(css);
    return element !== null && Object.keys(element).some((key) => key.startsWith('__reactProps'));
  }, selector);
}
