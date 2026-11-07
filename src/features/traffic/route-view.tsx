'use client';

import { useEffect, useRef } from 'react';
import { FitToWidth } from '@/components/patterns/fit-to-width';
import { LineDiagram } from '@/components/patterns/line-diagram/line-diagram';
import {
  DIAGRAM_HEIGHT,
  DIAGRAM_WIDTH,
} from '@/components/patterns/line-diagram/line-diagram-layout';
import { LineRailView } from '@/components/patterns/line-diagram/line-rail-view';
import type {
  LineMarkerKind,
  MarkersByStation,
} from '@/components/patterns/line-diagram/line-markers';
import { stationNotes } from '@/components/patterns/line-diagram/line-station';
import { trafficCopy } from '@/content/traffic';
import type { StationCode } from '@/data/models/station';
import { DiagramLegend } from './diagram-legend';
import { FilterLiveRegion } from './filter-live-region';
import { LayerToggles } from './layer-toggles';
import { PanelHeader } from './panel-header';
import { RoadChangeList } from './road-change-list';
import type { RouteStation } from './route-station';
import { StationCard } from './station-card';
import { STATION_SEARCH_ID, StationSearch } from './station-search';
import { TimeFilter } from './time-filter';
import type { TrafficEntry } from './traffic-entry';
import { countByLayer, filterByTimeAndText, showLayer } from './traffic-filters';
import { useTrafficParams } from './use-traffic-filters';

type RouteViewProps = {
  entries: readonly TrafficEntry[];
  stations: readonly RouteStation[];
  /** "14:20" */
  updatedAt: string;
};

const LIST_ID = 'route-changes-list';
const STATIONS_ID = 'route-stations';

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Route view (Figma 5:843): station picker and road changes beside the line diagram or rail. */
export function RouteView({ entries, stations, updatedAt }: RouteViewProps) {
  const copy = trafficCopy.route;
  const { params, when, hidden, setWhen, toggleLayer } = useTrafficParams();
  const stationParam = params.get('station')?.toUpperCase();
  const station = stations.find((item) => item.code === stationParam) ?? null;
  const selectedCode = station?.code ?? null;
  const wantsCard = useRef(false);

  // Below 1024 px the card sits above the rail: bring it into view once it has rendered.
  useEffect(() => {
    if (!selectedCode || !wantsCard.current) return;
    wantsCard.current = false;
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    document
      .getElementById('station-card')
      ?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [selectedCode]);

  const inTime = filterByTimeAndText(entries, when, '');
  const counts = countByLayer(inTime);
  const shown = showLayer(inTime, hidden);

  const markersByStation = (() => {
    const result: Partial<Record<StationCode, LineMarkerKind[]>> = {};
    for (const entry of shown) {
      const first = entry.stationCodes[0];
      if (first) result[first] = [...(result[first] ?? []), entry.layer];
    }
    return result satisfies MarkersByStation;
  })();

  const listed = (() => {
    const position = (entry: TrafficEntry) =>
      stations.findIndex((item) => item.code === entry.stationCodes[0]);
    return shown
      .filter((entry) => !selectedCode || entry.stationCodes.some((code) => code === selectedCode))
      .toSorted((a, b) => position(a) - position(b) || a.dateText.localeCompare(b.dateText));
  })();

  function select(code: string) {
    const next = code === selectedCode ? null : code.toLowerCase();
    wantsCard.current = next !== null;
    params.set({ station: next });
  }

  function clearStation() {
    params.set({ station: null });
    document.getElementById(STATION_SEARCH_ID)?.focus();
  }

  const title = station
    ? copy.selected.changesTitle(listed.length)
    : copy.selected.lineTitle(listed.length);
  const emptyText = station
    ? copy.selected.emptyNear(station.name)
    : trafficCopy.map.filters.noMatch.text;

  return (
    <div className="flex flex-col lg:grid lg:h-full lg:grid-cols-[25rem_1fr]">
      <section
        aria-labelledby="traffic-title"
        className="flex flex-col gap-5 bg-surface p-4 md:p-8 lg:overflow-y-auto lg:p-6"
      >
        <PanelHeader view="route" updatedAt={updatedAt} when={when} hidden={hidden} />
        <StationSearch stations={stations} onSelect={select} />
        <TimeFilter value={when} onChange={setWhen} />
        <LayerToggles view="route" hidden={hidden} counts={counts} onToggle={toggleLayer} />
        <hr className="border-gray-200" />
        {station ? <StationCard station={station} onClear={clearStation} /> : null}
        <a
          href={`#${STATIONS_ID}`}
          className="sr-only focus:not-sr-only focus:type-body-s-medium focus:text-primary-700"
        >
          {trafficCopy.map.filters.skipToStations}
        </a>
        <RoadChangeList
          headingId={LIST_ID}
          title={title}
          label={trafficCopy.map.results.listLabel}
          entries={listed}
          mode="link"
          emptyText={emptyText}
          onClearFilters={() => params.set({ when: null, hide: null })}
        />
        <FilterLiveRegion count={listed.length} />
      </section>
      <div className="bg-gray-50 lg:flex lg:flex-col lg:overflow-y-auto lg:border-l lg:border-gray-200">
        <figure
          id={STATIONS_ID}
          tabIndex={-1}
          aria-label={copy.diagram.label}
          className="flex flex-col gap-4 p-4 max-[1439px]:mx-auto max-[1439px]:max-w-160 min-[1440px]:justify-center min-[1440px]:py-10 md:p-8 lg:flex-1 lg:p-6 lg:max-[1439px]:mx-0 lg:max-[1439px]:max-w-140"
        >
          <figcaption className="type-body-s text-gray-600">{copy.diagram.caption}</figcaption>
          <div className="min-[1440px]:hidden">
            <LineRailView
              stations={stations}
              mode="select"
              selectedCode={selectedCode}
              onSelect={select}
              markersByStation={markersByStation}
              markerNote={copy.diagram.changesNearby}
              label={copy.stationList.label}
            />
          </div>
          <div className="mx-auto hidden w-full max-w-225 min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-8">
            <FitToWidth width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} minScale={0.75}>
              <LineDiagram
                stations={stations}
                mode="select"
                selectedCode={selectedCode}
                onSelect={select}
                markersByStation={markersByStation}
                legend={null}
                describeStation={(item, state) => {
                  const base = `${item.code} ${item.name}${stationNotes(item)}`;
                  return state.markers.length > 0
                    ? `${base}, ${copy.diagram.changesNearby(state.markers.length)}`
                    : base;
                }}
              />
            </FitToWidth>
            <DiagramLegend />
          </div>
        </figure>
      </div>
    </div>
  );
}
