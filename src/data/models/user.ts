import type { StationCode } from './station';

export type User = {
  id: string;
  name: string;
  email: string;
  homeArea: string;
  followedStationCodes: StationCode[];
};
