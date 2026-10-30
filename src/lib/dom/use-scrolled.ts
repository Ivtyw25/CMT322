'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** True once the page is scrolled `threshold` px or more. Server and hydration say false. */
export function useScrolled(threshold: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY >= threshold,
    () => false,
  );
}
