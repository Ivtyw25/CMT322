import type { AreaId } from './area';
import type { StationCode } from './station';

/**
 * A traffic hazard reported on the road (uneven surface, loose plate). Not an announcement and not
 * a worksite, so Home's "Works in your area" does not list it. It appears on the traffic map and
 * the route view.
 */
export type Hazard = {
  id: string;
  /** Status as at the design's "today" (29 Oct 2026). */
  status: 'active' | 'upcoming';
  title: string;
  /** One sentence: what to watch for. */
  summary: string;
  /** A few words for small cards. */
  brief: string;
  location: string;
  road: string;
  /** Approximate position, for map markers. VERIFY with the project team. */
  lat: number;
  lng: number;
  areaIds: AreaId[];
  stationCodes: StationCode[];
  /** ISO 8601 date the hazard was reported, "YYYY-MM-DD". */
  reportedOn: string;
};
