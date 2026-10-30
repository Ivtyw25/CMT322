import { announcements } from '@/data/mock/announcements';
import { MOCK_NOW } from '@/data/mock/clock';
import { siteNotices } from '@/data/mock/site-notices';
import type { AreaId } from '@/data/models/area';
import type { Announcement, AnnouncementStatus } from '@/data/models/announcement';
import type { SiteNotice } from '@/data/models/site-notice';
import type { StationCode } from '@/data/models/station';

export type AnnouncementFilter = {
  status?: AnnouncementStatus;
  areaId?: AreaId;
  stationCode?: StationCode;
};

const STATUS_ORDER: Record<AnnouncementStatus, number> = { active: 0, upcoming: 1, ended: 2 };

/**
 * Active first (newest start first), then upcoming (soonest first), then ended (latest end first).
 * Filters combine: every given field must match.
 */
export async function getAnnouncements(filter: AnnouncementFilter = {}): Promise<Announcement[]> {
  return announcements
    .filter((item) => !filter.status || item.status === filter.status)
    .filter((item) => !filter.areaId || item.areaIds.includes(filter.areaId))
    .filter((item) => !filter.stationCode || item.stationCodes.includes(filter.stationCode))
    .sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (byStatus !== 0) return byStatus;
      if (a.status === 'upcoming') return a.startDate.localeCompare(b.startDate);
      if (a.status === 'ended') return b.endDate.localeCompare(a.endDate);
      return b.startDate.localeCompare(a.startDate);
    });
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  return announcements.find((item) => item.id === id) ?? null;
}

/** The notice for the notification bar right now, or null when none is published. */
export async function getSiteNotice(): Promise<SiteNotice | null> {
  const now = Date.parse(MOCK_NOW);
  return (
    siteNotices.find(
      (notice) => Date.parse(notice.showFrom) <= now && now < Date.parse(notice.showUntil),
    ) ?? null
  );
}
