import { MapPin, Road, SearchX, TrainFront, type LucideIcon } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import type { SearchEntry, SearchEntryKind } from '@/data/models/search';
import { cn } from '@/lib/cn';
import type { SearchGroup, SearchMatch } from './search-match';

export const SEARCH_LISTBOX_ID = 'home-search-listbox';
export const SEARCH_PANEL_ID = 'home-search-panel';

export function searchOptionId(entry: SearchEntry): string {
  return `home-search-option-${entry.id}`;
}

const KIND_ICON: Record<SearchEntryKind, LucideIcon> = {
  station: TrainFront,
  road: Road,
  area: MapPin,
};

type SearchPanelProps = {
  groups: readonly SearchGroup[];
  query: string;
  stationCount: number;
  activeId: string | undefined;
  maxHeight: number;
  onActivate: (id: string) => void;
  onSelect: (entry: SearchEntry) => void;
};

/** Label with the first match in bold. */
function MatchedLabel({ match }: { match: SearchMatch }) {
  const { label } = match.entry;
  const { highlight } = match;
  if (!highlight) return label;
  return (
    <>
      {label.slice(0, highlight.start)}
      <mark className="bg-transparent font-bold text-inherit">
        {label.slice(highlight.start, highlight.end)}
      </mark>
      {label.slice(highlight.end)}
    </>
  );
}

function Option({
  match,
  active,
  onActivate,
  onSelect,
}: {
  match: SearchMatch;
  active: boolean;
  onActivate: (id: string) => void;
  onSelect: (entry: SearchEntry) => void;
}) {
  const { entry } = match;
  const Icon = KIND_ICON[entry.kind];
  const id = searchOptionId(entry);
  return (
    <div
      role="option"
      id={id}
      aria-selected={active}
      onMouseMove={() => {
        if (!active) onActivate(id);
      }}
      onClick={() => onSelect(entry)}
      className={cn(
        'flex min-h-15 cursor-pointer items-center gap-3 border-l-3 py-2.5 pr-4 pl-3.25',
        active ? 'border-primary-600 bg-primary-50' : 'border-transparent',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          active ? 'bg-surface text-primary-700' : 'bg-gray-100 text-gray-700',
        )}
      >
        <Icon className="size-4.5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="type-body-s text-gray-900">
          <MatchedLabel match={match} />
        </span>
        <span className="type-body-xs text-gray-500">{entry.detail}</span>
      </span>
    </div>
  );
}

/** The suggestions under the hero search box: grouped options, or the no-results block. */
export function SearchPanel({
  groups,
  query,
  stationCount,
  activeId,
  maxHeight,
  onActivate,
  onSelect,
}: SearchPanelProps) {
  const copy = homeCopy.search;
  return (
    <div
      id={SEARCH_PANEL_ID}
      onMouseDown={(event) => event.preventDefault()}
      style={{ maxHeight }}
      className={cn(
        'absolute inset-x-0 top-full z-20 mt-2 overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-surface py-2 shadow-suggestions',
        'transition-[opacity,translate] duration-(--duration-fast) ease-(--ease-enter)',
        'motion-reduce:transition-none starting:-translate-y-1 starting:opacity-0',
      )}
    >
      {groups.length > 0 ? (
        <div role="listbox" id={SEARCH_LISTBOX_ID} aria-label={copy.suggestionsLabel}>
          {groups.map((group) => {
            const headingId = `home-search-group-${group.kind}`;
            return (
              <div key={group.kind} role="group" aria-labelledby={headingId}>
                <div id={headingId} className="px-4 py-2 type-body-xs-semibold text-gray-500">
                  {copy.groups[group.kind]}
                </div>
                {group.matches.map((match) => (
                  <Option
                    key={match.entry.id}
                    match={match}
                    active={searchOptionId(match.entry) === activeId}
                    onActivate={onActivate}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-1 px-4 py-3">
          <SearchX aria-hidden className="size-5 text-gray-400" />
          <p className="type-body-s-semibold text-gray-900">{uiCopy.empty.noResults(query)}</p>
          <p className="type-body-xs text-gray-500">{uiCopy.empty.noResultsHint}</p>
          <div className="flex flex-wrap gap-x-4">
            <ButtonLink variant="ghost" href={copy.noResultsLinks.stations.href}>
              {copy.noResultsLinks.stations.label(stationCount)}
            </ButtonLink>
            <ButtonLink variant="ghost" href={copy.noResultsLinks.trafficMap.href}>
              {copy.noResultsLinks.trafficMap.label}
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
