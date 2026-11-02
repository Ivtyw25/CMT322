import type { StepEntry } from '@/components/patterns/stepper';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { Ticket, TicketStatus } from '@/data/models/ticket';
import { formatShortDateTime } from '@/lib/format/date-time';

export const ticketStatusOrder: readonly TicketStatus[] = [
  'submitted',
  'pending',
  'in-progress',
  'resolved',
];

/** The four status steps of a ticket, each with the date of its first update. */
export function ticketSteps(ticket: Ticket): StepEntry[] {
  const current = ticketStatusOrder.indexOf(ticket.status);
  const resolved = ticket.status === 'resolved';
  return ticketStatusOrder.map((status, index) => {
    const reached = index <= current;
    const first = ticket.updates.find((update) => update.status === status);
    const state: StepEntry['state'] =
      resolved || index < current ? 'complete' : index === current ? 'current' : 'upcoming';
    const detail =
      reached && first
        ? formatShortDateTime(first.at)
        : status === 'pending'
          ? reportTrackCopy.submitted.next.steps.pending.detail
          : reportTrackCopy.track.stepper.notYet;
    return { id: status, label: uiCopy.ticketStatus[status], state, detail };
  });
}
