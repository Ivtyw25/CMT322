import type { AreaId } from './area';
import type { StationCode } from './station';

/**
 * A worksite or hazard on the road that is not a formal traffic announcement. Shown on the traffic
 * map, in Home "Works in your area" and on station pages. Announcements are separate records.
 */
export type RoadWorkKind = 'construction' | 'hazard';
export type RoadWorkStatus = 'active' | 'upcoming';

export type RoadWork = {
  id: string;
  kind: RoadWorkKind;
  /** Status as at the design's "today" (29 Oct 2026). */
  status: RoadWorkStatus;
  title: string;
  /** One sentence: what changes and what to do. */
  summary: string;
  /** A few words for small cards, followed by "until {end}". */
  brief: string;
  location: string;
  road: string;
  /** Approximate position of the works, for map markers. VERIFY with the project team. */
  lat: number;
  lng: number;
  areaIds: AreaId[];
  stationCodes: StationCode[];
  /** ISO 8601 date, "YYYY-MM-DD". */
  startDate: string;
  /** "YYYY-MM-DD", or "YYYY-MM" when only the month is known. */
  endDate: string;
  /** Daily working window in 24-hour "HH:MM". Null means all day. */
  dailyHours: { from: string; to: string } | null;
  duration: string;
};
