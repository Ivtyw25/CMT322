import { cn } from '@/lib/cn';

/** Where the swipe row stops: 640 px (`sm`) or 768 px (`md`, default). */
type SwipeRowFrom = 'sm' | 'md';

const STATIC_FROM: Record<SwipeRowFrom, string> = {
  sm: 'sm:mx-0 sm:my-0 sm:snap-none sm:overflow-visible sm:px-0 sm:py-0 sm:*:w-auto sm:*:shrink',
  md: 'md:mx-0 md:my-0 md:snap-none md:overflow-visible md:px-0 md:py-0 md:*:w-auto md:*:shrink',
};

type SwipeRowProps = {
  /** Width where the swipe row becomes a static list. */
  from?: SwipeRowFrom;
  /** Layout from `from` up (e.g. `sm:grid sm:grid-cols-2`). */
  wideClassName?: string;
  children: React.ReactNode;
};

/**
 * Phones: a horizontal swipe row that bleeds to the screen edges, snaps each item to the 20 px
 * gutter and lets the next one peek. Native scrolling, so keyboard focus scrolls items into view
 * and there is no smooth-scroll to reduce. From `from` the list is laid out by `wideClassName`.
 * Items are `SwipeRowItem`s.
 */
export function SwipeRow({ from = 'md', wideClassName, children }: SwipeRowProps) {
  return (
    <ul
      className={cn(
        '-mx-5 -my-1 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 py-1',
        'scrollbar-none',
        STATIC_FROM[from],
        wideClassName,
      )}
    >
      {children}
    </ul>
  );
}
