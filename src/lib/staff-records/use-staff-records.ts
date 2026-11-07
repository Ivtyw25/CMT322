'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { applyRecordEdits, type RecordStore } from './record-store';

/** The records of one type as staff last left them, updating when they change. */
export function useStaffRecords<T extends { id: string }>(
  store: RecordStore<T>,
  base: readonly T[],
): T[] {
  const edits = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return useMemo(() => applyRecordEdits(base, edits), [base, edits]);
}
