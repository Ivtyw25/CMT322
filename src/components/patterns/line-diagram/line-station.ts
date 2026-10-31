import { routes } from '@/config/routes';
import { lineDiagramCopy } from '@/content/line';
import { uiCopy } from '@/content/ui';
import { JUNCTION_CODE } from '@/data/api/line-alignment';
import type { Station } from '@/data/models/station';

/** Spoken after the name: the provisional and junction notes ("" when neither applies). */
export function stationNotes(station: Pick<Station, 'code' | 'isProvisionalName'>): string {
  const copy = lineDiagramCopy;
  return [
    station.isProvisionalName ? copy.provisionalSuffix : '',
    station.code === JUNCTION_CODE ? copy.junctionSuffix : '',
  ].join('');
}

/** Accessible name of a map marker: "S20 KOMTAR", plus provisional and junction notes. */
export function stationLinkLabel(
  station: Pick<Station, 'code' | 'name' | 'isProvisionalName'>,
): string {
  return `${lineDiagramCopy.stationLabel(station.code, station.name)}${stationNotes(station)}`;
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
