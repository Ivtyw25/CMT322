import { getAnnouncements } from '@/data/api/announcements';
import { getRoadWorks } from '@/data/api/road-works';
import { hazards } from '@/data/mock/hazards';
import { MOCK_NOW, TRAFFIC_UPDATED_AT } from '@/data/mock/clock';
import type { Announcement } from '@/data/models/announcement';
import type { TrafficItem } from '@/data/models/traffic-item';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_DAYS = 7;

/**
 * Every active or upcoming road change as one list: announcements, road works and hazards,
 * earliest start first. Ended announcements are left out.
 */
export async function getTrafficItems(): Promise<TrafficItem[]> {
  const [announcements, roadWorks] = await Promise.all([getAnnouncements(), getRoadWorks()]);
  const items: TrafficItem[] = [
    ...announcements.flatMap((item) =>
      item.status === 'ended'
        ? []
        : [
            {
              id: item.id,
              source: 'announcement' as const,
              layer: item.type,
              status: item.status,
              title: item.title,
              brief: item.brief,
              summary: item.summary,
              location: item.location,
              road: item.road,
              lat: item.lat,
              lng: item.lng,
              stationCodes: item.stationCodes,
              areaIds: item.areaIds,
              startDate: item.startDate,
              endDate: item.endDate,
              dailyHours: item.dailyHours,
              announcementId: item.id,
            },
          ],
    ),
    ...roadWorks.map((item) => ({
      id: item.id,
      source: 'road-work' as const,
      layer: item.kind,
      status: item.status,
      title: item.title,
      brief: item.brief,
      summary: item.summary,
      location: item.location,
      road: item.road,
      lat: item.lat,
      lng: item.lng,
      stationCodes: item.stationCodes,
      areaIds: item.areaIds,
      startDate: item.startDate,
      endDate: item.endDate,
      dailyHours: item.dailyHours,
    })),
    ...hazards.map((item) => ({
      id: item.id,
      source: 'hazard' as const,
      layer: 'hazard' as const,
      status: item.status,
      title: item.title,
      brief: item.brief,
      summary: item.summary,
      location: item.location,
      road: item.road,
      lat: item.lat,
      lng: item.lng,
      stationCodes: item.stationCodes,
      areaIds: item.areaIds,
      startDate: item.reportedOn,
      endDate: null,
      dailyHours: null,
    })),
  ];
  return items.toSorted(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id),
  );
}

/**
 * Announcements to show under "Road changes this week" on the Traffic overview: active now, or
 * starting within seven days of the design date. Earliest start first, at most `limit`.
 */
export async function getRoadChangesThisWeek(limit: number): Promise<Announcement[]> {
  const horizon = Date.parse(MOCK_NOW) + WEEK_DAYS * DAY_MS;
  const announcements = await getAnnouncements();
  return announcements
    .filter(
      (item) =>
        item.status === 'active' ||
        (item.status === 'upcoming' && Date.parse(`${item.startDate}T00:00:00+08:00`) <= horizon),
    )
    .toSorted((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

/** When the traffic information was last updated today, as 24-hour "HH:MM" (shown "14:20"). */
export async function getTrafficUpdatedAt(): Promise<string> {
  return TRAFFIC_UPDATED_AT.slice(11, 16);
}
