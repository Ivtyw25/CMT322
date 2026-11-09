import type { StaffProgressUpdate } from '@/data/models/staff-content';
import type { StationProgress } from '@/data/models/station';
import { createRecordStore } from '@/lib/staff-records/record-store';

export const progressStore = createRecordStore<StaffProgressUpdate>('mlc-staff-progress-updates');

/** A station as the progress pages need it. */
export type ProgressStation = {
  code: string;
  name: string;
  /** Progress before any staff update, as in the station records. */
  progress: StationProgress | null;
};
