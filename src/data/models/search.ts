import type { StationCode } from './station';

export type SearchEntryKind = 'station' | 'road' | 'area';

export type SearchEntry = {
  id: string;
  kind: SearchEntryKind;
  label: string;
  /** Secondary line, e.g. the area a road is in. */
  detail: string | null;
  stationCode: StationCode | null;
};
