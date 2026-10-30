'use client';

import { MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import { projectCopy } from '@/content/project';
import { cn } from '@/lib/cn';
import {
  DIAGRAM_HEIGHT,
  DIAGRAM_TOP,
  DIAGRAM_WIDTH,
  leaders,
  lightPaths,
  placesLayout,
  solidPath,
  stopLayout,
  wrapLabel,
} from './route-diagram-layout';

export type DiagramStation = {
  code: string;
  name: string;
  isProvisionalName: boolean;
};

type RouteDiagramProps = {
  /** All stations in line order, Penang Sentral first. */
  stations: readonly DiagramStation[];
  selectedCode: string;
  onSelect: (code: string) => void;
};

const copy = projectCopy.about.stations;
const LINE_HEIGHT = 17;
const HIT_SIZE = 40;

type PlaceCode = keyof typeof copy.places;
const placesOf = (code: string): readonly string[] => copy.places[code as PlaceCode] ?? [];

type LabelProps = { station: DiagramStation; selected: boolean; hovered: boolean };

/** The station name beside its stop, wrapped into short lines; "(provisional)" in grey beneath. */
function StopLabel({ station, selected, hovered }: LabelProps) {
  const layout = stopLayout[station.code];
  if (!layout) return null;
  const lines = wrapLabel(station.name, layout.wrapAt ?? 10);
  const extra = station.isProvisionalName ? [copy.provisional] : [];
  const all = [...lines, ...extra];
  const { x, y, label } = layout;
  const interchange = layout.interchange === true;
  const highlight = selected || hovered || interchange;
  const anchor = label === 'right' ? 'start' : label === 'left' ? 'end' : 'middle';
  const textX = label === 'right' ? x + 22 : label === 'left' ? x - 22 : x;
  const offset = interchange ? 22 : 19;
  const firstY =
    label === 'below'
      ? y + offset + 13
      : label === 'above'
        ? y - offset - 8 - (all.length - 1) * LINE_HEIGHT
        : y - ((all.length - 1) * LINE_HEIGHT) / 2 + 4;
  if (interchange) {
    return (
      <text
        x={x - 41}
        y={y + 42}
        className="fill-primary-800 type-body-m-semibold"
        textAnchor="start"
      >
        {lines.join(' ')}
      </text>
    );
  }
  return (
    <text textAnchor={anchor} aria-hidden>
      {all.map((line, index) => (
        <tspan
          key={line}
          x={textX}
          y={firstY + index * LINE_HEIGHT}
          className={cn(
            'type-body-xs transition-colors duration-(--duration-fast)',
            index >= lines.length
              ? 'fill-gray-500'
              : highlight
                ? 'fill-primary-700'
                : 'fill-gray-700',
            selected && index < lines.length && 'type-body-xs-semibold',
          )}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Places({ code }: { code: string }) {
  const at = placesLayout[code];
  const places = placesOf(code);
  if (!at || places.length === 0) return null;
  const lines = places.flatMap((place) =>
    wrapLabel(place, at.wrapAt ?? 40).map((line, index) => ({ line, first: index === 0 })),
  );
  return (
    <g aria-hidden>
      {lines.map(({ line, first }, index) => (
        <g key={`${line}-${index}`}>
          {first ? (
            <MapPin
              x={at.x - 15}
              y={at.y + index * 15 - 11}
              width={12}
              height={12}
              className="fill-gray-700 text-gray-700"
            />
          ) : null}
          <text x={at.x} y={at.y + index * 15} className="fill-gray-700 type-body-xs">
            {line}
          </text>
        </g>
      ))}
    </g>
  );
}

/**
 * The schematic of all 22 stations (Figma 1:332), for wide screens. The drawing is `aria-hidden`;
 * its stops are real buttons in one radio group: Tab enters on the selected stop, the arrow keys
 * move along the line and select, Home and End jump to the ends.
 */
export function RouteDiagram({ stations, selectedCode, onSelect }: RouteDiagramProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  function move(index: number) {
    const target = stations[Math.min(Math.max(index, 0), stations.length - 1)];
    if (!target) return;
    onSelect(target.code);
    buttons.current.get(target.code)?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const current = stations.findIndex((station) => station.code === selectedCode);
    const keys: Record<string, number | undefined> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: stations.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    move(next);
  }

  return (
    <div className="relative">
      <p className="sr-only">{copy.keyboardHint}</p>
      <svg
        viewBox={`0 ${DIAGRAM_TOP} ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
        aria-hidden
        className="block h-auto w-full"
      >
        {lightPaths.map((path) => (
          <path
            key={path}
            d={path}
            fill="none"
            strokeWidth={6}
            strokeLinecap="round"
            className="stroke-primary-200"
          />
        ))}
        <path
          d={solidPath}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className="stroke-primary-600"
        />
        {leaders.map((path) => (
          <path
            key={path}
            d={path}
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="0.1 5"
            className="stroke-gray-500"
          />
        ))}
        {stations.map((station) => (
          <StopLabel
            key={station.code}
            station={station}
            selected={station.code === selectedCode}
            hovered={station.code === hovered}
          />
        ))}
        {stations.map((station) => (
          <Places key={station.code} code={station.code} />
        ))}
        <text x={666} y={138} className="fill-gray-900 type-body-xs-semibold" aria-hidden>
          {copy.depot}
        </text>
        <text x={160} y={368} textAnchor="end" className="fill-gray-900 type-body-xs-semibold">
          {copy.depot}
        </text>
      </svg>

      <div
        role="radiogroup"
        aria-label={copy.groupLabel}
        onKeyDown={onKeyDown}
        className="absolute inset-0"
      >
        {stations.map((station) => {
          const layout = stopLayout[station.code];
          if (!layout) return null;
          const selected = station.code === selectedCode;
          return (
            <button
              key={station.code}
              ref={(element) => {
                if (element) buttons.current.set(station.code, element);
                else buttons.current.delete(station.code);
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={copy.stopName(station.code, station.name)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(station.code)}
              onPointerEnter={() => setHovered(station.code)}
              onPointerLeave={() => setHovered(null)}
              style={{
                left: `${(layout.x / DIAGRAM_WIDTH) * 100}%`,
                top: `${((layout.y - DIAGRAM_TOP) / DIAGRAM_HEIGHT) * 100}%`,
                width: HIT_SIZE,
                height: HIT_SIZE,
              }}
              className="group/stop absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-600"
            >
              <span
                aria-hidden
                className={cn(
                  'flex items-center justify-center rounded-full border-2 type-body-xs-semibold transition-[background-color,box-shadow,color] duration-(--duration-fast) ease-(--ease-standard)',
                  layout.interchange ? 'size-9 border-3' : 'size-7',
                  layout.light ? 'border-primary-300' : 'border-primary-600',
                  layout.interchange && 'border-primary-800',
                  selected
                    ? 'bg-primary-600 text-static-white ring-6 ring-primary-200'
                    : 'bg-surface text-primary-700 group-hover/stop:bg-primary-50',
                )}
              >
                {station.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
