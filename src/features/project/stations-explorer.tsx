'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { StationsView, type ListedStation } from './stations-view';

function StationsViewFromUrl({ stations }: { stations: readonly ListedStation[] }) {
  const query = useSearchParams().get('q') ?? '';
  return <StationsView stations={stations} initialQuery={query} />;
}

/**
 * The search and station list. It reads `?q=` in the browser, so the route stays static; until
 * then the server renders the full list.
 */
export function StationsExplorer({ stations }: { stations: readonly ListedStation[] }) {
  return (
    <Suspense fallback={<StationsView stations={stations} initialQuery="" />}>
      <StationsViewFromUrl stations={stations} />
    </Suspense>
  );
}
