import { readJson, writeJson } from '@/lib/storage';

/** What staff changed on a list of records in this browser: new or changed records, and deletes. */
export type RecordEdits<T> = {
  readonly upserts: Readonly<Record<string, T>>;
  readonly removed: readonly string[];
};

export type RecordStore<T extends { id: string }> = {
  getSnapshot: () => RecordEdits<T>;
  /** For the server and hydration: no edits. */
  getServerSnapshot: () => RecordEdits<T>;
  subscribe: (onChange: () => void) => () => void;
  /** Adds the record, or replaces the one with the same ID. A deleted ID comes back. */
  upsert: (record: T) => void;
  /** Deletes the record, whether it is a mock record or one staff created. */
  remove: (id: string) => void;
};

const NO_EDITS: RecordEdits<never> = { upserts: {}, removed: [] };

function isEdits<T>(value: unknown): value is RecordEdits<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'upserts' in value &&
    typeof value.upserts === 'object' &&
    value.upserts !== null &&
    'removed' in value &&
    Array.isArray(value.removed)
  );
}

/**
 * One localStorage key per record type (`mlc-staff-announcements`, …). There is no backend, so a
 * save, a publish or a delete is kept here and laid over the mock records. The store keeps the
 * edits in memory too, so a change lasts for the page view when storage is blocked.
 */
export function createRecordStore<T extends { id: string }>(key: string): RecordStore<T> {
  const none = NO_EDITS as RecordEdits<T>;
  let current: RecordEdits<T> | null = null;
  const listeners = new Set<() => void>();

  function load(): RecordEdits<T> {
    if (current === null) {
      const stored = readJson(key);
      current = isEdits<T>(stored) ? stored : none;
    }
    return current;
  }

  function save(next: RecordEdits<T>) {
    current = next;
    writeJson(key, next);
    listeners.forEach((notify) => notify());
  }

  return {
    getSnapshot: load,
    getServerSnapshot: () => none,
    subscribe(onChange) {
      listeners.add(onChange);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
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
    upsert(record) {
      const edits = load();
      save({
        upserts: { ...edits.upserts, [record.id]: record },
        removed: edits.removed.filter((id) => id !== record.id),
      });
    },
    remove(id) {
      const edits = load();
      const rest = Object.fromEntries(Object.entries(edits.upserts).filter(([key]) => key !== id));
      save({ upserts: rest, removed: [...new Set([...edits.removed, id])] });
    },
  };
}

/** The mock records with the edits laid over them. Records staff created come first. */
export function applyRecordEdits<T extends { id: string }>(
  base: readonly T[],
  edits: RecordEdits<T>,
): T[] {
  const baseIds = new Set(base.map((record) => record.id));
  const removed = new Set(edits.removed);
  const created = Object.values(edits.upserts).filter(
    (record) => !baseIds.has(record.id) && !removed.has(record.id),
  );
  const kept = base
    .filter((record) => !removed.has(record.id))
    .map((record) => edits.upserts[record.id] ?? record);
  return [...created.toReversed(), ...kept];
}
