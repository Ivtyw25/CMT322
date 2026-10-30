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
  /**
   * `vertical` is a list with the rail on the left. `responsive` is vertical below 1280 px and
   * a row from there, where the article is wide enough for the labels (Construction).
   */
  orientation?: 'vertical' | 'responsive';
  className?: string;
};

const pillClass =
  'inline-flex rounded-full bg-primary-600 px-2.5 py-0.5 type-body-xs-semibold whitespace-nowrap text-static-white';

/** Milestones on a line. Past entries are filled dots, future ones hollow, "Today" is its own item. */
export function Timeline({ items, orientation = 'vertical', className }: TimelineProps) {
  const responsive = orientation === 'responsive';
  const hasToday = items.some((item) => item.state === 'today');
  const lastIndex = items.length - 1;

  return (
    <ol
      className={cn(
        'flex flex-col',
        responsive && 'xl:flex-row xl:items-start',
        responsive && hasToday && 'xl:pt-9',
        className,
      )}
    >
      {items.map((item, index) => {
        const future = item.state === 'future';
        const today = item.state === 'today';
        const first = index === 0;
        const last = index === lastIndex;
        const reachesNext = items[index + 1]?.state !== 'future';
        const reachedFromPrevious = !future;
        return (
          <li
            key={item.id}
            className={cn(
              'group flex gap-4 pb-6 last:pb-0',
              responsive && [
                'xl:flex-col xl:gap-3 xl:pb-0',
                today
                  ? 'xl:w-6 xl:flex-none'
                  : first || last
                    ? 'xl:w-16 xl:flex-none'
                    : 'xl:flex-1',
                first && 'xl:items-start',
                last && 'xl:items-end',
                !first && !last && 'xl:items-stretch',
              ],
            )}
          >
            <span
              aria-hidden
              className={cn(
                'relative flex w-5 shrink-0 justify-center',
                responsive && 'xl:h-6 xl:w-full xl:items-center',
                responsive &&
                  (first ? 'xl:justify-start' : last ? 'xl:justify-end' : 'xl:justify-center'),
              )}
            >
              <span
                className={cn(
                  'absolute top-2.5 -bottom-8.5 left-1/2 w-0.5 -translate-x-1/2 group-last:hidden',
                  reachesNext ? 'bg-primary-600' : 'bg-gray-300',
                  responsive && 'xl:hidden',
                )}
              />
              {responsive ? (
                <>
                  {first ? null : (
                    <span
                      className={cn(
                        'absolute hidden xl:block',
                        'top-1/2 right-1/2 left-0 h-1 -translate-y-1/2',
                        reachedFromPrevious
                          ? 'bg-primary-600'
                          : 'h-0 border-t-4 border-dotted border-gray-300',
                      )}
                    />
                  )}
                  {last ? null : (
                    <span
                      className={cn(
                        'absolute hidden xl:block',
                        'top-1/2 right-0 h-1 -translate-y-1/2',
                        first ? 'left-2' : 'left-1/2',
                        reachesNext
                          ? 'bg-primary-600'
                          : 'h-0 border-t-4 border-dotted border-gray-300',
                      )}
                    />
                  )}
                </>
              ) : null}
              <span
                className={cn(
                  'relative z-10 mt-1 size-3 rounded-full border-2 border-primary-600',
                  item.state === 'past' || today ? 'bg-primary-600' : 'bg-surface',
                  future && 'border-gray-400',
                  responsive && 'xl:mt-0 xl:size-4',
                  today &&
                    responsive &&
                    'xl:size-6 xl:border-primary-600 xl:bg-surface xl:ring-4 xl:ring-primary-200',
                )}
              />
              {today && responsive ? (
                <span
                  className={cn(
                    pillClass,
                    'absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 xl:inline-flex',
                  )}
                >
                  {uiCopy.time.today}
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                'flex flex-1 gap-4',
                responsive && 'xl:flex-col xl:gap-1 xl:text-center',
                responsive && first && 'xl:text-left',
                responsive && last && 'xl:text-right',
                responsive && today && 'xl:hidden',
              )}
            >
              {today ? null : (
                <>
                  <span className="sr-only">
                    {future ? uiCopy.timeline.future : uiCopy.timeline.past}
                  </span>
                  <span
                    className={cn(
                      'w-24 shrink-0 type-body-s-semibold tabular-nums md:w-35',
                      future ? 'text-gray-500' : 'text-gray-900',
                      responsive && 'xl:w-auto xl:type-body-xs-semibold',
                    )}
                  >
                    {item.date}
                  </span>
                  <span
                    className={cn(
                      'type-body-s',
                      future ? 'text-gray-500' : 'text-gray-700',
                      responsive && 'xl:type-body-xs xl:text-gray-600',
                      responsive && future && 'xl:text-gray-500',
                    )}
                  >
                    {item.text}
                  </span>
                </>
              )}
              {today ? <span className={pillClass}>{uiCopy.time.today}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
