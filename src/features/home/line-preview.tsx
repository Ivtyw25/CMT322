'use client';

import { Map, Route } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FitToWidth } from '@/components/patterns/fit-to-width';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { homeCopy } from '@/content/home';
import { cn } from '@/lib/cn';
import {
  DIAGRAM_HEIGHT,
  DIAGRAM_WIDTH,
} from '@/components/patterns/line-diagram/line-diagram-layout';
import type { MapStation } from './line-map-data';
import { LineMapLoading } from './line-map-loading';
import { SectionHeader } from './section-frame';

type LineView = 'route' | 'map';

/** Leaflet and its tiles load only when Map view is first chosen. */
const LineMap = dynamic(() => import('./line-map').then((module) => module.LineMap), {
  ssr: false,
  loading: () => <LineMapLoading className="h-120 rounded-3xl border border-gray-200 lg:h-150" />,
});

type LinePreviewProps = {
  /** The section heading, drawn here so the Route / Map toggle sits in its row. */
  headingId: string;
  title: string;
  lede: string;
  /** Zigzag line (server-rendered), shown below 1280 px. */
  zigzag: React.ReactNode;
  /** Logical diagram (server-rendered), shown from 1280 px. */
  diagram: React.ReactNode;
  mapStations: readonly MapStation[];
};

/**
 * The section header and line preview. The Route / Map toggle sits right of the heading from 768 px; Route
 * view is the zigzag below 1280 px and the diagram from 1280 px. Phones have the zigzag only.
 */
export function LinePreview({
  headingId,
  title,
  lede,
  zigzag,
  diagram,
  mapStations,
}: LinePreviewProps) {
  const copy = homeCopy.line;
  const [view, setView] = useState<LineView>('route');
  const [mapOpened, setMapOpened] = useState(false);

  function choose(next: LineView) {
    setView(next);
    if (next === 'map') setMapOpened(true);
  }

  const toggle = (
    <SegmentedControl
      legend={copy.viewToggle.label}
      value={view}
      onValueChange={choose}
      options={[
        { value: 'route', label: copy.viewToggle.route, icon: <Route className="size-4" /> },
        { value: 'map', label: copy.viewToggle.map, icon: <Map className="size-4" /> },
      ]}
    />
  );

  return (
    <>
      <SectionHeader headingId={headingId} title={title} lede={lede} action={toggle} actionFromMd />
      <figure aria-label={copy.title} className="flex flex-col gap-4 md:gap-5">
        <div
          className={cn(
            view === 'map' && 'md:hidden',
            'animate-[fade-in_150ms_ease-out] motion-reduce:animate-none',
          )}
        >
          <div className="xl:hidden">
            <div className="rounded-3xl border border-gray-200 bg-surface p-2 md:p-4">{zigzag}</div>
          </div>
          <div className="hidden xl:block">
            <div className="rounded-3xl border border-gray-200 bg-surface p-6">
              <FitToWidth width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} minScale={0.8}>
                {diagram}
              </FitToWidth>
            </div>
          </div>
        </div>
        {mapOpened ? (
          <div className={cn('hidden', view === 'map' && 'md:block')}>
            <LineMap stations={mapStations} />
          </div>
        ) : null}
      </figure>
    </>
  );
}
