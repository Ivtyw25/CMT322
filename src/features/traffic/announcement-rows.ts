import { trafficCopy } from '@/content/traffic';
import type { Announcement, AnnouncementStatus } from '@/data/models/announcement';
import type { Area, AreaId } from '@/data/models/area';
import { formatDate } from '@/lib/format/dates';
import { normaliseQuery } from '@/lib/search/normalise';

const copy = trafficCopy.announcements;

export const STATUS_FILTERS = ['all', 'current', 'upcoming', 'past'] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_OF: Record<Exclude<StatusFilter, 'all'>, AnnouncementStatus> = {
  current: 'active',
  upcoming: 'upcoming',
  past: 'ended',
};

export const PAGE_SIZE = copy.pagination.pageSize;

/** An announcement as the list shows it: the record plus its display text. */
export type AnnouncementRow = {
  id: string;
  status: AnnouncementStatus;
  title: string;
  summary: string;
  location: string;
  startText: string;
  endText: string;
  /** "12 Oct 2026 to Jul 2027", for the card layout. */
  datesText: string;
  duration: string;
  areaIds: readonly AreaId[];
  /** Title, summary, place, road and area names, normalised, for the search. */
  searchText: string;
};

export type RowFilters = { status: StatusFilter; area: string; query: string };

/** Builds the rows once, on the server. */
export function toAnnouncementRows(
  announcements: readonly Announcement[],
  areas: readonly Area[],
): AnnouncementRow[] {
  return announcements.map((item) => {
    const startText = formatDate(item.startDate);
    const endText = formatDate(item.endDate);
    const areaNames = areas
      .filter((area) => item.areaIds.includes(area.id))
      .map((area) => area.label);
    return {
      id: item.id,
      status: item.status,
      title: item.title,
      summary: item.summary,
      location: item.location,
      startText,
      endText,
      datesText: copy.table.dateRange(startText, endText),
      duration: item.duration,
      areaIds: item.areaIds,
      searchText: normaliseQuery(
        [item.title, item.summary, item.location, item.road, ...areaNames].join(' '),
      ),
    };
  });
}

/** Rows that match the area and the search, in any status. The tab counts come from this. */
export function matchAreaAndQuery(
  rows: readonly AnnouncementRow[],
  { area, query }: Pick<RowFilters, 'area' | 'query'>,
): AnnouncementRow[] {
  const text = normaliseQuery(query);
  return rows.filter(
    (row) =>
      (area === '' || row.areaIds.some((id) => id === area)) &&
      (text === '' || row.searchText.includes(text)),
  );
}

export function matchStatus(
  rows: readonly AnnouncementRow[],
  status: StatusFilter,
): AnnouncementRow[] {
  return status === 'all' ? [...rows] : rows.filter((row) => row.status === STATUS_OF[status]);
}

export function countByStatus(rows: readonly AnnouncementRow[]): Record<StatusFilter, number> {
  return {
    all: rows.length,
    current: matchStatus(rows, 'current').length,
    upcoming: matchStatus(rows, 'upcoming').length,
    past: matchStatus(rows, 'past').length,
  };
}

export function statusFilterOf(value: string | null): StatusFilter {
  return STATUS_FILTERS.find((status) => status === value) ?? 'all';
}

/** `?page=` as a page number, kept within 1 to `pageCount`. Anything unreadable is page 1. */
export function clampPage(value: string | null, pageCount: number): number {
  const page = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(page) || page < 1) return 1;
  return Math.min(page, Math.max(pageCount, 1));
}

export function pageCountOf(total: number): number {
  return Math.max(Math.ceil(total / PAGE_SIZE), 1);
}
