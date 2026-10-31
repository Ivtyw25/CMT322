import { uiCopy } from '@/content/ui';
import type { Announcement, AnnouncementType } from '@/data/models/announcement';
import type { AreaId } from '@/data/models/area';
import type { RoadWork } from '@/data/models/road-work';
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

type WorksSource = Pick<
  Announcement | RoadWork,
  'id' | 'status' | 'title' | 'summary' | 'areaIds' | 'startDate' | 'endDate' | 'dailyHours'
> & { type?: AnnouncementType; kind?: RoadWork['kind'] };

/**
 * Active and upcoming announcements and road works as rows, earliest start first. Ended ones never
 * show. The area filter and the cap of three happen in the browser.
 */
export function toWorksItems(
  announcements: readonly Announcement[],
  roadWorks: readonly RoadWork[],
): WorksItem[] {
  const sources: readonly WorksSource[] = [...announcements, ...roadWorks];
  return sources
    .filter((item) => item.status !== 'ended')
    .toSorted((a, b) => a.startDate.localeCompare(b.startDate))
    .map((item) => ({
      id: item.id,
      tag: item.status === 'upcoming' ? 'upcoming' : (item.type ?? item.kind ?? 'construction'),
      title: item.title,
      summary: item.summary,
      areaIds: item.areaIds,
      dates: uiCopy.time.range(...formatDateRange(item.startDate, item.endDate)),
      hours: item.dailyHours
        ? uiCopy.time.range(...formatHourRange(item.dailyHours.from, item.dailyHours.to))
        : uiCopy.time.allDay,
    }));
}
