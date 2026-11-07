import { adminCopy } from '@/content/admin';
import type { StaffAnnouncement, StaffAnnouncementStatus } from '@/data/models/staff-content';
import { createRecordStore } from '@/lib/staff-records/record-store';

export const announcementStore = createRecordStore<StaffAnnouncement>('mlc-staff-announcements');

const DAY_MS = 86_400_000;
export const NIGHT_HOURS = { from: '22:00', to: '06:00' } as const;

/** A "YYYY-MM" end date means the last day of that month; a full date stays as it is. */
export function fullEndDate(end: string): string {
  if (end.length !== 7) return end;
  const [year, month] = end.split('-').map(Number);
  const last = new Date(Date.UTC(year ?? 1970, month ?? 1, 0));
  return last.toISOString().slice(0, 10);
}

export function isNightly(item: Pick<StaffAnnouncement, 'dailyHours'>): boolean {
  return item.dailyHours?.from === NIGHT_HOURS.from && item.dailyHours.to === NIGHT_HOURS.to;
}

/** Where a published announcement stands on `today`. */
export function statusFromDates(
  start: string,
  end: string,
  today: string,
): Exclude<StaffAnnouncementStatus, 'draft'> {
  if (start > today) return 'upcoming';
  if (fullEndDate(end) < today) return 'ended';
  return 'active';
}

/** "5 nights", "6 weeks", "About 9 months": worked out from the two dates. */
export function durationLabel(start: string, end: string, nightly: boolean): string {
  const copy = adminCopy.announcementEditor.duration;
  if (!start || !end) return copy.none;
  const days = Math.round((Date.parse(fullEndDate(end)) - Date.parse(start)) / DAY_MS) + 1;
  if (!Number.isFinite(days) || days < 1) return copy.none;
  if (nightly) return copy.nights(days);
  if (days < 14) return copy.days(days);
  if (days < 70) return copy.weeks(Math.round(days / 7));
  return copy.months(Math.round(days / 30));
}
