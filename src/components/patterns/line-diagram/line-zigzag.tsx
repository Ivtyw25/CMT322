import Link from 'next/link';
import { lineDiagramCopy } from '@/content/line';
import { JUNCTION_CODE } from '@/data/api/line-alignment';
import { cn } from '@/lib/cn';
import { InterchangeIcons } from './interchange-icons';
import './line-flow.css';
import { flowStyle } from './line-flow-style';
import { LineMarkerGlyph } from './line-marker-glyph';
import {
  visibleMarkers,
  type DescribeStation,
  type LineMarkerKind,
  type LineMode,
  type MarkersByStation,
} from './line-markers';
import { stationHref, stationLinkLabel, type LineStation } from './line-station';
import {
  zigzagLayout,
  type ZigzagColumns,
  type ZigzagLayout,
  type ZigzagNode,
} from './line-zigzag-layout';

/**
 * Stops per row by the width the zigzag has (a container query, so it also fits beside the
 * Traffic sidebar). Each variant is drawn once and shown by CSS, so nothing shifts on load.
 */
const VARIANTS: readonly { columns: ZigzagColumns; show: string }[] = [
  { columns: 3, show: '@min-[27.5rem]:hidden' },
  { columns: 4, show: 'hidden @min-[27.5rem]:block @min-[37.5rem]:hidden' },
  { columns: 5, show: 'hidden @min-[37.5rem]:block @min-[53.75rem]:hidden' },
  { columns: 6, show: 'hidden @min-[53.75rem]:block' },
];

/** Label width as a share of the column spacing, so neighbouring labels never touch. */
const LABEL_SHARE = 0.96;

/** Distance from the top of a stop's control to the centre of its circle, in px. */
const CIRCLE_CENTRE = { stop: 20, junction: 24 };

function percent(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

type SelectProps = {
  mode: LineMode;
  selectedCode: string | null;
  onSelect?: (code: string) => void;
  markersByStation?: MarkersByStation;
  describeStation?: DescribeStation;
};

function StopFace<Station extends LineStation>({
  station,
  junction,
  selected,
  markers,
}: {
  station: Station;
  junction: boolean;
  selected: boolean;
  markers: readonly LineMarkerKind[];
}) {
  return (
    <>
      {junction ? (
        <span className="absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 type-body-s-semibold whitespace-nowrap text-gray-800 transition-colors duration-(--duration-fast) group-hover:text-primary-700">
          {station.name}
          <InterchangeIcons modes={station.interchangeModes} className="ml-1" />
        </span>
      ) : null}
      <span className="relative">
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full transition-colors duration-(--duration-fast)',
            junction ? 'size-11 border-3 border-primary-800' : 'size-9 border-2 border-primary-600',
            selected
              ? 'bg-primary-600 text-static-white ring-4 ring-primary-200'
              : 'bg-surface group-hover:bg-primary-50',
          )}
        >
          <span
            className={cn(
              junction ? 'type-body-s-semibold' : 'type-body-xs-semibold',
              selected ? 'text-static-white' : junction ? 'text-primary-800' : 'text-primary-700',
            )}
          >
            {station.code}
          </span>
        </span>
        {markers.length > 0 ? (
          <span className="absolute -top-1.5 left-[calc(100%-0.5rem)] flex gap-0.5">
            {markers.map((kind) => (
              <LineMarkerGlyph key={kind} kind={kind} />
            ))}
          </span>
        ) : null}
      </span>
      {junction ? null : (
        <span className="flex flex-col items-center text-center">
          <span
            className={cn(
              'type-body-xs-semibold wrap-anywhere transition-colors duration-(--duration-fast) group-hover:text-primary-700',
              selected ? 'text-primary-700' : 'text-gray-800',
            )}
          >
            {station.name}
            <InterchangeIcons modes={station.interchangeModes} className="ml-1" />
          </span>
          {station.isProvisionalName ? (
            <span aria-hidden className="type-body-xs text-gray-500">
              {lineDiagramCopy.provisionalShort}
            </span>
          ) : null}
        </span>
      )}
    </>
  );
}

const controlClass =
  'group relative flex w-full cursor-pointer flex-col items-center gap-1 rounded-xl px-0.5 pt-0.5 pb-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600';

function Stop<Station extends LineStation>({
  node,
  layout,
  select,
}: {
  node: ZigzagNode<Station>;
  layout: ZigzagLayout<Station>;
  select: SelectProps;
}) {
  const { station } = node;
  const junction = station.code === JUNCTION_CODE;
  const selected = select.mode === 'select' && select.selectedCode === station.code;
  const allMarkers =
    select.mode === 'select' ? (select.markersByStation?.[station.code] ?? []) : [];
  const face = (
    <StopFace
      station={station}
      junction={junction}
      selected={selected}
      markers={visibleMarkers(allMarkers)}
    />
  );
  return (
    <li
      className="absolute -translate-x-1/2"
      style={{
        left: percent(node.x, layout.width),
        top: `calc(${percent(node.y, layout.height)} - ${junction ? CIRCLE_CENTRE.junction : CIRCLE_CENTRE.stop}px)`,
        width: percent(layout.step * LABEL_SHARE, layout.width),
      }}
    >
      {select.mode === 'select' ? (
        <button
          type="button"
          aria-pressed={selected}
          aria-label={
            select.describeStation?.(station, { selected, markers: allMarkers }) ??
            stationLinkLabel(station)
          }
          onClick={() => select.onSelect?.(station.code)}
          className={controlClass}
        >
          {face}
        </button>
      ) : (
        <Link
          href={stationHref(station.code)}
          aria-label={stationLinkLabel(station)}
          className={controlClass}
        >
          {face}
        </Link>
      )}
    </li>
  );
}

function ZigzagVariant<Station extends LineStation>({
  stations,
  columns,
  show,
  label,
  flow,
  select,
}: {
  stations: readonly Station[];
  columns: ZigzagColumns;
  show: string;
  label?: string;
  flow: boolean;
  select: SelectProps;
}) {
  const layout = zigzagLayout(stations, columns);
  return (
    <div
      className={cn('relative', show)}
      style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        fill="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {layout.paths.map((path) => (
          <path
            key={`track-${path.id}`}
            d={path.d}
            className={cn('fill-none', flow ? 'stroke-primary-100' : 'stroke-primary-600')}
            strokeWidth={layout.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {flow
          ? layout.paths.map((path) => (
              <path
                key={`water-${path.id}`}
                d={path.d}
                pathLength={1}
                className="line-flow fill-none"
                style={flowStyle(path.flow)}
                strokeWidth={layout.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))
          : null}
      </svg>
      <ol aria-label={label}>
        {layout.nodes.map((node) => (
          <Stop key={node.station.code} node={node} layout={layout} select={select} />
        ))}
      </ol>
    </div>
  );
}

type LineZigzagProps<Station extends LineStation> = {
  stations: readonly Station[];
  /** Accessible name of the list of stops. */
  label?: string;
  /** Draw the water layer (wrap in `LineFlow` to animate it). Off: a plain solid line. */
  flow?: boolean;
  /** `link` (default): each stop links to its station page. `select`: each is a toggle button. */
  mode?: LineMode;
  selectedCode?: string | null;
  onSelect?: (code: string) => void;
  /** Road-change glyphs beside each stop (`select` mode only). */
  markersByStation?: MarkersByStation;
  /** Accessible name of each stop in `select` mode. */
  describeStation?: DescribeStation;
};

/**
 * The line as a snake that fills the width: A01 top left, rows joined by U-turns, to the junction
 * S19, which forks to S20 and on to S30 and S31. One control per stop, in line order.
 */
export function LineZigzag<Station extends LineStation>({
  stations,
  label,
  flow = true,
  mode = 'link',
  selectedCode = null,
  onSelect,
  markersByStation,
  describeStation,
}: LineZigzagProps<Station>) {
  const select: SelectProps = { mode, selectedCode, onSelect, markersByStation, describeStation };
  return (
    <div className="@container px-4 md:px-8">
      {VARIANTS.map(({ columns, show }) => (
        <ZigzagVariant
          key={columns}
          stations={stations}
          columns={columns}
          show={show}
          label={label}
          flow={flow}
          select={select}
        />
      ))}
    </div>
  );
}
