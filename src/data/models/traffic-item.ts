import type { AreaId } from './area';
import type { StationCode } from './station';

/** The three kinds of road change on the traffic map and the route view. */
export type TrafficLayer = 'closure' | 'construction' | 'hazard';

/**
 * One road change as the traffic map and route view list it, whichever record it came from.
 * Ended announcements never become items (they live under Past announcements).
 */
export type TrafficItem = {
  id: string;
  source: 'announcement' | 'road-work' | 'hazard';
  layer: TrafficLayer;
  status: 'active' | 'upcoming';
  title: string;
  /** A few words for small cards and popups. */
  brief: string;
  summary: string;
  location: string;
  road: string;
  lat: number;
  lng: number;
  stationCodes: StationCode[];
  areaIds: AreaId[];
  /** "YYYY-MM-DD". For a hazard: the day it was reported. */
  startDate: string;
  /** "YYYY-MM-DD" or "YYYY-MM". Null for a hazard, which has no end date. */
  endDate: string | null;
  dailyHours: { from: string; to: string } | null;
  /** The announcement behind the item, for the "View notice" link. */
  announcementId?: string;
};
