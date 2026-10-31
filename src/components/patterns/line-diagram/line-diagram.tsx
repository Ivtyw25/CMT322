import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { lineDiagramCopy } from '@/content/line';
import type { Station, StationCode } from '@/data/models/station';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/cn';
import { LineDiagramArt } from './line-diagram-art';
import { LineMarkerGlyph } from './line-marker-glyph';
import {
  visibleMarkers,
  type DescribeStation,
  type LineMarkerKind,
  type LineMode,
  type MarkersByStation,
} from './line-markers';
import {
  calloutLayouts,
  DIAGRAM_HEIGHT,
  DIAGRAM_WIDTH,
  depotLayouts,
  stationLayouts,
  type StationLayout,
} from './line-diagram-layout';
import { stationHref, stationLinkLabel, stationNotes } from './line-station';

/** Extra room around circle and label, so the focus ring does not touch them. */
const ARM = 6;

function boxOf(layout: StationLayout) {
  const { x, y, radius, label } = layout;
  const left = Math.min(x - radius, label.x) - ARM;
  const top = Math.min(y - radius, label.y) - ARM;
  const right = Math.max(x + radius, label.x + label.width) + ARM;
  const bottom = Math.max(y + radius, label.y + label.height) + ARM;
  return { left, top, width: right - left, height: bottom - top };
}

type SelectProps = {
  mode: LineMode;
  selectedCode?: StationCode | null;
  onSelect?: (code: StationCode) => void;
  markers?: readonly LineMarkerKind[];
  describe?: DescribeStation;
};

/** Glyphs sit on the side of the circle away from the label, so they never cover its text. */
function glyphTop(layout: StationLayout, boxTop: number): number {
  const { y, radius, label } = layout;
  const labelAbove = label.y + label.height <= y;
  return labelAbove ? y + radius + 2 - boxTop : y - radius - 18 - boxTop;
}

function StationStop({
  station,
  layout,
  mode,
  selectedCode,
  onSelect,
  markers,
  describe,
}: SelectProps & { station: Station; layout: StationLayout }) {
  const { x, y, radius, border, label, junction, branch } = layout;
  const box = boxOf(layout);
  const select = mode === 'select';
  const selected = select && selectedCode === station.code;
  const glyphs = select ? visibleMarkers(markers) : [];
  const halo = Math.max(44, radius * 2 + 8);
  const rootClass = 'group absolute block rounded-xl';
  const rootStyle = { left: box.left, top: box.top, width: box.width, height: box.height };
  const body = (
    <>
      {selected ? (
        <span
          aria-hidden
          className="absolute rounded-full bg-primary-100"
          style={{
            left: x - halo / 2 - box.left,
            top: y - halo / 2 - box.top,
            width: halo,
            height: halo,
          }}
        />
      ) : null}
      <span
        className={cn(
          'absolute flex items-center justify-center rounded-full bg-surface transition-colors duration-(--duration-fast) group-hover:bg-primary-50',
          junction ? 'border-primary-800' : branch ? 'border-primary-300' : 'border-primary-600',
        )}
        style={{
          left: x - radius - box.left,
          top: y - radius - box.top,
          width: radius * 2,
          height: radius * 2,
          borderWidth: border,
          borderStyle: 'solid',
        }}
      >
        <span
          className={
            junction
              ? 'type-body-s-semibold text-primary-800'
              : cn(
                  'type-body-xs-semibold',
                  branch ? 'text-primary-600 dark:text-primary-500' : 'text-primary-700',
                )
          }
        >
          {station.code}
        </span>
      </span>{' '}
      <span
        className={cn(
          'absolute flex flex-col',
          label.anchor === 'end' ? 'justify-end' : 'justify-start',
          label.align === 'center' ? 'items-center text-center' : 'items-start text-left',
        )}
        style={{
          left: label.x - box.left,
          top: label.y - box.top,
          width: label.width,
          height: label.height,
        }}
      >
        <span
          className={cn(
            'transition-colors duration-(--duration-fast) group-hover:underline',
            junction
              ? 'type-heading-2xs text-primary-800'
              : selected
                ? 'type-body-xs-semibold text-primary-700'
                : 'type-body-xs text-gray-600 group-hover:text-primary-700',
          )}
        >
          {station.name}
        </span>
        {station.isProvisionalName ? (
          <span aria-hidden className="type-body-xs text-gray-500">
            {lineDiagramCopy.provisionalShort}
          </span>
        ) : null}
      </span>
      {glyphs.length > 0 ? (
        <span
          aria-hidden
          className="absolute flex -translate-x-1/2 gap-1"
          style={{ left: x - box.left, top: glyphTop(layout, box.top) }}
        >
          {glyphs.map((kind) => (
            <LineMarkerGlyph key={kind} kind={kind} />
          ))}
        </span>
      ) : null}
    </>
  );

  if (select) {
    const name =
      describe?.(station, { selected, markers: markers ?? [] }) ?? stationLinkLabel(station);
    return (
      <li>
        <button
          type="button"
          aria-pressed={selected}
          aria-label={name}
          onClick={() => onSelect?.(station.code)}
          className={cn(rootClass, 'cursor-pointer')}
          style={rootStyle}
        >
          {body}
        </button>
      </li>
    );
  }
  return (
    <li>
      <Link href={stationHref(station.code)} className={rootClass} style={rootStyle}>
        {body}
        {stationNotes(station) ? <VisuallyHidden>{stationNotes(station)}</VisuallyHidden> : null}
      </Link>
    </li>
  );
}

function LegendRow({ swatch, children }: { swatch: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden className="flex w-6.5 shrink-0 items-center justify-center">
        {swatch}
      </span>
      <span className="type-body-xs text-gray-700">{children}</span>
    </li>
  );
}

function DefaultLegend() {
  const copy = lineDiagramCopy;
  return (
    <ul
      className="absolute flex flex-col gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3.75 py-2.5 whitespace-nowrap"
      style={{ right: 11.13, top: 7.42 }}
    >
      <LegendRow swatch={<span className="h-1.25 w-6.5 rounded-full bg-primary-600" />}>
        {copy.legend.line}
      </LegendRow>
      <LegendRow swatch={<MapPin className="size-3.5 fill-gray-700 text-gray-700" />}>
        {copy.legend.nearby}
      </LegendRow>
      <LegendRow
        swatch={<span className="size-3.5 rounded-full border-2 border-primary-300 bg-surface" />}
      >
        {copy.legend.station}
      </LegendRow>
      <LegendRow
        swatch={<span className="size-3.5 rounded-full border-3 border-primary-800 bg-surface" />}
      >
        {copy.legend.junction}
      </LegendRow>
    </ul>
  );
}

type LineDiagramProps = {
  stations: readonly Station[];
  /** `link` (default): each station links to its page. `select`: each is a toggle button. */
  mode?: LineMode;
  selectedCode?: StationCode | null;
  onSelect?: (code: StationCode) => void;
  /** Glyphs next to stations (`select` mode only). */
  markersByStation?: MarkersByStation;
  /** Accessible name of a station button (`select` mode only). */
  describeStation?: DescribeStation;
  /** The key box. Left out: the Home key. `null`: no key (the page draws its own). */
  legend?: React.ReactNode;
};

/** The logical diagram of the line (1280 px and up): one link or button per station, in line order. */
export function LineDiagram({
  stations,
  mode = 'link',
  selectedCode,
  onSelect,
  markersByStation,
  describeStation,
  legend,
}: LineDiagramProps) {
  const copy = lineDiagramCopy;
  const callouts: Record<string, readonly string[]> = copy.callouts;
  return (
    <div className="relative" style={{ width: DIAGRAM_WIDTH, height: DIAGRAM_HEIGHT }}>
      <LineDiagramArt />
      {depotLayouts.map((depot) => (
        <span
          key={`${depot.x}-${depot.y}`}
          className="absolute type-body-xs-medium text-gray-900"
          style={{ left: depot.x, top: depot.y }}
        >
          {copy.depot}
        </span>
      ))}
      {Object.entries(calloutLayouts).flatMap(([code, spots]) =>
        spots.map((spot, index) => {
          const text = callouts[code]?.[index];
          return text ? (
            <span
              key={`${code}-${text}`}
              className={cn(
                'absolute type-body-xs text-gray-800',
                spot.align === 'right' ? 'text-right' : 'whitespace-nowrap',
              )}
              style={{ left: spot.x, top: spot.y, width: spot.width }}
            >
              {text}
            </span>
          ) : null;
        }),
      )}
      <ol>
        {stations.map((station) => {
          const layout = stationLayouts[station.code];
          return layout ? (
            <StationStop
              key={station.code}
              station={station}
              layout={layout}
              mode={mode}
              selectedCode={selectedCode}
              onSelect={onSelect}
              markers={markersByStation?.[station.code]}
              describe={describeStation}
            />
          ) : null;
        })}
      </ol>
      {legend === undefined ? <DefaultLegend /> : legend}
    </div>
  );
}
