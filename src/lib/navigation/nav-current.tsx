'use client';

import { createContext, use, useSyncExternalStore } from 'react';

const NavCurrentContext = createContext(true);

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * The 404 page is prerendered once for every missing path, so the server cannot know which nav
 * group the visitor typed. Wrapped around the shell there, it shows no current group while
 * hydrating (matching the server HTML) and the real one right after.
 */
export function NavCurrentAfterHydration({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);
  return <NavCurrentContext value={hydrated}>{children}</NavCurrentContext>;
}

/** What the server's `usePathname()` returns while prerendering the 404 page. */
export const NOT_FOUND_PATHNAME = '/_not-found';

/** False only while the 404 page hydrates; true everywhere else. */
export function useNavCurrent(): boolean {
  return use(NavCurrentContext);
}
