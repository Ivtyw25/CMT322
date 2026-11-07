import type { StaffProgressUpdate } from '@/data/models/staff-content';
import { createRecordStore } from '@/lib/staff-records/record-store';

export const progressStore = createRecordStore<StaffProgressUpdate>('mlc-staff-progress-updates');

/** A station as the progress pages need it. */
export type ProgressStation = {
  code: string;
  name: string;
  /** Whole-station completion now, 0 to 100. */
  percent: number;
};
