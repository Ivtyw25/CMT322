'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ConstructionDocs } from './construction-docs';

type ExplorerProps = Omit<React.ComponentProps<typeof ConstructionDocs>, 'url'>;

function ConstructionFromUrl(props: ExplorerProps) {
  const params = useSearchParams();
  return (
    <ConstructionDocs
      {...props}
      url={{ phase: params.get('phase') ?? 'all', area: params.get('area') ?? 'all' }}
    />
  );
}

/**
 * The Construction progress page. It reads `?phase=` and `?area=` in the browser, so the route
 * stays static; until then the server renders the unfiltered list.
 */
export function ConstructionExplorer(props: ExplorerProps) {
  return (
    <Suspense fallback={<ConstructionDocs {...props} url={{ phase: 'all', area: 'all' }} />}>
      <ConstructionFromUrl {...props} />
    </Suspense>
  );
}
