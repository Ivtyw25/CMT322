import type { ReportType, Ticket, TicketStatus } from '@/data/models/ticket';
import { needsFirstReply, resolutionReply } from '@/lib/tickets';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
/** The target is a first reply within 2 working days. */
const TARGET_MS = 2 * DAY_MS;
const MAX_NEEDS_REPLY = 5;
const MAX_AREAS = 5;
const MAX_ACTIVITY = 5;

export type WaitingTicket = { ticket: Ticket; waitedMs: number; overdue: boolean };

export type ActivityItem =
  | { id: string; at: string; kind: 'submitted'; ticketId: string; name: string }
  | { id: string; at: string; kind: 'claimed'; ticketId: string; name: string }
  | { id: string; at: string; kind: 'replied'; ticketId: string; name: string; subject: string };

export type AuthorityFigures = {
  counts: Record<TicketStatus, number>;
  /** Unclaimed tickets that have waited longer than the target. */
  pastTarget: number;
  /** Null when no ticket is resolved yet. */
  averageDaysToResolve: number | null;
  needsReply: WaitingTicket[];
  openByArea: { areaLabel: string; count: number }[];
  byType: { type: ReportType; count: number }[];
  activity: ActivityItem[];
};

export function waitingBreakdown(waitedMs: number): {
  unit: 'minutes' | 'hours' | 'days';
  n: number;
} {
  if (waitedMs >= DAY_MS) return { unit: 'days', n: Math.floor(waitedMs / DAY_MS) };
  if (waitedMs >= HOUR_MS) return { unit: 'hours', n: Math.floor(waitedMs / HOUR_MS) };
  return { unit: 'minutes', n: Math.max(1, Math.floor(waitedMs / 60_000)) };
}

function activityOf(tickets: readonly Ticket[]): ActivityItem[] {
  return tickets
    .flatMap((ticket): ActivityItem[] => [
      {
        id: `${ticket.id}-submitted`,
        at: ticket.submittedAt,
        kind: 'submitted',
        ticketId: ticket.id,
        name: ticket.reporter.name,
      },
      ...ticket.events
        .filter((event) => event.kind === 'claimed')
        .map((event): ActivityItem => ({
          id: event.id,
          at: event.at,
          kind: 'claimed',
          ticketId: ticket.id,
          name: event.by,
        })),
      ...ticket.replies.map((reply): ActivityItem => ({
        id: reply.id,
        at: reply.at,
        kind: 'replied',
        ticketId: ticket.id,
        name: reply.staffName,
        subject: reply.subject,
      })),
    ])
    .toSorted((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, MAX_ACTIVITY);
}

/** Every figure of the authority dashboard, worked out from the tickets and the mock "now". */
export function authorityFigures(tickets: readonly Ticket[], nowIso: string): AuthorityFigures {
  const now = Date.parse(nowIso);
  const counts: Record<TicketStatus, number> = {
    submitted: 0,
    pending: 0,
    'in-progress': 0,
    resolved: 0,
  };
  const areas = new Map<string, number>();
  const types = new Map<ReportType, number>();
  const resolutionDays: number[] = [];
  let pastTarget = 0;

  for (const ticket of tickets) {
    counts[ticket.status] += 1;
    types.set(ticket.type, (types.get(ticket.type) ?? 0) + 1);
    if (ticket.status !== 'resolved') {
      areas.set(ticket.areaLabel, (areas.get(ticket.areaLabel) ?? 0) + 1);
    }
    if (ticket.status === 'submitted' && now - Date.parse(ticket.submittedAt) > TARGET_MS) {
      pastTarget += 1;
    }
    const closing = resolutionReply(ticket);
    if (closing)
      resolutionDays.push((Date.parse(closing.at) - Date.parse(ticket.submittedAt)) / DAY_MS);
  }

  const needsReply = tickets
    .filter(needsFirstReply)
    .map((ticket): WaitingTicket => {
      const waitedMs = Math.max(0, now - Date.parse(ticket.submittedAt));
      return { ticket, waitedMs, overdue: waitedMs > TARGET_MS };
    })
    .toSorted((a, b) => b.waitedMs - a.waitedMs)
    .slice(0, MAX_NEEDS_REPLY);

  const average =
    resolutionDays.length === 0
      ? null
      : Math.round(
          (resolutionDays.reduce((sum, days) => sum + days, 0) / resolutionDays.length) * 10,
        ) / 10;

  return {
    counts,
    pastTarget,
    averageDaysToResolve: average,
    needsReply,
    openByArea: [...areas]
      .map(([areaLabel, count]) => ({ areaLabel, count }))
      .toSorted((a, b) => b.count - a.count)
      .slice(0, MAX_AREAS),
    byType: [...types].map(([type, count]) => ({ type, count })),
    activity: activityOf(tickets),
  };
}
