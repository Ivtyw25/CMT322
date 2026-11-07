import { adminCopy } from '@/content/admin';
import type { StaffTicket } from '@/data/models/staff-ticket';
import { cn } from '@/lib/cn';
import { formatFullDateTime } from '@/lib/format/date-time';

const copy = adminCopy.ticket.timeline;

/**
 * What happened on a ticket, oldest first, on a line (Figma 115:5140). Done steps are filled
 * dots, the latest one pulses, and an open ticket ends with a grey "Resolved, waiting" step.
 */
export function TicketTimeline({ ticket }: { ticket: StaffTicket }) {
  const open = ticket.status !== 'resolved';
  const lastIndex = ticket.events.length - 1;
  return (
    <ol className="flex flex-col">
      {ticket.events.map((event, index) => {
        const latest = index === lastIndex;
        return (
          <li key={event.id} className="group relative flex gap-3.5 pb-3.5 last:pb-0">
            <span
              aria-hidden
              className={cn(
                'absolute top-4.5 -bottom-5 left-1.25 w-0.5 group-last:hidden',
                latest ? 'bg-gray-300' : 'bg-primary-600',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'relative z-10 mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary-600',
                latest ? 'animate-pulse-ring bg-surface' : 'bg-primary-600',
              )}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="type-body-s text-gray-900">
                <span className="sr-only">{latest ? copy.current : copy.done}: </span>
                {event.text}
              </p>
              <p className="type-body-xs text-gray-500">{formatFullDateTime(event.at)}</p>
            </div>
          </li>
        );
      })}
      {open ? (
        <li className="relative flex gap-3.5">
          <span
            aria-hidden
            className="relative z-10 mt-1.5 size-3 shrink-0 rounded-full border-2 border-gray-300 bg-surface"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-gray-500">
            <p className="type-body-s">{copy.resolvedStep}</p>
            <p className="type-body-xs">{copy.waiting}</p>
          </div>
        </li>
      ) : null}
    </ol>
  );
}
