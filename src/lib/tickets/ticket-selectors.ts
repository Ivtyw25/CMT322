import type { Ticket, TicketReply, TicketStatus } from '@/data/models/ticket';

const time = (iso: string) => Date.parse(iso);

/** When the ticket last changed: its submission, a reply, a reporter reply or a system event. */
export function lastActivityAt(ticket: Ticket): string {
  const moments = [
    ...ticket.replies.map((reply) => reply.at),
    ...ticket.reporterReplies.map((reply) => reply.at),
    ...ticket.events.map((event) => event.at),
  ];
  return moments.reduce(
    (latest, at) => (time(at) > time(latest) ? at : latest),
    ticket.submittedAt,
  );
}

/** The first moment the ticket reached a status, or null if it never has. */
export function statusReachedAt(ticket: Ticket, status: TicketStatus): string | null {
  if (status === 'pending') return ticket.submittedAt;
  const moments = [
    ...ticket.replies.filter((reply) => reply.status === status).map((reply) => reply.at),
    ...(status === 'in-progress'
      ? ticket.events.filter((event) => event.kind === 'claimed').map((event) => event.at)
      : []),
  ];
  return moments.toSorted((a, b) => time(a) - time(b)).at(0) ?? null;
}

/** The reply that closed the ticket, shown to the reporter as the resolution. */
export function resolutionReply(ticket: Ticket): TicketReply | null {
  if (ticket.status !== 'resolved') return null;
  return ticket.replies.findLast((reply) => reply.status === 'resolved') ?? null;
}

/** A ticket nobody has picked up yet: Pending and unclaimed. */
export function isUnclaimed(ticket: Ticket): boolean {
  return ticket.status === 'pending' && ticket.handler === null;
}

/** Only the staff member who claimed a ticket can reply, change its status or priority, or resolve it. */
export function isHandler(ticket: Ticket, staffId: string): boolean {
  return ticket.handler?.staffId === staffId;
}
