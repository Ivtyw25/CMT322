import type { StaffTicket } from '@/data/models/staff-ticket';
import type { ReportType } from '@/data/models/ticket';

export const PAGE_SIZE = 9;

export const statusTabs = ['all', 'pending', 'in-progress', 'resolved'] as const;
export type StatusTab = (typeof statusTabs)[number];

export const rangeOptions = ['7', '30', 'all'] as const;
export type RangeOption = (typeof rangeOptions)[number];

export const sortOptions = ['newest', 'oldest'] as const;
export type SortOption = (typeof sortOptions)[number];

export const reportTypes = [
  'complaint',
  'feedback',
  'inquiry',
] as const satisfies readonly ReportType[];

/** "all" for every select means no filtering; `assignee` also has "none" (unassigned). */
export type TicketFilters = {
  status: StatusTab;
  query: string;
  type: 'all' | ReportType;
  area: string;
  assignee: string;
  range: RangeOption;
  sort: SortOption;
};

export const defaultFilters: TicketFilters = {
  status: 'all',
  query: '',
  type: 'all',
  area: 'all',
  assignee: 'all',
  range: '30',
  sort: 'newest',
};

const DAY_MS = 86_400_000;

/** Lower-case text of everything the search box looks in. */
function searchText(ticket: StaffTicket): string {
  return `${ticket.id} ${ticket.subject} ${ticket.location}`.toLowerCase();
}

/**
 * The tickets that pass every filter except the status tab, so each tab can show its own count.
 * `nowMs` is the mock "now", so "Last 30 days" counts back from the design's day.
 */
export function filterTickets(
  tickets: readonly StaffTicket[],
  filters: TicketFilters,
  nowMs: number,
): StaffTicket[] {
  const text = filters.query.trim().toLowerCase();
  const since = filters.range === 'all' ? null : nowMs - Number(filters.range) * DAY_MS;
  return tickets.filter(
    (ticket) =>
      (text === '' || searchText(ticket).includes(text)) &&
      (filters.type === 'all' || ticket.type === filters.type) &&
      (filters.area === 'all' || ticket.areaLabel === filters.area) &&
      (filters.assignee === 'all' ||
        (filters.assignee === 'none'
          ? ticket.assigneeId === null
          : ticket.assigneeId === filters.assignee)) &&
      (since === null || Date.parse(ticket.submittedAt) >= since),
  );
}

export function countByStatus(tickets: readonly StaffTicket[]): Record<StatusTab, number> {
  const counts = { all: tickets.length, pending: 0, 'in-progress': 0, resolved: 0 };
  for (const ticket of tickets) counts[ticket.status] += 1;
  return counts;
}

export function sortTickets(tickets: readonly StaffTicket[], sort: SortOption): StaffTicket[] {
  const direction = sort === 'newest' ? -1 : 1;
  return [...tickets].sort(
    (a, b) => direction * (Date.parse(a.submittedAt) - Date.parse(b.submittedAt)),
  );
}

export function isStatusTab(value: string | null): value is StatusTab {
  return statusTabs.some((tab) => tab === value);
}
export function isRangeOption(value: string | null): value is RangeOption {
  return rangeOptions.some((option) => option === value);
}
export function isSortOption(value: string | null): value is SortOption {
  return sortOptions.some((option) => option === value);
}
export function isReportTypeFilter(value: string | null): value is TicketFilters['type'] {
  return value === 'all' || reportTypes.some((type) => type === value);
}
