'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

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
  return useSyncExternalStore(subscribe, getBrowserPath, () => pathname);
}
