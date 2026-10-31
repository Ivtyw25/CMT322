'use client';

import L from 'leaflet';
import './map.css';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink } from '@/components/ui/external-link';
import { uiCopy } from '@/content/ui';
import { MapControls } from './map-controls';
import { labelIcon, markerIcon, SELECTED_Z_OFFSET, variantOf, zOffsetOf } from './map-icons';
import { MapPlaceholder } from './map-placeholder';
import type { LocationMapProps, MapMarker, MapPoint, MapZone } from './map-types';

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const MIN_ZOOM = 10;
const MAX_ZOOM = 19;
/** Zoom a focused item is shown at, unless the map is already closer. */
const FOCUS_ZOOM = 15;
const PAN_SECONDS = 0.25;
const FIT_PADDING: L.PointTuple = [24, 24];

const POPUP_CLASS = [
  'type-body-s',
  '[&_.leaflet-popup-content-wrapper]:rounded-xl [&_.leaflet-popup-content-wrapper]:bg-surface',
  '[&_.leaflet-popup-content-wrapper]:text-gray-900 [&_.leaflet-popup-content-wrapper]:shadow-map-control',
  '[&_.leaflet-popup-content]:m-4 [&_.leaflet-popup-tip]:bg-surface',
].join(' ');

type TileStatus = 'loading' | 'ready' | 'unavailable';

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function latLngOf(point: MapPoint): L.LatLngTuple {
  return [point.lat, point.lng];
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
  zones = [],
  lines = [],
  labels = [],
  selectedId = null,
  onSelect,
  onDeselect,
  renderPopup,
  focusId = null,
  focusKey = 0,
  resetBounds,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const zoneLayerRef = useRef<L.LayerGroup | null>(null);
  const lineLayerRef = useRef<L.LayerGroup | null>(null);
  const labelLayerRef = useRef<L.LayerGroup | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const markerById = useRef(new Map<string, { marker: L.Marker; sig: string; data: MapMarker }>());
  const zoneById = useRef(new Map<string, { circle: L.Circle; data: MapZone }>());
  const closingByCode = useRef(false);
  const wantedId = useRef<string | null>(null);
  const startRef = useRef({ lat: center.lat, lng: center.lng, zoom });
  const handlers = useRef({ onSelect, onDeselect });
  const itemsRef = useRef<readonly (MapPoint & { id: string })[]>([]);
  const [tiles, setTiles] = useState<TileStatus>('loading');
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const [popupHost, setPopupHost] = useState<HTMLElement | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const full = interaction === 'full';
  const hasPopup = Boolean(renderPopup);

  useEffect(() => {
    handlers.current = { onSelect, onDeselect };
  }, [onSelect, onDeselect]);

  // The map is created once; the effects below follow later changes to the props.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const start = startRef.current;
    const still = reducedMotion();
    const map = L.map(container, {
      center: [start.lat, start.lng],
      zoom: start.zoom,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interaction === 'full',
      dragging: interaction === 'full' || !L.Browser.mobile,
      zoomAnimation: !still,
      fadeAnimation: !still,
      markerZoomAnimation: !still,
    });
    map.createPane('alignment').style.zIndex = '410';
    map.createPane('zones').style.zIndex = '420';
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
    map.on('click', () => handlers.current.onDeselect?.());
    map.on('popupopen', () => setOpenId(wantedId.current));
    map.on('popupclose', () => {
      setOpenId(null);
      if (!closingByCode.current) handlers.current.onDeselect?.();
    });
    zoneLayerRef.current = L.layerGroup().addTo(map);
    lineLayerRef.current = L.layerGroup().addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    labelLayerRef.current = L.layerGroup().addTo(map);
    const host = document.createElement('div');
    popupRef.current = L.popup({
      className: POPUP_CLASS,
      closeButton: true,
      offset: [0, -14],
      maxWidth: 320,
    }).setContent(host);
    setPopupHost(host);
    mapRef.current = map;
    // Leaflet closes a popup on Escape only while the map itself has focus, not a marker.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && popupRef.current?.isOpen()) map.closePopup(popupRef.current);
    };
    container.addEventListener('keydown', closeOnEscape);
    const markersInMap = markerById.current;
    const zonesInMap = zoneById.current;
    return () => {
      container.removeEventListener('keydown', closeOnEscape);
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      zoneLayerRef.current = null;
      lineLayerRef.current = null;
      labelLayerRef.current = null;
      popupRef.current = null;
      markersInMap.clear();
      zonesInMap.clear();
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
    const existing = markerById.current;
    const wanted = new Set(markers.map((marker) => marker.id));
    for (const [id, entry] of existing) {
      if (wanted.has(id)) continue;
      layer.removeLayer(entry.marker);
      existing.delete(id);
    }
    for (const data of markers) {
      const sig = `${variantOf(data)}|${data.code ?? ''}|${data.label}|${data.lat}|${data.lng}`;
      const previous = existing.get(data.id);
      if (previous?.sig === sig) {
        previous.data = data;
        continue;
      }
      if (previous) layer.removeLayer(previous.marker);
      // A station marker shows its code, so its name starts with it (axe label-content-name-mismatch).
      const name = data.code ? `${data.code} ${data.label}` : data.label;
      const marker = L.marker(latLngOf(data), {
        icon: markerIcon(data),
        title: name,
        alt: name,
        keyboard: true,
        zIndexOffset: zOffsetOf(data),
      });
      marker.on('click', () => handlers.current.onSelect?.(data.id));
      // Leaflet turns Enter into a click only for popups; a marker is a button, so Space works too.
      marker.on('keydown', (event) => {
        const key = (event as L.LeafletKeyboardEvent).originalEvent;
        if (key.key !== 'Enter' && key.key !== ' ') return;
        key.preventDefault();
        handlers.current.onSelect?.(data.id);
      });
      marker.once('add', () => marker.getElement()?.setAttribute('aria-label', name));
      marker.addTo(layer);
      existing.set(data.id, { marker, sig, data });
    }
  }, [markers]);

  // Selection: the halo (a data attribute on the icon) and the stacking order.
  useEffect(() => {
    for (const [id, entry] of markerById.current) {
      const selected = id === selectedId || Boolean(entry.data.selected);
      entry.marker.getElement()?.setAttribute('data-selected', String(selected));
      entry.marker.setZIndexOffset(selected ? SELECTED_Z_OFFSET : zOffsetOf(entry.data));
    }
  }, [markers, selectedId]);

  useEffect(() => {
    const layer = zoneLayerRef.current;
    if (!layer) return;
    const existing = zoneById.current;
    const wanted = new Set(zones.map((zone) => zone.id));
    for (const [id, entry] of existing) {
      if (wanted.has(id)) continue;
      layer.removeLayer(entry.circle);
      existing.delete(id);
    }
    for (const data of zones) {
      const selected = data.id === selectedId || Boolean(data.selected);
      const style: L.PathOptions = {
        weight: selected ? 3 : 2,
        dashArray: selected ? undefined : '6 6',
        fillOpacity: selected ? 0.2 : 0.1,
      };
      const previous = existing.get(data.id);
      if (previous) {
        previous.data = data;
        previous.circle.setLatLng(latLngOf(data)).setRadius(data.radiusM).setStyle(style);
        continue;
      }
      const circle = L.circle(latLngOf(data), {
        ...style,
        radius: data.radiusM,
        pane: 'zones',
        className: 'stroke-warning-600 fill-warning-600 cursor-pointer',
        bubblingMouseEvents: false,
      });
      circle.on('click', () => handlers.current.onSelect?.(data.id));
      circle.addTo(layer);
      existing.set(data.id, { circle, data });
    }
  }, [zones, selectedId]);

  useEffect(() => {
    const layer = lineLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const line of lines) {
      const points = line.points.map(latLngOf);
      L.polyline(points, {
        weight: 4,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'stroke-primary-600',
        pane: 'alignment',
        interactive: false,
      }).addTo(layer);
      for (const point of points) {
        L.circleMarker(point, {
          radius: 4,
          weight: 2,
          fillOpacity: 1,
          className: 'stroke-primary-600 fill-static-white',
          pane: 'alignment',
          interactive: false,
        }).addTo(layer);
      }
    }
  }, [lines]);

  useEffect(() => {
    const layer = labelLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const item of labels) {
      if (zoomLevel < item.minZoom) continue;
      L.marker(latLngOf(item), {
        icon: labelIcon(item),
        interactive: false,
        keyboard: false,
      }).addTo(layer);
    }
  }, [labels, zoomLevel]);

  const selectedItem = selectedId
    ? ([...markers, ...zones].find((item) => item.id === selectedId) ?? null)
    : null;
  const selectedLat = selectedItem?.lat;
  const selectedLng = selectedItem?.lng;

  useEffect(() => {
    itemsRef.current = [...markers, ...zones];
  }, [markers, zones]);

  // The popup follows the selection.
  useEffect(() => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;
    closingByCode.current = true;
    if (selectedId && hasPopup && selectedLat !== undefined && selectedLng !== undefined) {
      wantedId.current = selectedId;
      popup.setLatLng([selectedLat, selectedLng]).openOn(map);
    } else {
      map.closePopup(popup);
    }
    closingByCode.current = false;
  }, [selectedId, selectedLat, selectedLng, hasPopup]);

  // "View on map": pan to the item and open its popup, every time `focusKey` changes.
  useEffect(() => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup || !focusId) return;
    const target = itemsRef.current.find((item) => item.id === focusId);
    if (!target) return;
    const still = reducedMotion();
    map.setView(latLngOf(target), Math.max(map.getZoom(), FOCUS_ZOOM), {
      animate: !still,
      duration: still ? 0 : PAN_SECONDS,
      easeLinearity: 0.25,
    });
    if (!hasPopup) return;
    closingByCode.current = true;
    wantedId.current = target.id;
    popup.setLatLng(latLngOf(target)).openOn(map);
    closingByCode.current = false;
  }, [focusId, focusKey, hasPopup]);

  // The popup grows or shrinks with the content React puts in it.
  useEffect(() => {
    popupRef.current?.update();
  }, [openId, popupHost]);

  function centreMap() {
    const map = mapRef.current;
    if (!map) return;
    const still = reducedMotion();
    const motion = { animate: !still, duration: still ? 0 : PAN_SECONDS };
    if (resetBounds && resetBounds.length > 0) {
      map.fitBounds(L.latLngBounds(resetBounds.map(latLngOf)), {
        ...motion,
        paddingTopLeft: FIT_PADDING,
        paddingBottomRight: FIT_PADDING,
      });
      return;
    }
    map.setView([center.lat, center.lng], zoom, motion);
  }

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
      <MapControls
        large={full}
        zoomInDisabled={zoomLevel >= MAX_ZOOM}
        zoomOutDisabled={zoomLevel <= MIN_ZOOM}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        centreLabel={centreLabel}
        onCentre={centreMap}
      />
      <p className="absolute right-0 bottom-0 z-20 rounded-tl-md bg-surface px-2 py-0.5 type-body-xs text-gray-700">
        <ExternalLink href={uiCopy.map.attributionHref} className="hit-area text-gray-700">
          {uiCopy.map.attribution}
        </ExternalLink>
      </p>
      {popupHost && openId && renderPopup ? createPortal(renderPopup(openId), popupHost) : null}
    </>
  );
}
