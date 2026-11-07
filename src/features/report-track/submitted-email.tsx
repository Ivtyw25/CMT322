import { Mail } from 'lucide-react';
import { reportTrackCopy } from '@/content/report-track';
import type { Ticket } from '@/data/models/ticket';
import { formatClockTime } from '@/lib/format/date-time';
import { givenName } from '@/lib/format/person';

const { email } = reportTrackCopy.submitted;

/** An example of the confirmation email, as a quoted block. */
export function SubmittedEmail({
  ticket,
  name,
  address,
}: {
  ticket: Ticket;
  name: string;
  address: string;
}) {
  return (
    <figure className="flex flex-col gap-1.5 rounded-lg bg-gray-50 p-4 wrap-anywhere">
      <figcaption className="sr-only">{email.title}</figcaption>
      <p className="flex items-start gap-2 type-body-xs text-gray-500">
        <Mail aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        {email.sentTo(address, formatClockTime(ticket.submittedAt))}
      </p>
      <p className="type-body-s-semibold text-gray-900">{email.subject(ticket.id)}</p>
      <p className="type-body-s text-gray-700">{email.body(givenName(name), ticket.title)}</p>
    </figure>
  );
}
