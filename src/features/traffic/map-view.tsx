'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LocationMap } from '@/components/patterns/map/location-map';
import type {
  MapLabel,
  MapLine,
  MapMarker,
  MapPoint,
  MapZone,
} from '@/components/patterns/map/map-types';
import { SearchBar } from '@/components/ui/search-bar';
import { trafficCopy } from '@/content/traffic';
import { FilterLiveRegion } from './filter-live-region';
import { MapPopup } from './map-popup';
import { PanelHeader } from './panel-header';
import { LayerToggles } from './layer-toggles';
import { RoadChangeList, emptyTextOf } from './road-change-list';
import { TimeFilter } from './time-filter';
import { TrafficWorkspace } from './traffic-workspace';
import type { TrafficEntry } from './traffic-entry';
import {
  MAX_QUERY_LENGTH,
  countByLayer,
  emptyCause,
  filterByTimeAndText,
  showLayer,
} from './traffic-filters';
import { useTrafficParams } from './use-traffic-filters';

export type MapStation = { code: string; name: string; lat: number; lng: number };

type MapViewProps = {
  entries: readonly TrafficEntry[];
  stations: readonly MapStation[];
  /** Station points of the main line and of the short branch, in line order. */
  alignment: { main: readonly MapPoint[]; branch: readonly MapPoint[] };
  /** "14:20" */
  updatedAt: string;
};

const LIST_ID = 'road-changes-list';
const MAP_ID = 'traffic-map';
const SEARCH_DELAY_MS = 300;
const WIDE_QUERY = '(min-width: 768px)';
/** Stations named on the map at the first zoom (KOMTAR, next to Macallum, waits for zoom 12); the rest from zoom 14. */
const KEY_STATIONS = new Set(['S31', 'S19', 'S13', 'S09', 'S03', 'A01']);
const LABEL_ZOOM_KEY = 11;
const LABEL_ZOOM_NEARBY = 12;
const LABEL_ZOOM_ALL = 14;
const START_ZOOM = 11;
const ZONE_RADIUS_M = 150;
const FIT_MAX_ZOOM = 15;

function labelZoomOf(code: string): number {
  if (code === 'S20') return LABEL_ZOOM_NEARBY;
  return KEY_STATIONS.has(code) ? LABEL_ZOOM_KEY : LABEL_ZOOM_ALL;
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Traffic map (Figma 1:801): the filter panel and list beside a Leaflet map of the road changes. */
export function MapView({ entries, stations, alignment, updatedAt }: MapViewProps) {
  const copy = trafficCopy.map;
  const { params, when, hidden, setWhen, toggleLayer } = useTrafficParams();
  const [query, setQuery] = useState(() => params.get('q')?.slice(0, MAX_QUERY_LENGTH) ?? '');
  const focusParam = params.get('focus');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const changePanelOpen = useCallback((open: boolean) => setPanelOpen(open), []);
  const [pan, setPan] = useState<{ id: string; key: number } | null>(
    focusParam ? { id: focusParam, key: 1 } : null,
  );
  const [fit, setFit] = useState<{ points: readonly MapPoint[]; key: number }>({
    points: stations,
    key: 1,
  });

  const inTimeAndText = filterByTimeAndText(entries, when, query);
  const counts = countByLayer(inTimeAndText);
  const shown = showLayer(inTimeAndText, hidden);
  const selected = shown.find((entry) => entry.id === focusParam) ?? null;
  const selectedId = selected?.id ?? null;

  const searchTimer = useRef<number | undefined>(undefined);
  const wasSelected = useRef(false);
  const landed = useRef(false);

  useEffect(() => {
    const timer = searchTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  // A shared link must land on its item, so the filters that hide it are cleared (once). Later,
  // an item that a filter removes simply stops being selected.
  useEffect(() => {
    if (!focusParam) {
      wasSelected.current = false;
      return;
    }
    if (selected) {
      wasSelected.current = true;
      return;
    }
    const known = entries.some((entry) => entry.id === focusParam);
    if (known && !wasSelected.current) {
      if (landed.current) return;
      landed.current = true;
      setQuery('');
      params.set({ when: null, hide: null, q: null });
    } else {
      params.set({ focus: null });
    }
  }, [focusParam, selected, entries, params]);

  // From 768 px the list scrolls inside the panel beside the map: keep the chosen row in view.
  useEffect(() => {
    if (!selectedId || !window.matchMedia(WIDE_QUERY).matches) return;
    document
      .getElementById(`road-change-${selectedId}`)
      ?.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [selectedId]);

  const center = {
    lat: stations.reduce((sum, station) => sum + station.lat, 0) / stations.length,
    lng: stations.reduce((sum, station) => sum + station.lng, 0) / stations.length,
  };

  const lineOn = !hidden.includes('lrt');

  const markers: MapMarker[] = shown.map((entry) => ({
    id: entry.id,
    lat: entry.lat,
    lng: entry.lng,
    label: `${copy.filters.layerSingular[entry.layer]}: ${entry.title}, ${entry.dateText}`,
    variant: entry.layer === 'construction' ? 'zone' : entry.layer,
  }));
  const zones: MapZone[] = shown
    .filter((entry) => entry.layer === 'construction')
    .map((entry) => ({
      id: entry.id,
      lat: entry.lat,
      lng: entry.lng,
      radiusM: ZONE_RADIUS_M,
      label: entry.title,
    }));
  const lines: MapLine[] = lineOn
    ? [
        { id: 'main', variant: 'line', points: alignment.main },
        { id: 'branch', variant: 'line', points: alignment.branch },
      ]
    : [];
  const labels: MapLabel[] = lineOn
    ? stations.map((station) => ({
        id: station.code,
        lat: station.lat,
        lng: station.lng,
        text: `${station.code} ${station.name}`,
        minZoom: labelZoomOf(station.code),
      }))
    : [];

  function select(id: string) {
    if (id === selectedId) {
      params.set({ focus: null });
      return;
    }
    params.set({ focus: id });
    setPan((current) => ({ id, key: (current?.key ?? 0) + 1 }));
    // On a phone the panel covers the map: close it so the chosen place shows.
    setPanelOpen(false);
  }

  function changeQuery(next: string) {
    setQuery(next);
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => params.set({ q: next.trim() }), SEARCH_DELAY_MS);
  }

  function clearFilters() {
    window.clearTimeout(searchTimer.current);
    setQuery('');
    params.set({ when: null, hide: null, q: null });
  }

  function fitToResults() {
    if (shown.length === 0) return;
    setFit((current) => ({ points: shown, key: current.key + 1 }));
  }

  const cause = emptyCause(entries, { when, hidden, query });
  const popupEntry = (id: string) => shown.find((entry) => entry.id === id);

  return (
    <TrafficWorkspace
      panelOpen={panelOpen}
      onPanelOpenChange={changePanelOpen}
      panel={
        <section aria-labelledby="traffic-title" className="flex flex-col gap-5 p-4 md:p-6">
          <PanelHeader view="map" updatedAt={updatedAt} when={when} hidden={hidden} />
          <SearchBar
            label={copy.filters.placeSearch.label}
            placeholder={copy.filters.placeSearch.placeholder}
            value={query}
            onValueChange={changeQuery}
            onSubmit={fitToResults}
            inputProps={{ maxLength: MAX_QUERY_LENGTH }}
          />
          <TimeFilter value={when} onChange={setWhen} />
          <LayerToggles view="map" hidden={hidden} counts={counts} onToggle={toggleLayer} />
          <hr className="border-gray-200" />
          <RoadChangeList
            headingId={LIST_ID}
            title={copy.results.title(shown.length)}
            label={copy.results.listLabel}
            entries={shown}
            mode="select"
            selectedId={selectedId}
            onSelect={select}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            emptyText={emptyTextOf(cause)}
            onClearFilters={clearFilters}
          />
          <FilterLiveRegion count={shown.length} />
        </section>
      }
      main={
        <div id={MAP_ID} className="relative size-full">
          <a
            href={`#${LIST_ID}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-20 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:type-body-s-medium focus:text-primary-700"
          >
            {copy.filters.skipToList}
          </a>
          <LocationMap
            center={center}
            zoom={START_ZOOM}
            label={copy.layout.mapLabel}
            centreLabel={copy.controls.resetView}
            unavailableText={copy.layout.unavailable}
            interaction="full"
            className="size-full border-0"
            markers={markers}
            zones={zones}
            lines={lines}
            labels={labels}
            resetBounds={stations}
            fitPoints={fit.points}
            fitKey={fit.key}
            fitMaxZoom={FIT_MAX_ZOOM}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={(id) => params.set({ focus: id })}
            onDeselect={() => params.set({ focus: null })}
            renderPopup={(id) => {
              const entry = popupEntry(id);
              return entry ? <MapPopup entry={entry} /> : null;
            }}
            focusId={pan?.id ?? null}
            focusKey={pan?.key ?? 0}
          />
        </div>
      }
    />
  );
}
