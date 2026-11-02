'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { StationsView, type ListedStation } from './stations-view';

type ExplorerProps = { stations: readonly ListedStation[]; segments: React.ReactNode };

function StationsViewFromUrl({ stations, segments }: ExplorerProps) {
  const query = useSearchParams().get('q') ?? '';
  return <StationsView stations={stations} initialQuery={query} segments={segments} />;
}

/**
 * The search and station list. It reads `?q=` in the browser, so the route stays static; until
 * then the server renders the full list.
 */
export function StationsExplorer({ stations, segments }: ExplorerProps) {
  return (
    <Suspense fallback={<StationsView stations={stations} initialQuery="" segments={segments} />}>
      <StationsViewFromUrl stations={stations} segments={segments} />
    </Suspense>
  );
}
