'use client';

import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import type { SearchEntry } from '@/data/models/search';
import { cn } from '@/lib/cn';
import { MIN_QUERY_LENGTH, matchEntries, normaliseQuery } from './search-match';
import { SEARCH_LISTBOX_ID, SEARCH_PANEL_ID, SearchPanel, searchOptionId } from './search-panel';
import { revealWorks, scrollBehavior } from './works-anchor';

const MAX_QUERY_LENGTH = 60;
const PANEL_MAX_HEIGHT = 400;
const PANEL_MIN_HEIGHT = 160;
const PANEL_VIEWPORT_GAP = 16;
const ANNOUNCE_DELAY_MS = 500;
const PHONE_HEADER_HEIGHT = 61;
/** Where the box sits when the phone keyboard opens: 12 px under the mobile header. */
const PHONE_BOX_TOP = PHONE_HEADER_HEIGHT + 12;

/** Hero search: an ARIA 1.2 combobox over the local search index. See docs/specs/home.md section 2. */
export function HeroSearch({ entries }: { entries: readonly SearchEntry[] }) {
  const copy = homeCopy.search;
  const router = useRouter();
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [pickedId, setPickedId] = useState<string>();
  const [liveMessage, setLiveMessage] = useState('');
  const [maxHeight, setMaxHeight] = useState(PANEL_MAX_HEIGHT);

  const groups = useMemo(() => matchEntries(entries, query), [entries, query]);
  const options = useMemo(
    () => groups.flatMap((group) => group.matches.map((match) => match.entry)),
    [groups],
  );
  const stationCount = useMemo(
    () => entries.filter((entry) => entry.kind === 'station').length,
    [entries],
  );
  const canSearch = normaliseQuery(query).length >= MIN_QUERY_LENGTH;
  const showPanel = open && canSearch;
  const activeEntry = options.find((entry) => searchOptionId(entry) === pickedId) ?? options[0];
  const activeId = showPanel && activeEntry ? searchOptionId(activeEntry) : undefined;
  const resultCount = options.length;

  useEffect(() => {
    if (!showPanel) return undefined;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [showPanel]);

  useEffect(() => {
    if (!showPanel) return undefined;
    const viewport = window.visualViewport;
    const fit = () => {
      const bottom = formRef.current?.getBoundingClientRect().bottom ?? 0;
      const visible = (viewport?.height ?? window.innerHeight) - bottom - PANEL_VIEWPORT_GAP;
      setMaxHeight(Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT, visible)));
    };
    const frame = requestAnimationFrame(fit);
    viewport?.addEventListener('resize', fit);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', fit);
    };
  }, [showPanel]);

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  useEffect(() => {
    let message = '';
    if (showPanel) {
      message = resultCount > 0 ? copy.resultCount(resultCount) : copy.noResultsLive(query.trim());
    }
    const timer = setTimeout(() => setLiveMessage(message), showPanel ? ANNOUNCE_DELAY_MS : 0);
    return () => clearTimeout(timer);
  }, [showPanel, resultCount, query, copy]);

  function select(entry: SearchEntry) {
    setQuery(entry.label);
    setOpen(false);
    setPickedId(undefined);
    if (entry.kind === 'station') {
      router.push(routes.project.station(entry.stationCode));
    } else if (entry.kind === 'road') {
      router.push(routes.traffic.routeAt(entry.stationCode));
    } else {
      router.replace(routes.homeWorksIn(entry.areaId), { scroll: false });
      revealWorks();
    }
  }

  function move(step: 1 | -1) {
    const current = activeEntry ? options.indexOf(activeEntry) : 0;
    const next = options[Math.min(options.length - 1, Math.max(0, current + step))];
    if (next) setPickedId(searchOptionId(next));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!showPanel) {
          if (canSearch) setOpen(true);
        } else if (!event.altKey) {
          move(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) setOpen(false);
        else if (showPanel) move(-1);
        break;
      case 'Enter':
        if (showPanel && activeEntry) {
          event.preventDefault();
          select(activeEntry);
        }
        break;
      case 'Escape':
        if (showPanel) {
          event.preventDefault();
          setOpen(false);
        } else if (query !== '') {
          event.preventDefault();
          setQuery('');
        }
        break;
      case 'Tab':
        if (showPanel && options.length > 0) setOpen(false);
        break;
      default:
    }
  }

  function onFocus() {
    if (canSearch) setOpen(true);
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const top = formRef.current?.getBoundingClientRect().top;
    if (top === undefined || (top >= PHONE_HEADER_HEIGHT && top <= PHONE_BOX_TOP)) return;
    window.scrollTo({ top: window.scrollY + top - PHONE_BOX_TOP, behavior: scrollBehavior() });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    inputRef.current?.focus();
    if (!canSearch) return;
    if (activeEntry) select(activeEntry);
    else setOpen(true);
  }

  function onBlur(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node && wrapperRef.current?.contains(next))) setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative w-full text-left lg:w-140" onBlur={onBlur}>
      <form
        ref={formRef}
        role="search"
        aria-label={copy.formLabel}
        onSubmit={onSubmit}
        className={cn(
          'flex items-center gap-2.5 rounded-xl bg-surface py-1.5 pr-1.5 pl-4 shadow-hero-search',
          'focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-inset',
        )}
      >
        <MapPin aria-hidden className="size-5 shrink-0 text-gray-500" />
        <div className="relative flex min-h-10 min-w-0 flex-1 items-center">
          <label htmlFor={inputId} className="sr-only">
            {copy.hint}
          </label>
          <span
            aria-hidden
            className={cn(
              'pointer-events-none text-left type-body-m text-gray-400',
              query !== '' && 'invisible',
            )}
          >
            {copy.hint}
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showPanel}
            aria-controls={options.length > 0 ? SEARCH_LISTBOX_ID : SEARCH_PANEL_ID}
            aria-activedescendant={activeId}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            maxLength={MAX_QUERY_LENGTH}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setPickedId(undefined);
            }}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            className="absolute inset-0 w-full bg-transparent type-body-m text-gray-900 caret-primary-600 outline-none"
          />
        </div>
        <Button type="submit">{uiCopy.actions.search}</Button>
      </form>
      {showPanel ? (
        <SearchPanel
          groups={groups}
          query={query.trim()}
          stationCount={stationCount}
          activeId={activeId}
          maxHeight={maxHeight}
          onActivate={setPickedId}
          onSelect={select}
        />
      ) : null}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </div>
  );
}
