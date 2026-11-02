import { Calendar, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { cn } from '@/lib/cn';
import type { EmptyCause } from './traffic-filters';
import type { TrafficEntry } from './traffic-entry';

const cardClass =
  'flex w-full flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors duration-(--duration-fast) ease-(--ease-standard)';

function CardBody({ entry }: { entry: TrafficEntry }) {
  return (
    <>
      <Tag kind={entry.layer} />
      <span className="type-body-s-semibold text-gray-900">{entry.title}</span>
      <span className="type-body-xs text-gray-600">{entry.brief}</span>
      <span className="flex items-center gap-1.5 type-body-xs text-gray-600">
        <Calendar aria-hidden className="size-3.5 shrink-0 text-gray-500" />
        {entry.dateText}
      </span>
    </>
  );
}

type RoadChangeListProps = {
  headingId: string;
  title: string;
  label: string;
  entries: readonly TrafficEntry[];
  /** Map view: a button per item that selects it. Route view: a link to the map. */
  mode: 'select' | 'link';
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  emptyText: string;
  onClearFilters: () => void;
};

/** The list of road changes under the panel filters (Figma 1:843). Items show in the order given. */
export function RoadChangeList({
  headingId,
  title,
  label,
  entries,
  mode,
  selectedId,
  onSelect,
  emptyText,
  onClearFilters,
}: RoadChangeListProps) {
  const copy = trafficCopy.map.filters;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} tabIndex={-1} className="type-body-s-semibold text-gray-900">
        {title}
      </h2>
      {entries.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg bg-gray-50 p-4">
          <SearchX aria-hidden className="size-5 text-gray-400" />
          <p className="type-body-s-semibold text-gray-900">{copy.noMatch.title}</p>
          <p className="type-body-s text-gray-600">{emptyText}</p>
          <Button variant="ghost" onClick={onClearFilters}>
            {copy.clearFilters}
          </Button>
        </div>
      ) : (
        <ul
          aria-label={label}
          className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-3 lg:flex lg:gap-1"
        >
          {entries.map((entry) => (
            <li key={entry.id}>
              {mode === 'select' ? (
                <button
                  type="button"
                  id={`road-change-${entry.id}`}
                  aria-pressed={selectedId === entry.id}
                  onClick={() => onSelect?.(entry.id)}
                  className={cn(
                    cardClass,
                    'hit-area cursor-pointer',
                    selectedId === entry.id
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-transparent hover:bg-gray-50',
                  )}
                >
                  <CardBody entry={entry} />
                </button>
              ) : (
                <Link
                  href={routes.traffic.mapFocus(entry.id)}
                  className={cn(cardClass, 'border-transparent hover:bg-gray-50')}
                >
                  <CardBody entry={entry} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Words for an empty list, by what caused it. */
export function emptyTextOf(cause: EmptyCause): string {
  const copy = trafficCopy.map.filters.noMatch;
  if (cause === 'range') return copy.range;
  if (cause === 'layers') return copy.layers;
  return copy.text;
}
