'use client';

import { ArrowDownUp, CalendarDays, Download, Filter, SearchX } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminCopy } from '@/content/admin';
import { uiCopy } from '@/content/ui';
import { AdminPageHead } from '@/features/admin/page-head';
import { formatShortDateTime } from '@/lib/format/date-time';
import { useQueryParams } from '@/lib/url/use-query-params';
import { useStaffSession } from '@/lib/staff-session';
import { useTickets } from '@/lib/tickets';
import { buildCsv, downloadCsv } from './ticket-csv';
import {
  countByStatus,
  defaultFilters,
  filterTickets,
  isRangeOption,
  isReportTypeFilter,
  isSortOption,
  isStatusTab,
  PAGE_SIZE,
  rangeOptions,
  reportTypes,
  sortOptions,
  sortTickets,
  statusTabs,
  type TicketFilters,
} from './ticket-filters';
import { TicketResults } from './ticket-results';
import { priorityTagOf, statusTagOf } from './ticket-tags';

const copy = adminCopy.tickets;

const queryDefaults = {
  status: defaultFilters.status,
  type: defaultFilters.type,
  area: defaultFilters.area,
  range: defaultFilters.range,
  sort: defaultFilters.sort,
};

/** The ticket queue (Figma 115:4681): status tabs, filters, the list and pagination. */
export function TicketQueue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useQueryParams(queryDefaults);
  const { staff } = useStaffSession();
  const { tickets, now } = useTickets();
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const rawStatus = searchParams.get('status');
  const rawType = searchParams.get('type');
  const rawRange = searchParams.get('range');
  const rawSort = searchParams.get('sort');
  const filters: TicketFilters = {
    status: isStatusTab(rawStatus) ? rawStatus : defaultFilters.status,
    query: searchParams.get('q') ?? '',
    type: isReportTypeFilter(rawType) ? rawType : defaultFilters.type,
    area: searchParams.get('area') ?? defaultFilters.area,
    range: isRangeOption(rawRange) ? rawRange : defaultFilters.range,
    sort: isSortOption(rawSort) ? rawSort : defaultFilters.sort,
  };

  const nowMs = Date.parse(now());
  const areaOptions = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.areaLabel))].toSorted(),
    [tickets],
  );

  const withoutStatus = filterTickets(tickets, filters, nowMs);
  const counts = countByStatus(withoutStatus);
  const matching = sortTickets(
    filters.status === 'all'
      ? withoutStatus
      : withoutStatus.filter((ticket) => ticket.status === filters.status),
    filters.sort,
  );

  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Math.min(pageCount, Math.max(1, Number.isNaN(requestedPage) ? 1 : requestedPage));
  const first = (page - 1) * PAGE_SIZE;
  const pageTickets = matching.slice(first, first + PAGE_SIZE);
  const filtered =
    filters.query !== '' ||
    filters.type !== 'all' ||
    filters.area !== 'all' ||
    filters.range !== defaultFilters.range ||
    filters.status !== 'all';

  function change(partial: Parameters<typeof params.set>[0]) {
    params.set({ ...partial, page: null });
    setSelected(new Set());
  }

  function hrefFor(target: number): string {
    const next = new URLSearchParams(searchParams.toString());
    if (target <= 1) next.delete('page');
    else next.set('page', String(target));
    const query = next.toString();
    return `${pathname}${query ? `?${query}` : ''}`;
  }

  function toggle(ticketId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(ticketId)) next.delete(ticketId);
      else next.add(ticketId);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const ticket of pageTickets) {
        if (checked) next.add(ticket.id);
        else next.delete(ticket.id);
      }
      return next;
    });
  }

  function exportCsv() {
    const chosen = selected.size > 0 ? matching.filter((t) => selected.has(t.id)) : matching;
    const rows = chosen.map((ticket) => [
      ticket.id,
      ticket.subject,
      copy.types[ticket.type],
      ticket.areaLabel,
      formatShortDateTime(ticket.submittedAt),
      ticket.handler?.name ?? copy.table.unclaimed,
      uiCopy.tags[priorityTagOf[ticket.priority]],
      uiCopy.tags[statusTagOf[ticket.status]],
    ]);
    downloadCsv(copy.csvName, buildCsv(copy.csvColumns, rows));
  }

  if (!staff) return null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHead
        title={copy.title}
        intro={copy.intro}
        action={
          <Button
            variant="secondary"
            icon={<Download aria-hidden className="size-4" />}
            onClick={exportCsv}
          >
            {copy.exportCsv}
          </Button>
        }
      />

      <Tabs
        value={filters.status}
        onValueChange={(value) => {
          if (isStatusTab(value)) change({ status: value });
        }}
      >
        <TabsList aria-label={copy.tabsLabel}>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} count={counts[tab]}>
              {copy.tabs[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div
          role="group"
          aria-label={copy.toolbarLabel}
          className="flex flex-wrap items-center gap-2.5"
        >
          <SearchInput
            aria-label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            value={filters.query}
            onChange={(event) => change({ q: event.target.value })}
            onClear={() => change({ q: null })}
            className="w-full md:w-80"
          />
          <ChipSelect
            label={copy.filters.type.name}
            prefix={copy.filters.type.name}
            icon={<Filter className="size-4" />}
            value={filters.type}
            onValueChange={(value) => change({ type: value })}
            options={[
              { value: 'all', label: copy.filters.type.all },
              ...reportTypes.map((type) => ({ value: type, label: copy.types[type] })),
            ]}
          />
          <ChipSelect
            label={copy.filters.area.name}
            prefix={copy.filters.area.name}
            value={filters.area}
            onValueChange={(value) => change({ area: value })}
            options={[
              { value: 'all', label: copy.filters.area.all },
              ...areaOptions.map((area) => ({ value: area, label: area })),
            ]}
          />
          <ChipSelect
            label={copy.filters.range.name}
            icon={<CalendarDays className="size-4" />}
            value={filters.range}
            onValueChange={(value) => change({ range: value })}
            options={rangeOptions.map((option) => ({
              value: option,
              label: copy.filters.range.options[option],
            }))}
          />
          <div className="hidden flex-1 md:block" />
          <ChipSelect
            label={copy.filters.sort.name}
            icon={<ArrowDownUp className="size-4" />}
            value={filters.sort}
            onValueChange={(value) => change({ sort: value })}
            options={sortOptions.map((option) => ({
              value: option,
              label: copy.filters.sort.options[option],
            }))}
          />
        </div>

        <TabsContent value={filters.status}>
          <div
            id="ticket-results"
            className="overflow-hidden rounded-2xl border border-gray-200 bg-surface"
          >
            {pageTickets.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <SearchX aria-hidden className="size-8 text-gray-400" />
                <p className="type-heading-3xs text-gray-900">{copy.empty.title}</p>
                <p className="max-w-md type-body-s text-gray-600">{copy.empty.body}</p>
                {filtered ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      router.replace(pathname);
                      setSelected(new Set());
                    }}
                  >
                    {copy.empty.clear}
                  </Button>
                ) : null}
              </div>
            ) : (
              <TicketResults
                tickets={pageTickets}
                selected={selected}
                onToggle={toggle}
                onToggleAll={toggleAll}
              />
            )}
            {matching.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                <p className="min-w-0 flex-1 basis-60 type-body-s text-gray-600">
                  {copy.showing(first + 1, first + pageTickets.length, matching.length)}
                  {selected.size > 0 ? (
                    <span className="ml-3 type-body-s-medium text-gray-900">
                      {copy.table.selected(selected.size)}
                    </span>
                  ) : null}
                </p>
                <Pagination
                  page={page}
                  pageCount={pageCount}
                  label={copy.paginationLabel}
                  hrefFor={hrefFor}
                  onNavigate={(target) => {
                    params.set({ page: target <= 1 ? null : String(target) }, { mode: 'push' });
                    document
                      .getElementById('ticket-results')
                      ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                  }}
                />
              </div>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
