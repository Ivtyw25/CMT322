'use client';

import { Map, Route } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useId, useState } from 'react';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { homeCopy } from '@/content/home';
import { cn } from '@/lib/cn';
import type { MapStation } from './line-map-data';

type LineView = 'route' | 'map';

/** Leaflet and its tiles load only when Map view is first chosen. */
const LineMap = dynamic(() => import('./line-map').then((module) => module.LineMap), {
  ssr: false,
});

type LinePreviewProps = {
  /** Vertical line rail (server-rendered). */
  rail: React.ReactNode;
  /** Logical diagram (server-rendered), shown from 1280 px. */
  diagram: React.ReactNode;
  mapStations: readonly MapStation[];
};

/**
 * The line preview. Phones: the rail only. From 768 px: caption and Route / Map toggle, then the
 * rail (up to 1279 px), the diagram (1280 px and up) or the map.
 */
export function LinePreview({ rail, diagram, mapStations }: LinePreviewProps) {
  const copy = homeCopy.line;
  const captionId = useId();
  const [view, setView] = useState<LineView>('route');
  const [mapOpened, setMapOpened] = useState(false);

  function choose(next: LineView) {
    setView(next);
    if (next === 'map') setMapOpened(true);
  }

  return (
    <figure aria-labelledby={captionId} className="flex flex-col gap-4 md:gap-5">
      <div className="hidden items-center justify-between gap-4 md:flex">
        <p id={captionId} className="type-body-s text-gray-600">
          {view === 'route' ? copy.captions.route : copy.captions.map}
        </p>
        <SegmentedControl
          legend={copy.viewToggle.label}
          value={view}
          onValueChange={choose}
          options={[
            {
              value: 'route',
              label: copy.viewToggle.route,
              icon: <Route className="size-4" />,
            },
            { value: 'map', label: copy.viewToggle.map, icon: <Map className="size-4" /> },
          ]}
        />
      </div>
      <div
        className={cn(
          view === 'map' && 'md:hidden',
          'animate-[fade-in_150ms_ease-out] motion-reduce:animate-none',
        )}
      >
        <div className="xl:hidden">
          <div className="rounded-3xl md:max-w-140 md:border md:border-gray-200 md:bg-surface md:p-3">
            {rail}
          </div>
        </div>
        <div className="hidden xl:block">
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-surface p-6">
            {diagram}
          </div>
        </div>
      </div>
      {mapOpened ? (
        <div className={cn('hidden', view === 'map' && 'md:block')}>
          <LineMap stations={mapStations} />
        </div>
      ) : null}
    </figure>
  );
}
