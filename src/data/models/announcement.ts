import type { StationCode } from './station';

export type AnnouncementType = 'closure' | 'construction' | 'hazard';
export type AnnouncementStatus = 'active' | 'upcoming' | 'ended';

export type Announcement = {
  id: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  title: string;
  summary: string;
  /** Roads affected, in local spelling. */
  roads: string[];
  area: string;
  stationCodes: StationCode[];
  /** ISO 8601 date-times in Malaysia time (+08:00). */
  startsAt: string;
  endsAt: string | null;
  /** Detour advice, one step per item. Empty when there is no detour. */
  detour: string[];
  publishedAt: string;
};
