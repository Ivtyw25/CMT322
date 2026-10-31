import { stationHref, stationLinkLabel } from '@/components/patterns/line-diagram/line-station';
import { buildLineAlignment, JUNCTION_CODE } from '@/data/api/line-alignment';
import type { Station } from '@/data/models/station';

/** What the map needs of a station, as plain data for the client. */
export type MapStation = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  href: string;
  /** "S20 KOMTAR" with its notes. */
  label: string;
};

/** Stations whose label is always visible, as in Figma 28:881. */
export const LABELLED_CODES: readonly string[] = ['S31', 'S20', 'S19', 'S13', 'S08', 'S03', 'A01'];

/** Larger markers: the two ends and the place where the routes meet. */
export const LARGE_CODES: readonly string[] = ['S31', JUNCTION_CODE, 'A01'];

export function toMapStations(stations: readonly Station[]): MapStation[] {
  return stations.map((station) => ({
    code: station.code,
    name: station.name,
    lat: station.lat,
    lng: station.lng,
    href: stationHref(station.code),
    label: stationLinkLabel(station),
  }));
}

/** Line paths as [lat, lng] pairs: Penang Sentral to PSR-A through Macallum, and the KOMTAR branch. */
export function toPaths(stations: readonly MapStation[]): [number, number][][] {
  const point = (station: MapStation): [number, number] => [station.lat, station.lng];
  const { main, branch } = buildLineAlignment(stations);
  const paths = [main.map(point)];
  if (branch.length > 0) paths.push(branch.map(point));
  return paths;
}
