import type { AreaId } from './area';
import type { StationCode } from './station';

export type SearchEntryKind = 'station' | 'road' | 'area';

export type SearchEntry = {
  id: string;
  kind: SearchEntryKind;
  /** Matched against the query, e.g. "S09 Bukit Jambul" or "Jalan Bukit Jambul". */
  label: string;
  /** Secondary line, e.g. the area a road is in. */
  detail: string;
  /** The nearest station. */
  stationCode: StationCode;
  areaId: AreaId;
};
