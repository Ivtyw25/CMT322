import type { ProgressUpdate } from '@/data/models/progress-update';
import type { StationCode, StationStage } from '@/data/models/station';
import { createRecordStore } from '@/lib/staff-records/record-store';

/** The developer's progress updates in this browser, on top of the mock progress updates. */
export const progressStore = createRecordStore<ProgressUpdate>('mlc-progress-updates-v2');

/** A station as the progress pages need it. */
export type ProgressStation = {
  code: StationCode;
  name: string;
  /** The station's stages before any progress update. */
  base: StationStage[];
};
