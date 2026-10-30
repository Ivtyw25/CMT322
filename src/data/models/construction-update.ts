import type { AreaId } from './area';
import type { StationCode } from './station';

/** The Construction progress filter chips. Labels live in src/content/ui.ts. */
export type ConstructionPhase = 'utility-relocation' | 'piling' | 'viaduct' | 'stations';

export type ConstructionUpdate = {
  id: string;
  /** ISO 8601 date. */
  date: string;
  title: string;
  /** One sentence for cards (Home "Latest construction progress"). */
  summary: string;
  /** Full text for the Construction progress timeline. */
  body: string;
  /** Place line under the date, e.g. "Jalan Sultan Azlan Shah". */
  location: string;
  areaId: AreaId;
  stationCodes: StationCode[];
  phase: ConstructionPhase;
  /** Number of photos. Photos are grey placeholders until real ones are supplied. */
  photoCount: number;
};

export type Milestone = {
  id: string;
  /** Year-month, e.g. "2027-01". */
  date: string;
  /** Year-month that ends a period such as "Feb to May 2026". Null for a single month. */
  endDate: string | null;
  /** Short label as on the timeline. */
  title: string;
  /** One or two sentences for the About page and screen readers. */
  description: string;
};
