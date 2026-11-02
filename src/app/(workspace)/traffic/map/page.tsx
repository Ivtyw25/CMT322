import type { Metadata } from 'next';
import { Suspense } from 'react';
import { trafficCopy } from '@/content/traffic';
import { MapView } from '@/features/traffic/map-view';
import { PanelSkeleton } from '@/features/traffic/panel-skeleton';
import { loadTrafficData } from '@/features/traffic/traffic-data';

export const metadata: Metadata = {
  title: trafficCopy.map.meta.title,
  description: trafficCopy.map.meta.description,
};

export default async function TrafficMapPage() {
  const { entries, stations, alignment, updatedAt } = await loadTrafficData();
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <MapView
        entries={entries}
        stations={stations.map(({ code, name, lat, lng }) => ({ code, name, lat, lng }))}
        alignment={alignment}
        updatedAt={updatedAt}
      />
    </Suspense>
  );
}
