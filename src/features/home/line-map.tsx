'use client';

import type { Map as LeafletMap } from 'leaflet';
import { LoaderCircle, MapPinOff, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import './line-map.css';
import { LABELLED_CODES, LARGE_CODES, toPaths, type MapStation } from './line-map-data';

type MapStatus = 'loading' | 'ready' | 'error';

/** The map is "ready" once a tile has loaded; with none after this long, it shows the error state. */
const TILE_TIMEOUT_MS = 10_000;
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const MIN_ZOOM = 9;
const MAX_ZOOM = 17;
const MARKER_SIZE = 16;
const MARKER_SIZE_LARGE = 22;

const chipClass =
  'rounded-md bg-surface px-2 py-1 type-body-xs-semibold text-gray-900 shadow-map-control';

type MapCanvasProps = {
  stations: readonly MapStation[];
  onStatus: (status: MapStatus) => void;
};

/** One Leaflet map. Remounted (by `key`) to retry. */
function MapCanvas({ stations, onStatus }: MapCanvasProps) {
  const copy = homeCopy.line.map;
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let created: LeafletMap | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function create(target: HTMLDivElement) {
      try {
        const L = (await import('leaflet')).default;
        if (cancelled) return;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const leafletMap = L.map(target, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          keyboard: true,
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          zoomAnimation: !still,
          fadeAnimation: !still,
          markerZoomAnimation: !still,
        });
        created = leafletMap;

        const tiles = L.tileLayer(TILE_URL, { maxZoom: MAX_ZOOM });
        tiles.once('tileload', () => {
          clearTimeout(timer);
          onStatus('ready');
        });
        tiles.once('tileerror', () => {
          clearTimeout(timer);
          onStatus('error');
        });
        tiles.addTo(leafletMap);
        timer = setTimeout(() => onStatus('error'), TILE_TIMEOUT_MS);

        for (const path of toPaths(stations)) {
          L.polyline(path, { weight: 5, lineCap: 'round', className: 'stroke-primary-600' }).addTo(
            leafletMap,
          );
        }

        for (const station of stations) {
          const size = LARGE_CODES.includes(station.code) ? MARKER_SIZE_LARGE : MARKER_SIZE;
          const marker = L.marker([station.lat, station.lng], {
            keyboard: true,
            icon: L.divIcon({
              className: '',
              iconSize: [size, size],
              html: '<span class="block size-full rounded-full border-3 border-primary-600 bg-surface"></span>',
            }),
          }).addTo(leafletMap);

          marker.bindTooltip(homeCopy.line.stationLabel(station.code, station.name), {
            permanent: LABELLED_CODES.includes(station.code),
            direction: 'right',
            offset: [size / 2, 0],
            opacity: 1,
            className: cn(chipClass, 'border-0 before:hidden'),
          });

          const popup = document.createElement('div');
          popup.className = 'flex flex-col gap-1';
          const name = document.createElement('p');
          name.className = 'm-0 type-body-s-semibold text-gray-900';
          name.textContent = homeCopy.line.stationLabel(station.code, station.name);
          const link = document.createElement('a');
          link.href = station.href;
          link.className = 'type-body-s-semibold text-primary-700 hover:underline';
          link.textContent = copy.openStationPage(station.name);
          link.addEventListener('click', (event) => {
            event.preventDefault();
            router.push(station.href);
          });
          popup.append(name, link);
          marker.bindPopup(popup, { className: 'type-body-s', closeButton: true });

          marker.once('add', () => {
            const icon = marker.getElement();
            if (!icon) return;
            icon.setAttribute('role', 'button');
            icon.setAttribute('aria-label', station.label);
            icon.addEventListener('focus', () => marker.openTooltip());
            icon.addEventListener('blur', () => marker.closeTooltip());
          });
        }

        leafletMap.fitBounds(
          L.latLngBounds(stations.map((station) => [station.lat, station.lng] as [number, number])),
          { padding: [48, 48] },
        );
        leafletMap.getContainer().addEventListener('keydown', (event) => {
          if (event.key === 'Escape') leafletMap.closePopup();
        });
        leafletMap.on('zoomend', () => setZoom(leafletMap.getZoom()));
        setZoom(leafletMap.getZoom());
        setMap(leafletMap);
      } catch {
        if (!cancelled) onStatus('error');
      }
    }

    void create(element);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      created?.remove();
    };
  }, [stations, onStatus, router, copy]);

  return (
    <>
      <div ref={container} className="size-full bg-gray-100" />
      <div className="absolute top-3 right-3 z-1000 flex flex-col gap-2">
        <Button
          variant="secondary"
          aria-label={copy.zoomIn}
          disabled={!map || zoom >= MAX_ZOOM}
          onClick={() => map?.zoomIn()}
          className="size-10 p-0 shadow-map-control"
        >
          <Plus aria-hidden className="size-5" />
        </Button>
        <Button
          variant="secondary"
          aria-label={copy.zoomOut}
          disabled={!map || zoom <= MIN_ZOOM}
          onClick={() => map?.zoomOut()}
          className="size-10 p-0 shadow-map-control"
        >
          <Minus aria-hidden className="size-5" />
        </Button>
      </div>
      <p className={cn(chipClass, 'absolute bottom-3 left-3 z-1000 type-body-xs-medium')}>
        {copy.caption}
      </p>
      <p className={cn(chipClass, 'absolute right-3 bottom-3 z-1000 type-body-xs-medium')}>
        <ExternalLink href={copy.attribution.href} className="text-gray-900">
          {copy.attribution.label}
        </ExternalLink>
      </p>
    </>
  );
}

type LineMapProps = { stations: readonly MapStation[] };

/** Map view: the line on OpenStreetMap, with a loading and an error state. Loaded only when chosen. */
export function LineMap({ stations }: LineMapProps) {
  const copy = homeCopy.line.map;
  const [status, setStatus] = useState<MapStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  function retry() {
    setStatus('loading');
    setAttempt((count) => count + 1);
  }

  return (
    <div
      role="region"
      aria-label={copy.label}
      className="relative isolate h-120 overflow-hidden rounded-3xl border border-gray-200 lg:h-150"
    >
      <MapCanvas key={attempt} stations={stations} onStatus={setStatus} />
      {status === 'loading' ? (
        <div
          role="status"
          className="absolute inset-0 z-1000 flex items-center justify-center gap-2 bg-gray-100 type-body-s text-gray-600"
        >
          <LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
          {copy.loading}
        </div>
      ) : null}
      {status === 'error' ? (
        <div className="absolute inset-0 z-1000 flex flex-col items-center justify-center gap-3 bg-gray-100 px-5 text-center">
          <MapPinOff aria-hidden className="size-6 text-gray-400" />
          <div className="flex flex-col gap-1">
            <p className="type-body-s-semibold text-gray-900">{copy.errorTitle}</p>
            <p className="type-body-s text-gray-600">{copy.errorText}</p>
          </div>
          <Button variant="secondary" onClick={retry}>
            {uiCopy.actions.tryAgain}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
