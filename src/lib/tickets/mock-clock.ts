import { readStorage, writeStorage } from '@/lib/dom/safe-storage';

/** When this browser first started the mock clock, as real milliseconds. */
export const CLOCK_ORIGIN_STORAGE_KEY = 'mlc-clock-origin';

let memoryOrigin: number | null = null;

function clockOrigin(): number {
  const stored = Number(readStorage('local', CLOCK_ORIGIN_STORAGE_KEY));
  if (Number.isFinite(stored) && stored > 0) return stored;
  if (memoryOrigin === null) {
    memoryOrigin = Date.now();
    writeStorage('local', CLOCK_ORIGIN_STORAGE_KEY, String(memoryOrigin));
  }
  return memoryOrigin;
}

/**
 * "Now" for the mock site: the design's day (`anchor`) moved on by the real time since this
 * browser first used it. It keeps running across reloads, so a reply is always dated after the
 * report it answers, and the demo tickets still look fresh.
 */
export function mockNow(anchor: string): string {
  return new Date(Date.parse(anchor) + (Date.now() - clockOrigin())).toISOString();
}
