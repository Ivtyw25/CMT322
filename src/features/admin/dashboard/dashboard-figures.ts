import type { ReportType, Ticket, TicketStatus } from '@/data/models/ticket';
import { isUnclaimed } from '@/lib/tickets';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
/** The target is that a ticket is picked up within 2 working days. */
const TARGET_MS = 2 * DAY_MS;
const MAX_UNCLAIMED = 5;
const MAX_AREAS = 5;

export type WaitingTicket = { ticket: Ticket; waitedMs: number; overdue: boolean };

export type TicketCounts = {
  counts: Record<TicketStatus, number>;
  /** Unclaimed tickets that have waited longer than the target. */
  pastTarget: number;
};

export type AuthorityFigures = {
  openByArea: { areaLabel: string; count: number }[];
  byType: { type: ReportType; count: number }[];
};

export function waitingBreakdown(waitedMs: number): {
  unit: 'minutes' | 'hours' | 'days';
  n: number;
} {
  if (waitedMs >= DAY_MS) return { unit: 'days', n: Math.floor(waitedMs / DAY_MS) };
  if (waitedMs >= HOUR_MS) return { unit: 'hours', n: Math.floor(waitedMs / HOUR_MS) };
  return { unit: 'minutes', n: Math.max(1, Math.floor(waitedMs / 60_000)) };
}

/** The status counts, worked out from the tickets and the mock "now". */
export function ticketCounts(tickets: readonly Ticket[], nowIso: string): TicketCounts {
  const now = Date.parse(nowIso);
  const counts: Record<TicketStatus, number> = { pending: 0, 'in-progress': 0, resolved: 0 };
  let pastTarget = 0;

  for (const ticket of tickets) {
    counts[ticket.status] += 1;
    if (isUnclaimed(ticket) && now - Date.parse(ticket.submittedAt) > TARGET_MS) pastTarget += 1;
  }

  return { counts, pastTarget };
}

/** Up to five tickets nobody has picked up, the one waiting longest first. */
export function waitingTickets(tickets: readonly Ticket[], nowIso: string): WaitingTicket[] {
  const now = Date.parse(nowIso);
  return tickets
    .filter(isUnclaimed)
    .map((ticket): WaitingTicket => {
      const waitedMs = Math.max(0, now - Date.parse(ticket.submittedAt));
      return { ticket, waitedMs, overdue: waitedMs > TARGET_MS };
    })
    .toSorted((a, b) => b.waitedMs - a.waitedMs)
    .slice(0, MAX_UNCLAIMED);
}

/** The figures only the authority dashboard shows. */
export function authorityFigures(tickets: readonly Ticket[]): AuthorityFigures {
  const areas = new Map<string, number>();
  const types = new Map<ReportType, number>();
  for (const ticket of tickets) {
    types.set(ticket.type, (types.get(ticket.type) ?? 0) + 1);
    if (ticket.status !== 'resolved') {
      areas.set(ticket.areaLabel, (areas.get(ticket.areaLabel) ?? 0) + 1);
    }
  }
  return {
    openByArea: [...areas]
      .map(([areaLabel, count]) => ({ areaLabel, count }))
      .toSorted((a, b) => b.count - a.count)
      .slice(0, MAX_AREAS),
    byType: [...types].map(([type, count]) => ({ type, count })),
  };
}
