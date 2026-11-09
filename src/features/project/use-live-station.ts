'use client';

import { useMemo } from 'react';
import type { ProgressUpdate } from '@/data/models/progress-update';
import type { StationCode, StationStage } from '@/data/models/station';
import { progressStore } from '@/lib/staff-records/progress-store';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { stationProgressFrom } from '@/lib/station-progress/live-progress';

export type LiveStationInput = {
  code: StationCode;
  /** The station's stages before any progress update. */
  base: readonly StationStage[];
  /** The station's progress updates from the data layer; staff edits in this browser go on top. */
  updates: readonly ProgressUpdate[];
  /** Today as "YYYY-MM-DD", for scheduled updates. */
  today: string;
};

/**
 * A station's live progress updates (newest first), its progress and its six stages, worked out
 * the same way as the station records and the developer's Progress pages.
 */
export function useLiveStation({ code, base, updates, today }: LiveStationInput) {
  const records = useStaffRecords(progressStore, updates);
  return useMemo(
    () => stationProgressFrom(code, base, records, today),
    [code, base, records, today],
  );
}
