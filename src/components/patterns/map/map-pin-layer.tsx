'use client';

import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import type { MapPinOptions, MapPoint } from './map-types';

const METRES_PER_DEGREE = 111_320;
const NUDGE_M = 10;
const NUDGE_SHIFT_M = 50;

const ARROW_STEP = {
  ArrowUp: [1, 0],
  ArrowDown: [-1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
} as const;

type ArrowKey = keyof typeof ARROW_STEP;

function isArrowKey(key: string): key is ArrowKey {
  return key in ARROW_STEP;
}

/** A point `metres` away from `from`; `north` and `east` are -1, 0 or 1. */
function nudged(from: MapPoint, north: number, east: number, metres: number): MapPoint {
  const latRadians = (from.lat * Math.PI) / 180;
  return {
    lat: from.lat + (north * metres) / METRES_PER_DEGREE,
    lng: from.lng + (east * metres) / (METRES_PER_DEGREE * Math.cos(latRadians)),
  };
}

const PIN_SVG =
  '<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>';

function pinIcon(): L.DivIcon {
  const element = document.createElement('span');
  element.className =
    'flex size-10 items-center justify-center rounded-full border-2 border-static-white bg-primary-600 text-static-white shadow-control';
  element.innerHTML = PIN_SVG;
  return L.divIcon({
    html: element,
    className:
      'flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

type MapPinLayerProps = { map: L.Map | null; pin: MapPinOptions };

/**
 * The report-location pin of `LocationMap`: a click or tap places it, it can be dragged, and the
 * arrow keys nudge it 10 m (Shift: 50 m). A "drop a pin at the map centre" icon button gives keyboard users a way to create the first
 * pin.
 */
export function MapPinLayer({ map, pin }: MapPinLayerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const latest = useRef(pin);

  useEffect(() => {
    latest.current = pin;
  }, [pin]);

  // A click or tap on the map places the pin.
  useEffect(() => {
    if (!map) return;
    const place = (event: L.LeafletMouseEvent) =>
      latest.current.onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    map.on('click', place);
    return () => {
      map.off('click', place);
    };
  }, [map]);

  const lat = pin.point?.lat;
  const lng = pin.point?.lng;

  // The marker follows the pin: created on the first point, moved after, removed when cleared.
  useEffect(() => {
    if (!map) return;
    if (lat === undefined || lng === undefined) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    const name = latest.current.label({ lat, lng });
    let marker = markerRef.current;
    if (!marker) {
      const created = L.marker([lat, lng], {
        icon: pinIcon(),
        draggable: true,
        keyboard: true,
        title: name,
        alt: name,
        zIndexOffset: 1000,
      }).addTo(map);
      created.on('dragend', () => {
        const at = created.getLatLng();
        latest.current.onChange({ lat: at.lat, lng: at.lng });
      });
      created.on('keydown', (event) => {
        const key = (event as L.LeafletKeyboardEvent).originalEvent;
        if (!isArrowKey(key.key)) return;
        key.preventDefault();
        key.stopPropagation();
        const at = created.getLatLng();
        const [north, east] = ARROW_STEP[key.key];
        latest.current.onChange(
          nudged({ lat: at.lat, lng: at.lng }, north, east, key.shiftKey ? NUDGE_SHIFT_M : NUDGE_M),
        );
      });
      markerRef.current = created;
      marker = created;
    } else {
      marker.setLatLng([lat, lng]);
    }
    const element = marker.getElement();
    element?.setAttribute('aria-label', name);
    element?.setAttribute('title', name);
  }, [map, lat, lng]);

  useEffect(
    () => () => {
      markerRef.current?.remove();
      markerRef.current = null;
    },
    [],
  );

  return (
    <button
      type="button"
      aria-label={pin.dropLabel}
      title={pin.dropLabel}
      onClick={() => {
        const centre = map?.getCenter();
        if (centre) pin.onChange({ lat: centre.lat, lng: centre.lng });
      }}
      className={cn(
        'hit-area absolute top-3 left-3 z-20 flex size-11 cursor-pointer items-center justify-center rounded-md border border-gray-300 lg:size-7',
        'bg-surface text-gray-700 shadow-control transition-colors duration-(--duration-fast) hover:bg-gray-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
      )}
    >
      <MapPin aria-hidden className="size-4" />
    </button>
  );
}
