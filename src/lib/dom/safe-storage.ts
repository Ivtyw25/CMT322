export type StorageArea = 'local' | 'session';

function area(kind: StorageArea): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Storage can be blocked (private mode, site data off). Every access here fails quietly. */
export function readStorage(kind: StorageArea, key: string): string | null {
  try {
    return area(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(kind: StorageArea, key: string, value: string): void {
  try {
    area(kind)?.setItem(key, value);
  } catch {
    // The value then lasts for this page view only.
  }
}

export function removeStorage(kind: StorageArea, key: string): void {
  try {
    area(kind)?.removeItem(key);
  } catch {
    // Nothing to clean up when storage is blocked.
  }
}
