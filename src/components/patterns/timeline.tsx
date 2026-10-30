import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

export type TimelineEntry = {
  id: string;
  /** Date text as shown, e.g. "Jan 2027". Empty for the Today marker. */
  date: string;
  text: string;
  /** `today` is the marker between past and future entries; its `text` is ignored. */
  state: 'past' | 'today' | 'future';
};

type TimelineProps = {
  items: readonly TimelineEntry[];
  /** Lay the entries out in a row from 1024 px up (Construction milestones). Vertical below. */
  horizontalFromLg?: boolean;
  className?: string;
};

/** Milestones on a line. Past entries are filled dots, future ones hollow, "Today" is its own item. */
export function Timeline({ items, horizontalFromLg = false, className }: TimelineProps) {
  return (
    <ol className={cn('flex flex-col', horizontalFromLg && 'lg:flex-row lg:gap-4', className)}>
      {items.map((item) => {
        const future = item.state === 'future';
        return (
          <li
            key={item.id}
            className={cn(
              'group flex gap-4 pb-6 last:pb-0',
              horizontalFromLg && 'lg:flex-1 lg:flex-col lg:gap-3 lg:pb-0',
            )}
          >
            <span
              className={cn(
                'w-24 shrink-0 type-body-s-medium tabular-nums',
                future ? 'text-gray-500' : 'text-gray-900',
                horizontalFromLg && 'lg:order-2 lg:w-auto',
              )}
            >
              {item.date}
            </span>
            <span
              aria-hidden
              className={cn(
                'relative flex w-5 shrink-0 justify-center',
                horizontalFromLg && 'lg:order-1 lg:h-5 lg:w-full lg:items-center lg:justify-start',
              )}
            >
              <span
                className={cn(
                  'absolute top-2.5 -bottom-8.5 left-1/2 w-0.5 -translate-x-1/2 group-last:hidden',
                  future ? 'bg-gray-300' : 'bg-primary-600',
                  horizontalFromLg &&
                    'lg:top-1/2 lg:right-[-1rem] lg:bottom-auto lg:left-2.5 lg:h-0.5 lg:w-auto lg:translate-x-0 lg:-translate-y-1/2',
                )}
              />
              <span
                className={cn(
                  'relative z-10 mt-1 size-3 rounded-full border-2 border-primary-600',
                  item.state === 'past' || item.state === 'today' ? 'bg-primary-600' : 'bg-surface',
                  future && 'border-gray-400',
                  horizontalFromLg && 'lg:mt-0',
                )}
              />
            </span>
            <span className={cn('flex-1', horizontalFromLg && 'lg:order-3')}>
              {item.state === 'today' ? (
                <span className="inline-flex rounded-full bg-primary-600 px-2.5 py-0.5 type-body-xs-semibold text-static-white">
                  {uiCopy.time.today}
                </span>
              ) : (
                <span className={cn('type-body-s', future ? 'text-gray-500' : 'text-gray-700')}>
                  {item.text}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
