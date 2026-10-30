import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';

/** Station code of the place where the two routes meet. */
export const JUNCTION_CODE = 'S19';

/** Accessible name of a station link or marker: "S20 KOMTAR", plus provisional and junction notes. */
export function stationLinkLabel(
  station: Pick<Station, 'code' | 'name' | 'isProvisionalName'>,
): string {
  const copy = homeCopy.line;
  return [
    copy.stationLabel(station.code, station.name),
    station.isProvisionalName ? copy.provisionalSuffix : '',
    station.code === JUNCTION_CODE ? copy.junctionSuffix : '',
  ].join('');
}

/** The line under a station name in the rail: its landmark, or "Provisional name". */
export function stationDescription(
  station: Pick<Station, 'subtitle' | 'isProvisionalName'>,
): string | undefined {
  return (
    station.subtitle ?? (station.isProvisionalName ? uiCopy.station.provisionalName : undefined)
  );
}

export function stationHref(code: string): string {
  return routes.project.station(code);
}
