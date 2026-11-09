'use client';

import { useMemo } from 'react';
import type { StaffProgressUpdate } from '@/data/models/staff-content';
import type { Station } from '@/data/models/station';
import { progressStore } from '@/lib/staff-records/progress-store';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { liveProgress, liveUpdatesFor, stagesAt } from '@/lib/station-progress/live-progress';

export type LiveStationInput = {
  station: Pick<Station, 'code' | 'progress' | 'stages'>;
  /** The station's progress updates from the data layer; staff edits in this browser go on top. */
  updates: readonly StaffProgressUpdate[];
  /** Today as "YYYY-MM-DD", for scheduled updates. */
  today: string;
};

/** A station's live progress updates (newest first), its progress and its six stages. */
export function useLiveStation({ station, updates, today }: LiveStationInput) {
  const records = useStaffRecords(progressStore, updates);
  return useMemo(() => {
    const live = liveUpdatesFor(station.code, records, today);
    const progress = liveProgress(station.progress, live);
    const stages =
      progress && progress !== station.progress
        ? stagesAt(station.stages, progress.currentStageId, progress.updatedAt)
        : station.stages;
    return { updates: live, progress, stages };
  }, [station, records, today]);
}
