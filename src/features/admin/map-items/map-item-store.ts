import type { StaffMapItem } from '@/data/models/staff-content';
import { createRecordStore } from '@/lib/staff-records/record-store';

export const mapItemStore = createRecordStore<StaffMapItem>('mlc-staff-map-items');
