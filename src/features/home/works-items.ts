import { uiCopy } from '@/content/ui';
import type { Announcement, AnnouncementType } from '@/data/models/announcement';
import type { AreaId } from '@/data/models/area';
import { formatDateRange } from '@/lib/format/dates';
import { formatHourRange } from '@/lib/format/times';

/** One row of "Works in your area", ready to show: formatted on the server, filtered in the browser. */
export type WorksItem = {
  id: string;
  tag: AnnouncementType | 'upcoming';
  title: string;
  summary: string;
  areaIds: readonly AreaId[];
  dates: string;
  hours: string;
};

/** Active and upcoming announcements as rows, earliest start first. Ended ones never show. */
export function toWorksItems(announcements: readonly Announcement[]): WorksItem[] {
  return announcements
    .filter((item) => item.status !== 'ended')
    .toSorted((a, b) => a.startDate.localeCompare(b.startDate))
    .map((item) => ({
      id: item.id,
      tag: item.status === 'upcoming' ? 'upcoming' : item.type,
      title: item.title,
      summary: item.summary,
      areaIds: item.areaIds,
      dates: uiCopy.time.range(...formatDateRange(item.startDate, item.endDate)),
      hours: item.dailyHours
        ? uiCopy.time.range(...formatHourRange(item.dailyHours.from, item.dailyHours.to))
        : uiCopy.time.allDay,
    }));
}
