import type { StationCode } from './station';

/** The area groups behind the Home "Works in your area" chips, the area filters and email alerts. */
export type AreaId = 'bayan-lepas' | 'bukit-jambul' | 'gelugor' | 'george-town' | 'butterworth';

export type Area = {
  id: AreaId;
  /** Chip and select label, e.g. "Bukit Jambul to Sungai Nibong". */
  label: string;
  /** Stations in this area, in line order. */
  stationCodes: StationCode[];
};
