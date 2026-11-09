import { staffAnnouncements } from '@/data/mock/staff-content';
import type { StaffAnnouncement } from '@/data/models/staff-content';

export async function getStaffAnnouncements(): Promise<StaffAnnouncement[]> {
  return staffAnnouncements;
}
