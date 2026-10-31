'use client';

import { Search, SearchX, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import { Button } from '@/components/ui/button';
import { controlVariants } from '@/components/ui/control-styles';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { useFollowedStations } from '@/lib/follows';
import { MatchText } from './match-text';
import { isCodeQuery, searchStations } from './station-search';

export type ListedStation = Pick<
  Station,
  'code' | 'name' | 'subtitle' | 'isProvisionalName' | 'area'
>;

const { stations: copy } = projectCopy;
const URL_DELAY_MS = 300;
const ANNOUNCE_DELAY_MS = 300;

function writeQuery(query: string) {
  const search = query ? `?${new URLSearchParams({ q: query }).toString()}` : '';
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${search}`);
}

/** The search field and the line rail of stations. The query lives in the URL as `?q=`. */
export function StationsView({
  stations,
  initialQuery,
  segments,
}: {
  stations: readonly ListedStation[];
  initialQuery: string;
  /** The line segments card, rendered on the server and shown between the field and the list. */
  segments: React.ReactNode;
}) {
  const router = useRouter();
  const announce = useAnnounce();
  const { isFollowing } = useFollowedStations();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [query, setQuery] = useState(initialQuery);

  // Back and forward change the address from outside: follow it.
  const [seen, setSeen] = useState(initialQuery);
  if (seen !== initialQuery) {
    setSeen(initialQuery);
    setQuery(initialQuery);
  }

  // A browser may restore the field's text without telling React.
  useEffect(() => {
    const restored = inputRef.current?.value ?? '';
    if (restored && restored !== initialQuery) setQuery(restored);
  }, [initialQuery]);

  const trimmed = query.trim();
  const matches = searchStations(stations, trimmed);
  const highlight = isCodeQuery(trimmed) ? '' : trimmed;

  const message =
    trimmed && matches.length === 0
      ? copy.search.noResultsStatus(trimmed)
      : copy.search.results(matches.length, stations.length);
  const firstMessage = useRef(true);
  useEffect(() => {
    if (firstMessage.current) {
      firstMessage.current = false;
      return;
    }
    const timer = setTimeout(() => announce(message), ANNOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [message, announce]);

  useEffect(() => () => clearTimeout(urlTimer.current), []);

  function changeQuery(next: string) {
    setQuery(next);
    clearTimeout(urlTimer.current);
    if (next.trim() === '') {
      writeQuery('');
      return;
    }
    urlTimer.current = setTimeout(() => writeQuery(next.trim()), URL_DELAY_MS);
  }

  function clearAndFocus() {
    changeQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="search" className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-3.5 left-3.5 size-4.5 text-gray-400"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          aria-label={copy.search.label}
          placeholder={copy.search.placeholder}
          enterKeyHint="search"
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => changeQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              const only = matches.length === 1 ? matches[0] : undefined;
              if (only) router.push(routes.project.station(only.code));
            }
            if (event.key === 'Escape' && query) {
              event.preventDefault();
              changeQuery('');
            }
          }}
          className={cn(
            controlVariants({ tone: 'default' }),
            'h-12.5 rounded-xl pl-10 type-body-s md:type-body-m',
            query ? 'pr-12' : 'pr-4',
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label={uiCopy.actions.clearSearch}
            onClick={clearAndFocus}
            className="hit-area absolute top-1.5 right-2 flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>

      {segments}

      <section aria-labelledby="station-list-heading" className="md:pt-4">
        <h2 id="station-list-heading" className="sr-only">
          {copy.list.heading}
        </h2>
        {matches.length > 0 ? (
          <LineRail variant="list" label={copy.list.label}>
            {matches.map((station) => (
              <LineRailStop
                key={station.code}
                variant="list"
                code={station.code}
                title={<MatchText text={station.name} query={highlight} />}
                description={
                  station.subtitle ? (
                    <MatchText text={station.subtitle} query={highlight} />
                  ) : station.isProvisionalName ? (
                    uiCopy.station.provisionalName
                  ) : undefined
                }
                following={isFollowing(station.code)}
                href={routes.project.station(station.code)}
              />
            ))}
          </LineRail>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 px-6 py-10 text-center">
            <SearchX aria-hidden className="size-6 text-gray-400" />
            <p className="type-body-m-semibold text-gray-900">
              {trimmed ? copy.search.emptyTitle(trimmed) : copy.search.emptyNoQuery}
            </p>
            <p className="type-body-s text-gray-600">{copy.search.emptyBody}</p>
            <Button variant="secondary" onClick={clearAndFocus}>
              {copy.search.showAll}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
