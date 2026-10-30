'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/cn';
import { MapPlaceholder } from './map-placeholder';
import type { LocationMapProps } from './map-types';

export type { LocationMapProps, MapMarker, MapPoint } from './map-types';

const MapCanvas = dynamic(() => import('./map-canvas').then((module) => module.MapCanvas), {
  ssr: false,
  loading: () => <MapPlaceholder className="size-full" />,
});

/**
 * An OpenStreetMap map (Leaflet), loaded in the browser only. The © OpenStreetMap contributors
 * credit is always visible. Give it a size with `className`, e.g. `h-95 rounded-2xl`.
 */
export function LocationMap({ className, ...props }: LocationMapProps) {
  return (
    <div className={cn('relative isolate overflow-hidden border border-gray-200', className)}>
      <MapCanvas {...props} />
    </div>
  );
}
