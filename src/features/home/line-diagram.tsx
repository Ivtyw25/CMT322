import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { homeCopy } from '@/content/home';
import type { Station } from '@/data/models/station';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/cn';
import { LineDiagramArt } from './line-diagram-art';
import {
  calloutLayouts,
  DIAGRAM_HEIGHT,
  DIAGRAM_WIDTH,
  depotLayouts,
  stationLayouts,
  type StationLayout,
} from './line-diagram-layout';
import { stationHref, stationNotes } from './line-station';

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

function StationStop({ station, layout }: { station: Station; layout: StationLayout }) {
  const { x, y, radius, border, label, junction, branch } = layout;
  const box = boxOf(layout);
  return (
    <li>
      <Link
        href={stationHref(station.code)}
        className="group absolute block rounded-xl"
        style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
      >
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
              'group-hover:underline',
              junction
                ? 'type-heading-2xs text-primary-800'
                : 'type-body-xs text-gray-600 group-hover:text-primary-700',
            )}
          >
            {station.name}
          </span>
          {station.isProvisionalName ? (
            <span aria-hidden className="type-body-xs text-gray-500">
              {homeCopy.line.provisionalShort}
            </span>
          ) : null}
        </span>
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

/** The logical diagram of the line (1280 px and up): one link per station, in line order. */
export function LineDiagram({ stations }: { stations: readonly Station[] }) {
  const copy = homeCopy.line;
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
            <StationStop key={station.code} station={station} layout={layout} />
          ) : null;
        })}
      </ol>
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
    </div>
  );
}
