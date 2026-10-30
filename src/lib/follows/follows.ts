import type { StationCode } from '@/data/models/station';
import { readStorage, writeStorage } from '@/lib/dom/safe-storage';

/** The followed stations live in localStorage so they survive reloads and sync across tabs. */
export const FOLLOWS_STORAGE_KEY = 'mlc-follows';

/**
 * Last value written in this page view. It keeps follows working when storage is blocked, and
 * wins over a stale saved value until another tab changes the key.
 */
let lastWritten: string | null = null;

/** The raw saved value, or null when nothing was saved. A primitive, so it suits useSyncExternalStore. */
export function readFollowsRaw(): string | null {
  return lastWritten ?? readStorage('local', FOLLOWS_STORAGE_KEY);
}

const STATION_CODE = /^[SA]\d+$/;

function isStationCode(value: unknown): value is StationCode {
  return typeof value === 'string' && STATION_CODE.test(value);
}

/** The saved codes, or null when nothing (usable) was saved: the account's own list applies. */
export function parseFollows(raw: string | null): StationCode[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(isStationCode);
  } catch {
    // A broken value counts as nothing saved.
  }
  return null;
}

const listeners = new Set<() => void>();

export function writeFollows(codes: readonly StationCode[]): void {
  const raw = JSON.stringify(codes);
  lastWritten = raw;
  writeStorage('local', FOLLOWS_STORAGE_KEY, raw);
  listeners.forEach((notify) => notify());
}

/** For useSyncExternalStore: this tab's changes plus the `storage` event from other tabs. */
export function subscribeToFollows(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== FOLLOWS_STORAGE_KEY && event.key !== null) return;
    lastWritten = null;
    onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}
