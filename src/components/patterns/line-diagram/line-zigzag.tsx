import Link from 'next/link';
import { lineDiagramCopy } from '@/content/line';
import { JUNCTION_CODE } from '@/data/api/line-alignment';
import { cn } from '@/lib/cn';
import { InterchangeIcons } from './interchange-icons';
import './line-flow.css';
import { flowStyle } from './line-flow-style';
import { stationHref, stationLinkLabel, type LineStation } from './line-station';
import {
  zigzagLayout,
  type ZigzagColumns,
  type ZigzagLayout,
  type ZigzagNode,
} from './line-zigzag-layout';

/** Stops per row by width. Each variant is drawn once and shown by CSS, so nothing shifts on load. */
const VARIANTS: readonly { columns: ZigzagColumns; show: string }[] = [
  { columns: 3, show: 'min-[520px]:hidden' },
  { columns: 4, show: 'hidden min-[520px]:block md:hidden' },
  { columns: 5, show: 'hidden md:block lg:hidden' },
  { columns: 6, show: 'hidden lg:block xl:hidden' },
];

/** Label width as a share of the column spacing, so neighbouring labels never touch. */
const LABEL_SHARE = 0.96;

/** Distance from the top of a stop's link to the centre of its circle, in px. */
const CIRCLE_CENTRE = { stop: 20, junction: 24 };

function percent(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function Stop<Station extends LineStation>({
  node,
  layout,
}: {
  node: ZigzagNode<Station>;
  layout: ZigzagLayout<Station>;
}) {
  const { station } = node;
  const junction = station.code === JUNCTION_CODE;
  return (
    <li
      className="absolute -translate-x-1/2"
      style={{
        left: percent(node.x, layout.width),
        top: `calc(${percent(node.y, layout.height)} - ${junction ? CIRCLE_CENTRE.junction : CIRCLE_CENTRE.stop}px)`,
        width: percent(layout.step * LABEL_SHARE, layout.width),
      }}
    >
      <Link
        href={stationHref(station.code)}
        aria-label={stationLinkLabel(station)}
        className="group flex flex-col items-center gap-1 rounded-xl px-0.5 pt-0.5 pb-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-surface transition-colors duration-(--duration-fast) group-hover:bg-primary-50',
            junction ? 'size-11 border-3 border-primary-800' : 'size-9 border-2 border-primary-600',
          )}
        >
          <span
            className={
              junction
                ? 'type-body-s-semibold text-primary-800'
                : 'type-body-xs-semibold text-primary-700'
            }
          >
            {station.code}
          </span>
        </span>
        <span className="flex flex-col items-center text-center">
          <span
            className={cn(
              'wrap-anywhere transition-colors duration-(--duration-fast) group-hover:text-primary-700',
              junction ? 'type-heading-3xs whitespace-nowrap' : 'type-body-xs-semibold',
              'text-gray-800',
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
      </Link>
    </li>
  );
}

function ZigzagVariant<Station extends LineStation>({
  stations,
  columns,
  show,
  label,
}: {
  stations: readonly Station[];
  columns: ZigzagColumns;
  show: string;
  label?: string;
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
            className="fill-none stroke-primary-100"
            strokeWidth={layout.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {layout.paths.map((path) => (
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
        ))}
      </svg>
      <ol aria-label={label}>
        {layout.nodes.map((node) => (
          <Stop key={node.station.code} node={node} layout={layout} />
        ))}
      </ol>
    </div>
  );
}

/**
 * The line as a snake that fills the width (below 1280 px): A01 top left, rows joined by U-turns,
 * to the junction S19, which forks to S20 and on to S30 and S31. One link per stop, in line order.
 * Wrap it in `LineFlow` for the water animation.
 */
export function LineZigzag<Station extends LineStation>({
  stations,
  label,
}: {
  stations: readonly Station[];
  /** Accessible name of the list of stops. */
  label?: string;
}) {
  return (
    <div className="px-4 md:px-8">
      {VARIANTS.map(({ columns, show }) => (
        <ZigzagVariant
          key={columns}
          stations={stations}
          columns={columns}
          show={show}
          label={label}
        />
      ))}
    </div>
  );
}
