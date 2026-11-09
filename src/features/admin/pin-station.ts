import type { AreaId } from '@/data/models/area';
import type { StationCode } from '@/data/models/station';
import { nearestStation } from '@/lib/geo/nearest-station';
import type { GeoPoint } from '@/lib/geo/reverse-geocode';

/** A station as the pin pages need it, to find the one nearest the pin. */
export type PinStation = {
  code: StationCode;
  name: string;
  areaId: AreaId;
  /** Place name, e.g. "George Town". */
  area: string;
  lat: number;
  lng: number;
};

/** The station nearest a pin, or null before the pin is placed. */
export function stationNear(
  stations: readonly PinStation[],
  point: GeoPoint | null,
): PinStation | null {
  return point ? nearestStation(stations, point) : null;
}

/** Where a pin is, for the announcement: its station and that station's area. */
export function pinPlaceOf(station: PinStation | null): {
  stationCodes: StationCode[];
  areaIds: AreaId[];
} {
  return station
    ? { stationCodes: [station.code], areaIds: [station.areaId] }
    : { stationCodes: [], areaIds: [] };
}

/** The fields of a station record the pin pages need. */
export function pinStationOf(station: PinStation): PinStation {
  const { code, name, areaId, area, lat, lng } = station;
  return { code, name, areaId, area, lat, lng };
}
