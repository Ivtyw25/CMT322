import { staffAnnouncements, staffMapItems, staffProgressUpdates } from '@/data/mock/staff-content';
import type {
  StaffAnnouncement,
  StaffMapItem,
  StaffProgressUpdate,
} from '@/data/models/staff-content';

export async function getStaffAnnouncements(): Promise<StaffAnnouncement[]> {
  return staffAnnouncements;
}

export async function getStaffMapItems(): Promise<StaffMapItem[]> {
  return staffMapItems;
}

export async function getStaffProgressUpdates(): Promise<StaffProgressUpdate[]> {
  return staffProgressUpdates;
}
