import { readStorage, removeStorage, writeStorage } from '@/lib/dom/safe-storage';

/** Reads a JSON value from localStorage. Blocked storage, a missing key or broken JSON give `null`. */
export function readJson(key: string): unknown {
  const raw = readStorage('local', key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** Writes a JSON value to localStorage. Returns nothing; a blocked write is a quiet no-op. */
export function writeJson(key: string, value: unknown): void {
  writeStorage('local', key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  removeStorage('local', key);
}
