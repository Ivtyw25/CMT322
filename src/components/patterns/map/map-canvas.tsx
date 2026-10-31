'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from '@/components/ui/external-link';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { MapPlaceholder } from './map-placeholder';
import type { LocationMapProps, MapMarker } from './map-types';

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const MIN_ZOOM = 10;
const MAX_ZOOM = 19;

type TileStatus = 'loading' | 'ready' | 'unavailable';

const controlClass = cn(
  'hit-area flex size-7 cursor-pointer items-center justify-center rounded-md border border-gray-300',
  'bg-surface text-gray-700 shadow-control transition-colors duration-(--duration-fast)',
  'hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400',
);

function markerIcon({ code }: MapMarker): L.DivIcon {
  const element = document.createElement('span');
  element.className = code
    ? 'absolute -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-static-white bg-primary-700 px-1.5 py-0.5 type-body-xs-semibold whitespace-nowrap text-static-white shadow-control'
    : 'absolute block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-static-white bg-primary-600 shadow-control';
  if (code) element.textContent = code;
  return L.divIcon({ html: element, className: 'overflow-visible', iconSize: [0, 0] });
}

/** The Leaflet map. Browser only: load it through `LocationMap`. */
export function MapCanvas({
  center,
  zoom,
  markers = [],
  label,
  centreLabel,
  unavailableText,
  interaction = 'snippet',
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const startRef = useRef({ lat: center.lat, lng: center.lng, zoom });
  const [tiles, setTiles] = useState<TileStatus>('loading');
  const [zoomLevel, setZoomLevel] = useState(zoom);

  // The map is created once; the effects below follow later changes to the props.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const start = startRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const map = L.map(container, {
      center: [start.lat, start.lng],
      zoom: start.zoom,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interaction === 'full',
      dragging: interaction === 'full' || !L.Browser.mobile,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
      markerZoomAnimation: !reduceMotion,
    });
    const tileLayer = L.tileLayer(TILE_URL, { maxZoom: MAX_ZOOM }).addTo(map);
    let anyTileLoaded = false;
    tileLayer.on('tileload', () => {
      anyTileLoaded = true;
      setTiles('ready');
    });
    tileLayer.on('tileerror', () => {
      if (!anyTileLoaded) setTiles('unavailable');
    });
    map.on('zoomend', () => setZoomLevel(map.getZoom()));
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [interaction]);

  useEffect(() => {
    const container = containerRef.current;
    container?.setAttribute('role', 'region');
    container?.setAttribute('aria-label', label);
  }, [label]);

  useEffect(() => {
    mapRef.current?.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const marker of markers) {
      L.marker([marker.lat, marker.lng], {
        icon: markerIcon(marker),
        title: marker.label,
        alt: marker.label,
      }).addTo(layer);
    }
  }, [markers]);

  return (
    <>
      <div ref={containerRef} className="isolate size-full bg-gray-100" />
      {tiles === 'loading' ? (
        <MapPlaceholder className="pointer-events-none absolute inset-0 z-10" />
      ) : null}
      {tiles === 'unavailable' ? (
        <MapPlaceholder
          message={unavailableText ?? uiCopy.map.unavailable}
          className="absolute inset-0 z-10"
        />
      ) : null}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          aria-label={uiCopy.map.zoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          onClick={() => mapRef.current?.zoomIn()}
          className={controlClass}
        >
          <Plus aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          aria-label={uiCopy.map.zoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          onClick={() => mapRef.current?.zoomOut()}
          className={controlClass}
        >
          <Minus aria-hidden className="size-4" />
        </button>
        {centreLabel ? (
          <button
            type="button"
            aria-label={centreLabel}
            title={centreLabel}
            onClick={() => mapRef.current?.setView([center.lat, center.lng], zoom)}
            className={controlClass}
          >
            <LocateFixed aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
      <p className="absolute right-0 bottom-0 z-20 rounded-tl-md bg-surface px-2 py-0.5 type-body-xs text-gray-700">
        <ExternalLink href={uiCopy.map.attributionHref} className="hit-area text-gray-700">
          {uiCopy.map.attribution}
        </ExternalLink>
      </p>
    </>
  );
}
