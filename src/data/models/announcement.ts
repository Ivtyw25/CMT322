import type { AreaId } from './area';
import type { StationCode } from './station';

export type AnnouncementType = 'closure' | 'construction' | 'hazard';
export type AnnouncementStatus = 'active' | 'upcoming' | 'ended';

export type Announcement = {
  id: string;
  type: AnnouncementType;
  /** Status as at the design's "today" (29 Oct 2026). */
  status: AnnouncementStatus;
  title: string;
  /** One or two sentences: what changes and what to do. */
  summary: string;
  /** A few words for small cards, followed by "until {end}", e.g. "One lane each way". */
  brief: string;
  /** Location column text, e.g. "Jalan Penang, George Town". */
  location: string;
  /** Main road affected, in local spelling (shown with the pin icon). */
  road: string;
  areaIds: AreaId[];
  stationCodes: StationCode[];
  /** ISO 8601 date, "YYYY-MM-DD". */
  startDate: string;
  /** "YYYY-MM-DD", or "YYYY-MM" when only the month is known (shown as "Jul 2027"). */
  endDate: string;
  /** Daily working window in 24-hour "HH:MM". Null means all day. */
  dailyHours: { from: string; to: string } | null;
  /** Duration as the notice states it, e.g. "About 9 months", "2 weeks, nights". */
  duration: string;
  /** Detour advice, one step per item. Empty when there is no detour. */
  detour: string[];
  /** ISO 8601 date the notice was published. */
  publishedAt: string;
};
