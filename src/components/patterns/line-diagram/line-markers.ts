import type { Station, StationCode } from '@/data/models/station';

/** What a station can show on the diagram and the rail: a road change of this layer nearby. */
export type LineMarkerKind = 'closure' | 'construction' | 'hazard';

/** Glyphs per station, in the order they are drawn. A station may be missing or have an empty list. */
export type MarkersByStation = Partial<Record<StationCode, readonly LineMarkerKind[]>>;

/** `link` makes each station a link (Home). `select` makes it a toggle button (Route view). */
export type LineMode = 'link' | 'select';

export type StationState = {
  selected: boolean;
  markers: readonly LineMarkerKind[];
};

/** Accessible name of a station in `select` mode. Without it the name is "S20 KOMTAR" plus notes. */
export type DescribeStation = (station: Station, state: StationState) => string;

/** At most two glyph types per station, so a busy station stays readable. */
export const MAX_GLYPHS = 2;

export function visibleMarkers(markers: readonly LineMarkerKind[] | undefined): LineMarkerKind[] {
  return [...new Set(markers ?? [])].slice(0, MAX_GLYPHS);
}
