'use client';

import { Info, SearchX, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Select, type SelectOption } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trafficCopy } from '@/content/traffic';
import { useQueryParams } from '@/lib/url/use-query-params';
import {
  PAGE_SIZE,
  STATUS_FILTERS,
  clampPage,
  countByStatus,
  matchAreaAndQuery,
  matchStatus,
  pageCountOf,
  statusFilterOf,
  type AnnouncementRow,
  type StatusFilter,
} from './announcement-rows';
import { AnnouncementsTable } from './announcements-table';

const copy = trafficCopy.announcements;
const SEARCH_WRITE_MS = 300;
const LIVE_DEBOUNCE_MS = 500;
const MAX_QUERY_LENGTH = 80;
const QUERY_DEFAULTS = { status: 'all', area: '', page: '1' } as const;

const tabLabels: Record<StatusFilter, string> = {
  all: copy.tabs.all,
  current: copy.tabs.current,
  upcoming: copy.tabs.upcoming,
  past: copy.tabs.past,
};

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hashId(): string {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return '';
  }
}

type AnnouncementsBrowserProps = {
  rows: readonly AnnouncementRow[];
  areaOptions: readonly SelectOption[];
};

/** Tabs, filters, results and pager of the announcements page. Filters live in the address. */
export function AnnouncementsBrowser({ rows, areaOptions }: AnnouncementsBrowserProps) {
  const params = useQueryParams(QUERY_DEFAULTS);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = statusFilterOf(params.get('status'));
  const areaParam = params.get('area') ?? '';
  const area = areaOptions.some((option) => option.value === areaParam) ? areaParam : '';
  const [query, setQuery] = useState(() => (params.get('q') ?? '').slice(0, MAX_QUERY_LENGTH));
  const [linkedId, setLinkedId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [live, setLive] = useState('');
  const [scrollTick, setScrollTick] = useState(0);

  const queryRef = useRef(query);
  const writeTimer = useRef<number | null>(null);
  const pendingScroll = useRef<string | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const firstCount = useRef(true);

  const scoped = matchAreaAndQuery(rows, { area, query });
  const counts = countByStatus(scoped);
  const filtered = matchStatus(scoped, status);
  const pageCount = pageCountOf(filtered.length);
  const page = clampPage(params.get('page'), pageCount);
  const first = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(first, first + PAGE_SIZE);
  const visibleKey = visible.map((row) => row.id).join('|');
  const filtersActive = area !== '' || query.trim() !== '';

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(
    () => () => {
      if (writeTimer.current !== null) window.clearTimeout(writeTimer.current);
    },
    [],
  );

  // A polite "{n} announcements found" after the list changes, not on load.
  const count = filtered.length;
  useEffect(() => {
    if (firstCount.current) {
      firstCount.current = false;
      return;
    }
    const timer = window.setTimeout(
      () => setLive(copy.filters.resultCount(count)),
      LIVE_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count]);

  function writeQueryLater(value: string) {
    if (writeTimer.current !== null) window.clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(() => params.set({ q: value }), SEARCH_WRITE_MS);
  }

  function changeStatus(value: string) {
    setLinkedId(null);
    params.set({ status: statusFilterOf(value), page: null });
  }

  function changeArea(value: string) {
    setLinkedId(null);
    params.set({ area: value, page: null });
  }

  function changeQuery(value: string) {
    setLinkedId(null);
    setQuery(value);
    params.set({ page: null });
    writeQueryLater(value);
  }

  function clearFilters() {
    if (writeTimer.current !== null) window.clearTimeout(writeTimer.current);
    setLinkedId(null);
    setQuery('');
    params.set({ status: null, area: null, q: null, page: null });
  }

  function goToPage(target: number) {
    const next = clampPage(String(target), pageCount);
    const from = (next - 1) * PAGE_SIZE + 1;
    setLinkedId(null);
    params.set({ page: String(next) });
    setLive(
      copy.pagination.changed(next, pageCount, from, Math.min(next * PAGE_SIZE, count), count),
    );
    regionRef.current?.scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    summaryRef.current?.focus({ preventScroll: true });
  }

  /** The deep link: reset the filters if they hide the row, open its page, highlight and focus it. */
  function applyHash() {
    const id = hashId();
    if (!id) return;
    const target = rows.find((row) => row.id === id);
    if (!target) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    const urlArea = params.read('area') ?? '';
    const shown = matchStatus(
      matchAreaAndQuery(rows, { area: urlArea, query: queryRef.current }),
      statusFilterOf(params.read('status')),
    );
    let index = shown.findIndex((row) => row.id === id);
    if (index < 0) {
      if (writeTimer.current !== null) window.clearTimeout(writeTimer.current);
      setQuery('');
      index = rows.indexOf(target);
      params.set({
        status: null,
        area: null,
        q: null,
        page: String(Math.floor(index / PAGE_SIZE) + 1),
      });
    } else {
      params.set({ page: String(Math.floor(index / PAGE_SIZE) + 1) });
    }
    setLinkedId(id);
    pendingScroll.current = id;
    setScrollTick((tick) => tick + 1);
  }

  const applyHashRef = useRef(applyHash);
  useEffect(() => {
    applyHashRef.current = applyHash;
  });
  useEffect(() => {
    const run = () => applyHashRef.current();
    const frame = window.requestAnimationFrame(run);
    window.addEventListener('hashchange', run);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', run);
    };
  }, []);

  // Once the row is on the page: scroll to it and move focus there.
  useEffect(() => {
    const id = pendingScroll.current;
    if (!id) return;
    const row = document.getElementById(id);
    if (!row) return;
    pendingScroll.current = null;
    row.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    row.focus({ preventScroll: true });
  }, [scrollTick, visibleKey]);

  function viewNotice(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    window.history.replaceState(null, '', `${pathname}${window.location.search}#${id}`);
    applyHash();
  }

  function hrefFor(target: number): string {
    const next = new URLSearchParams(searchParams.toString());
    if (target === 1) next.delete('page');
    else next.set('page', String(target));
    const text = next.toString();
    return `${pathname}${text ? `?${text}` : ''}`;
  }

  const emptyCopy = filtersActive ? copy.empty.filtered : { ...copy.empty[status], reset: null };
  const summary =
    count === 0
      ? copy.pagination.summaryEmpty
      : copy.pagination.summary(first + 1, first + visible.length, count);

  return (
    <div className="flex flex-col gap-6">
      {notFound ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4 type-body-s text-gray-700"
        >
          <Info aria-hidden className="mt-0.5 size-4.5 shrink-0 text-primary-700" />
          <p className="flex-1">{copy.notFound.text}</p>
          <IconButton
            variant="plain"
            aria-label={copy.notFound.dismiss}
            onClick={() => setNotFound(false)}
            className="-m-2.5 size-11"
          >
            <X aria-hidden className="size-4" />
          </IconButton>
        </div>
      ) : null}
      <Tabs value={status} onValueChange={changeStatus} className="gap-6">
        <div
          role="group"
          aria-label={copy.filters.groupLabel}
          className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
        >
          <TabsList aria-label={copy.tabs.label}>
            {STATUS_FILTERS.map((value) => (
              <TabsTrigger key={value} value={value} count={counts[value]}>
                {tabLabels[value]}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Select
              aria-label={copy.filters.areaLabel}
              value={area}
              onChange={(event) => changeArea(event.target.value)}
              options={[{ value: '', label: copy.filters.allAreas }, ...areaOptions]}
              className="md:w-60"
            />
            <div role="search" className="md:flex-1 xl:w-70 xl:flex-none">
              <SearchInput
                aria-label={copy.filters.searchLabel}
                placeholder={copy.filters.searchPlaceholder}
                enterKeyHint="search"
                maxLength={MAX_QUERY_LENGTH}
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                onClear={() => changeQuery('')}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') changeQuery('');
                }}
              />
            </div>
          </div>
        </div>
        <TabsContent value={status} className="scroll-mt-32 outline-none">
          <div
            ref={regionRef}
            onPointerDown={(event) => {
              if (linkedId && !(event.target as Element).closest(`[id="${linkedId}"]`)) {
                setLinkedId(null);
              }
            }}
            className="scroll-mt-32"
          >
            {visible.length === 0 ? (
              <div className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 px-5 py-10 md:items-center md:text-center">
                <SearchX aria-hidden className="size-6 text-gray-400" />
                <p className="type-body-m-semibold text-gray-900">{emptyCopy.title}</p>
                <p className="type-body-s text-gray-600">{emptyCopy.body}</p>
                {emptyCopy.reset ? (
                  <Button variant="secondary" onClick={clearFilters} className="mt-2">
                    {emptyCopy.reset}
                  </Button>
                ) : null}
              </div>
            ) : (
              <AnnouncementsTable rows={visible} linkedId={linkedId} onViewNotice={viewNotice} />
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p ref={summaryRef} tabIndex={-1} className="type-body-s text-gray-600 outline-none">
          {summary}
        </p>
        <Pagination
          page={page}
          pageCount={pageCount}
          hrefFor={hrefFor}
          onNavigate={goToPage}
          label={copy.pagination.label}
          className="max-md:self-center"
        />
      </div>
      <p role="status" className="sr-only">
        {live}
      </p>
    </div>
  );
}
