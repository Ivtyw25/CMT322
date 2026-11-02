import type { Metadata } from 'next';
import { Suspense } from 'react';
import { trafficCopy } from '@/content/traffic';
import { PanelSkeleton } from '@/features/traffic/panel-skeleton';
import { toRouteStation } from '@/features/traffic/route-station';
import { RouteView } from '@/features/traffic/route-view';
import { loadTrafficData } from '@/features/traffic/traffic-data';

export const metadata: Metadata = {
  title: trafficCopy.route.meta.title,
  description: trafficCopy.route.meta.description,
};

export default async function TrafficRoutePage() {
  const { entries, stations, updatedAt } = await loadTrafficData();
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <RouteView entries={entries} stations={stations.map(toRouteStation)} updatedAt={updatedAt} />
    </Suspense>
  );
}
