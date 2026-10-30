'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { FaqCategory, FaqItem } from '@/data/models/faq';
import { FaqView, type FaqUrlState } from './faq-view';

type FaqExplorerProps = {
  categories: readonly FaqCategory[];
  items: readonly FaqItem[];
  mostAsked: readonly FaqItem[];
};

const noUrlState: FaqUrlState = { topic: null, all: false, query: '' };

function FaqViewFromUrl(props: FaqExplorerProps) {
  const params = useSearchParams();
  const topic = params.get('topic');
  const url: FaqUrlState = {
    topic: props.categories.some((category) => category.id === topic) ? topic : null,
    all: params.get('view') === 'all',
    query: params.get('q') ?? '',
  };
  return <FaqView {...props} url={url} />;
}

/**
 * The FAQ page body. It reads `?q=`, `?topic=` and `?view=` in the browser, so the route stays
 * static; until then the plain "most asked" view is what the server renders.
 */
export function FaqExplorer(props: FaqExplorerProps) {
  return (
    <Suspense fallback={<FaqView {...props} url={noUrlState} />}>
      <FaqViewFromUrl {...props} />
    </Suspense>
  );
}
