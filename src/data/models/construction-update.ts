import type { StationCode } from './station';

export type ConstructionUpdate = {
  id: string;
  /** ISO 8601 date. */
  date: string;
  title: string;
  summary: string;
  area: string;
  stationCodes: StationCode[];
  /** Works phase label as shown on the card, e.g. "Piling". */
  phase: string;
  /** Number of photos. Photos are grey placeholders until real ones are supplied. */
  photoCount: number;
};

export type Milestone = {
  id: string;
  /** ISO 8601 date, or a year-month such as "2027-01". */
  date: string;
  title: string;
  description: string;
};
