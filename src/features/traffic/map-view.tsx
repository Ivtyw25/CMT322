'use client';

import { useEffect, useRef, useState } from 'react';
import { LocationMap } from '@/components/patterns/map/location-map';
import type {
  MapLabel,
  MapLine,
  MapMarker,
  MapPoint,
  MapZone,
} from '@/components/patterns/map/map-types';
import { SearchInput } from '@/components/ui/search-input';
import { trafficCopy } from '@/content/traffic';
import { FilterLiveRegion } from './filter-live-region';
import { MapPopup } from './map-popup';
import { PanelHeader } from './panel-header';
import { LayerToggles } from './layer-toggles';
import { RoadChangeList, emptyTextOf } from './road-change-list';
import { TimeFilter } from './time-filter';
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
const DESKTOP_QUERY = '(min-width: 1024px)';
/** Stations named on the map at the first zoom; the rest from zoom 14. */
const KEY_STATIONS = new Set(['S31', 'S20', 'S19', 'S13', 'S09', 'S03', 'A01']);
const LABEL_ZOOM_KEY = 11;
const LABEL_ZOOM_ALL = 14;
const START_ZOOM = 11;
const ZONE_RADIUS_M = 150;
const FIT_MAX_ZOOM = 15;

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

  // Below 1024 px the list sits under the map; on desktop it scrolls inside the panel.
  useEffect(() => {
    if (!selectedId || !window.matchMedia(DESKTOP_QUERY).matches) return;
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
        minZoom: KEY_STATIONS.has(station.code) ? LABEL_ZOOM_KEY : LABEL_ZOOM_ALL,
      }))
    : [];

  function select(id: string) {
    if (id === selectedId) {
      params.set({ focus: null });
      return;
    }
    params.set({ focus: id });
    setPan((current) => ({ id, key: (current?.key ?? 0) + 1 }));
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      document.getElementById(MAP_ID)?.scrollIntoView({
        block: 'start',
        behavior: reducedMotion() ? 'auto' : 'smooth',
      });
    }
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
    <div className="flex flex-col lg:grid lg:h-full lg:grid-cols-[25rem_1fr]">
      <section
        aria-labelledby="traffic-title"
        className="order-2 flex flex-col gap-5 bg-surface p-4 md:p-8 lg:order-1 lg:overflow-y-auto lg:p-6"
      >
        <PanelHeader view="map" updatedAt={updatedAt} when={when} hidden={hidden} />
        <SearchInput
          aria-label={copy.filters.placeSearch.label}
          placeholder={copy.filters.placeSearch.placeholder}
          enterKeyHint="search"
          maxLength={MAX_QUERY_LENGTH}
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          onClear={() => changeQuery('')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') changeQuery('');
            if (event.key === 'Enter') fitToResults();
          }}
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
      <div
        id={MAP_ID}
        className="relative order-1 h-[min(30rem,60svh)] md:h-130 lg:order-2 lg:h-full"
      >
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
    </div>
  );
}
