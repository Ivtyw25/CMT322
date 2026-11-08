import type { Ticket, TicketReply, TicketStatus } from '@/data/models/ticket';

const time = (iso: string) => Date.parse(iso);

/** When the ticket last changed: its submission, a reply or a system event. */
export function lastActivityAt(ticket: Ticket): string {
  const moments = [...ticket.replies.map((reply) => reply.at), ...ticket.events.map((e) => e.at)];
  return moments.reduce(
    (latest, at) => (time(at) > time(latest) ? at : latest),
    ticket.submittedAt,
  );
}

/** The first moment the ticket reached a status, or null if it never has. */
export function statusReachedAt(ticket: Ticket, status: TicketStatus): string | null {
  if (status === 'submitted') return ticket.submittedAt;
  const moments = [
    ...ticket.replies.filter((reply) => reply.status === status).map((reply) => reply.at),
    ...(status === 'pending'
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

/** A ticket still waiting for its first staff reply. */
export function needsFirstReply(ticket: Ticket): boolean {
  return ticket.replies.length === 0 && ticket.status !== 'resolved';
}
