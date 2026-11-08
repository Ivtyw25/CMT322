import { staffAnnouncements, staffProgressUpdates } from '@/data/mock/staff-content';
import type { StaffAnnouncement, StaffProgressUpdate } from '@/data/models/staff-content';

export async function getStaffAnnouncements(): Promise<StaffAnnouncement[]> {
  return staffAnnouncements;
}

export async function getStaffProgressUpdates(): Promise<StaffProgressUpdate[]> {
  return staffProgressUpdates;
}
