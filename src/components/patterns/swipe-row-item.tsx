import { cn } from '@/lib/cn';

type SwipeRowItemProps = {
  /** Item width on phones; the default shows the next card peeking. */
  className?: string;
  children: React.ReactNode;
};

/** One snap stop of a `SwipeRow`; `SwipeRow` makes it a full grid cell from its `from` width. */
export function SwipeRowItem({ className, children }: SwipeRowItemProps) {
  return <li className={cn('w-4/5 shrink-0 snap-start', className)}>{children}</li>;
}
