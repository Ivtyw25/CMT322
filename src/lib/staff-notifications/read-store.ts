import { readJson, writeJson } from '@/lib/storage';

/** localStorage key of the notifications each staff member has read: `{ [staffId]: string[] }`. */
export const NOTIFICATIONS_READ_STORAGE_KEY = 'mlc-staff-notifications-read';

export type ReadIds = Readonly<Record<string, readonly string[]>>;

const NONE: ReadIds = {};
let current: ReadIds | null = null;
const listeners = new Set<() => void>();

function parse(value: unknown): ReadIds {
  if (typeof value !== 'object' || value === null) return NONE;
  const entries = Object.entries(value).flatMap(([staffId, ids]): [string, string[]][] =>
    Array.isArray(ids) ? [[staffId, ids.filter((id): id is string => typeof id === 'string')]] : [],
  );
  return Object.fromEntries(entries);
}

function load(): ReadIds {
  if (current === null) current = parse(readJson(NOTIFICATIONS_READ_STORAGE_KEY));
  return current;
}

export const readNotificationStore = {
  getSnapshot: load,
  getServerSnapshot: (): ReadIds => NONE,
  subscribe(onChange: () => void): () => void {
    listeners.add(onChange);
    const onStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_READ_STORAGE_KEY || event.key === null) {
        current = null;
        onChange();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener('storage', onStorage);
    };
  },
  /** Marks notifications as read for a staff member. It also lasts for the page view when storage is blocked. */
  markRead(staffId: string, ids: readonly string[]): void {
    const read = load();
    const next: ReadIds = {
      ...read,
      [staffId]: [...new Set([...(read[staffId] ?? []), ...ids])],
    };
    current = next;
    writeJson(NOTIFICATIONS_READ_STORAGE_KEY, next);
    listeners.forEach((notify) => notify());
  },
};
