import { routes } from '@/config/routes';
import { lineDiagramCopy } from '@/content/line';
import { uiCopy } from '@/content/ui';
import { JUNCTION_CODE } from '@/data/api/line-alignment';
import type { Station } from '@/data/models/station';

/** The parts of a station the diagram and the rail use. A full `Station` fits. */
export type LineStation = Pick<
  Station,
  'code' | 'name' | 'subtitle' | 'isProvisionalName' | 'interchangeModes'
>;

/** Spoken after the name: the provisional, junction and interchange notes ("" when none applies). */
export function stationNotes(
  station: Pick<Station, 'code' | 'isProvisionalName' | 'interchangeModes'>,
): string {
  const copy = lineDiagramCopy;
  return [
    station.isProvisionalName ? copy.provisionalSuffix : '',
    station.code === JUNCTION_CODE ? copy.junctionSuffix : '',
    ...station.interchangeModes.map((mode) => copy.interchangeSuffix[mode]),
  ].join('');
}

/** Accessible name of a map marker: "S20 KOMTAR", plus provisional and junction notes. */
export function stationLinkLabel(
  station: Pick<Station, 'code' | 'name' | 'isProvisionalName' | 'interchangeModes'>,
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
