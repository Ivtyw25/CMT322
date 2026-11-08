'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from '@/lib/dom/safe-storage';

/** localStorage key of the staff sidebar's collapsed state: "collapsed" or "open". */
export const SIDEBAR_STORAGE_KEY = 'mlc-staff-sidebar';

const COLLAPSED = 'collapsed';
const OPEN = 'open';

// Kept in memory too, so a choice lasts for this visit when storage is blocked.
let memoryValue: string | null = null;
const listeners = new Set<() => void>();

const read = (): string | null => readStorage('local', SIDEBAR_STORAGE_KEY) ?? memoryValue;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Whether the sidebar is collapsed, saved per browser and shared by every part of the shell. */
export function useSidebarLayout() {
  const collapsed = useSyncExternalStore(
    subscribe,
    () => read() === COLLAPSED,
    () => false,
  );

  const setCollapsed = useCallback((next: boolean) => {
    memoryValue = next ? COLLAPSED : OPEN;
    writeStorage('local', SIDEBAR_STORAGE_KEY, memoryValue);
    listeners.forEach((notify) => notify());
  }, []);

  return { collapsed, setCollapsed };
}
