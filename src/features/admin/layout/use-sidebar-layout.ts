'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from '@/lib/dom/safe-storage';

/** localStorage key of the staff sidebar's width and collapsed state. */
export const SIDEBAR_STORAGE_KEY = 'mlc-staff-sidebar';

/** Sidebar width in px: default, limits, and one arrow-key step on the divider. */
export const SIDEBAR_WIDTH = { initial: 248, min: 208, max: 360, step: 16 };

type SidebarLayout = { width: number; collapsed: boolean };

const DEFAULT_LAYOUT: SidebarLayout = { width: SIDEBAR_WIDTH.initial, collapsed: false };

// Kept in memory too, so a choice lasts for this visit when storage is blocked.
let memoryRaw: string | null = null;
const listeners = new Set<() => void>();

const readRaw = (): string | null => readStorage('local', SIDEBAR_STORAGE_KEY) ?? memoryRaw;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function parse(raw: string | null): SidebarLayout {
  if (!raw) return DEFAULT_LAYOUT;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === 'object' &&
      value !== null &&
      'width' in value &&
      'collapsed' in value &&
      typeof value.width === 'number' &&
      typeof value.collapsed === 'boolean'
    ) {
      return { width: clampSidebarWidth(value.width), collapsed: value.collapsed };
    }
  } catch {
    // A broken value means the default layout.
  }
  return DEFAULT_LAYOUT;
}

export function clampSidebarWidth(width: number): number {
  return Math.min(SIDEBAR_WIDTH.max, Math.max(SIDEBAR_WIDTH.min, Math.round(width)));
}

/** The sidebar's saved width and collapsed state, shared by every part of the shell. */
export function useSidebarLayout() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const layout = useMemo(() => parse(raw), [raw]);

  const save = useCallback((next: SidebarLayout) => {
    memoryRaw = JSON.stringify(next);
    writeStorage('local', SIDEBAR_STORAGE_KEY, memoryRaw);
    listeners.forEach((notify) => notify());
  }, []);

  const setWidth = useCallback(
    (width: number) => save({ ...parse(readRaw()), width: clampSidebarWidth(width) }),
    [save],
  );
  const setCollapsed = useCallback(
    (collapsed: boolean) => save({ ...parse(readRaw()), collapsed }),
    [save],
  );

  return { ...layout, setWidth, setCollapsed };
}
