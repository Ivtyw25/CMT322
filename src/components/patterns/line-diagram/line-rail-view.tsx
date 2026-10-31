import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import type { Station, StationCode } from '@/data/models/station';
import { LineMarkerGlyph } from './line-marker-glyph';
import { visibleMarkers, type LineMode, type MarkersByStation } from './line-markers';
import { stationDescription, stationHref } from './line-station';

type LineRailViewProps = {
  stations: readonly Station[];
  /** `link` (default): each stop links to its page. `select`: each is a toggle button. */
  mode?: LineMode;
  selectedCode?: StationCode | null;
  onSelect?: (code: StationCode) => void;
  /** Glyphs before the chevron (`select` mode only). */
  markersByStation?: MarkersByStation;
  /** Visually hidden note for a stop with glyphs, e.g. "2 road changes nearby". */
  markerNote?: (count: number) => string;
  /** Accessible name of the list. */
  label?: string;
};

/** All stations as the vertical line rail: the phone view, and Route view up to 1279 px. */
export function LineRailView({
  stations,
  mode = 'link',
  selectedCode,
  onSelect,
  markersByStation,
  markerNote,
  label,
}: LineRailViewProps) {
  const select = mode === 'select';
  return (
    <LineRail variant="page" label={label}>
      {stations.map((station) => {
        const markers = select ? (markersByStation?.[station.code] ?? []) : [];
        const glyphs = visibleMarkers(markers);
        return (
          <LineRailStop
            key={station.code}
            variant="page"
            code={station.code}
            title={station.name}
            description={stationDescription(station)}
            href={select ? undefined : stationHref(station.code)}
            selected={select && selectedCode === station.code}
            onSelect={select ? () => onSelect?.(station.code) : undefined}
            glyphs={
              glyphs.length > 0
                ? glyphs.map((kind) => <LineMarkerGlyph key={kind} kind={kind} />)
                : undefined
            }
            srNote={markers.length > 0 ? markerNote?.(markers.length) : undefined}
          />
        );
      })}
    </LineRail>
  );
}
