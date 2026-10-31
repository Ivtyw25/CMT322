'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { NOT_FOUND_PATHNAME, useNavCurrent } from './nav-current';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener('hashchange', onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('hashchange', onChange);
  };
}

const getBrowserPath = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

/**
 * Path + search + hash of the current page, for "log in and come back here" links.
 * The server and hydration use the pathname only, so the markup always matches.
 */
export function useCurrentPath(): string {
  const pathname = usePathname();
  // The 404 page is prerendered without the path; hydrate with what the server rendered.
  const serverPath = useNavCurrent() ? pathname : NOT_FOUND_PATHNAME;
  return useSyncExternalStore(subscribe, getBrowserPath, () => serverPath);
}
