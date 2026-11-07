'use client';

import { SearchBar } from '@/components/ui/search-bar';
import { useId, useState } from 'react';
import { trafficCopy } from '@/content/traffic';
import { normaliseQuery } from '@/lib/search/normalise';
import { cn } from '@/lib/cn';
import type { RouteStation } from './route-station';

const MAX_OPTIONS = 6;
export const STATION_SEARCH_ID = 'station-search';

type StationSearchProps = {
  stations: readonly RouteStation[];
  onSelect: (code: string) => void;
};

function matchStations(stations: readonly RouteStation[], rawQuery: string): RouteStation[] {
  const query = normaliseQuery(rawQuery);
  if (query === '') return [];
  return stations
    .filter(
      (station) =>
        station.code.toLowerCase().includes(query) ||
        normaliseQuery(station.name).includes(query) ||
        normaliseQuery(station.subtitle ?? '').includes(query),
    )
    .slice(0, MAX_OPTIONS);
}

/** "Search a station": a combobox with a list of up to six stations in line order. */
export function StationSearch({ stations, onSelect }: StationSearchProps) {
  const copy = trafficCopy.route.search;
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = matchStations(stations, query);
  const expanded = open && matches.length > 0;
  const noMatch = open && query.trim() !== '' && matches.length === 0;

  function choose(station: RouteStation) {
    setQuery('');
    setOpen(false);
    onSelect(station.code);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (matches.length === 0) return;
      setOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : matches.length - 1;
      setActive((current) => (current + step) % matches.length);
    } else if (event.key === 'Enter') {
      const station = expanded ? matches[active] : undefined;
      if (station) {
        event.preventDefault();
        choose(station);
      }
    } else if (event.key === 'Escape' && open) {
      // The first press only closes the list; the next clears the field (SearchBar).
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <SearchBar
      label={trafficCopy.map.filters.stationSearch.label}
      placeholder={trafficCopy.map.filters.stationSearch.placeholder}
      value={query}
      onValueChange={(next) => {
        setQuery(next);
        setActive(0);
        setOpen(next !== '');
      }}
      onSubmit={() => {
        const station = matches[active] ?? matches[0];
        if (station) choose(station);
      }}
      inputProps={{
        id: STATION_SEARCH_ID,
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': expanded,
        'aria-controls': listId,
        'aria-activedescendant': expanded ? `${listId}-${active}` : undefined,
        onFocus: () => setOpen(query !== ''),
        onBlur: () => setOpen(false),
        onKeyDown,
      }}
    >
      <ul
        id={listId}
        role="listbox"
        aria-label={copy.listLabel}
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-30 mt-1 flex flex-col gap-0.5 rounded-xl border border-gray-200 bg-surface p-1.5 shadow-panel"
      >
        {matches.map((station, index) => (
          <li
            key={station.code}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(station)}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2',
              index === active ? 'bg-primary-50' : 'hover:bg-gray-50',
            )}
          >
            <span className="rounded-md bg-primary-600 px-1.5 py-0.5 type-body-xs-semibold text-static-white">
              {station.code}
            </span>
            <span className="flex flex-col">
              <span className="type-body-s-semibold text-gray-900">{station.name}</span>
              {station.subtitle ? (
                <span className="type-body-xs text-gray-600">{station.subtitle}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {noMatch ? (
        <div className="absolute inset-x-0 top-full z-30 mt-1 flex flex-col gap-0.5 rounded-xl border border-gray-200 bg-surface p-3 shadow-panel">
          <p className="type-body-s-semibold text-gray-900">{copy.noMatchTitle(query.trim())}</p>
          <p className="type-body-xs text-gray-600">{copy.noMatchHint}</p>
        </div>
      ) : null}
      <p role="status" className="sr-only">
        {open && query.trim() !== '' ? copy.count(matches.length) : ''}
      </p>
    </SearchBar>
  );
}
