import type { StepEntry } from '@/components/patterns/stepper';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { Ticket, TicketStatus } from '@/data/models/ticket';
import { formatShortDateTime } from '@/lib/format/date-time';
import { statusReachedAt } from '@/lib/tickets';

export const ticketStatusOrder: readonly TicketStatus[] = ['pending', 'in-progress', 'resolved'];

/** The three status steps of a ticket, each with the date it was reached. */
export function ticketSteps(ticket: Ticket): StepEntry[] {
  const current = ticketStatusOrder.indexOf(ticket.status);
  const resolved = ticket.status === 'resolved';
  return ticketStatusOrder.map((status, index) => {
    const reached = index <= current;
    const reachedAt = reached ? statusReachedAt(ticket, status) : null;
    const state: StepEntry['state'] =
      resolved || index < current ? 'complete' : index === current ? 'current' : 'upcoming';
    const detail = reachedAt
      ? formatShortDateTime(reachedAt)
      : reportTrackCopy.track.stepper.notYet;
    return { id: status, label: uiCopy.ticketStatus[status], state, detail };
  });
}
