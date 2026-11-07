import { reportTrackCopy } from '@/content/report-track';
import { CopyIdButton } from './copy-id-button';

const { ticket } = reportTrackCopy.submitted;
export const TICKET_VALUE_ID = 'ticket-id-value';

/** The ID in large type with its copy button. */
export function SubmittedTicketId({ id }: { id: string }) {
  return (
    <section aria-labelledby="ticket-id">
      <h2 id="ticket-id" tabIndex={-1} className="sr-only scroll-mt-32 outline-none">
        {ticket.label}
      </h2>
      <p aria-hidden className="type-body-s text-gray-600">
        {ticket.label}
      </p>
      <div className="mt-1 flex flex-col items-start gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:gap-4">
        <p id={TICKET_VALUE_ID} className="min-w-0 type-heading-l text-primary-800">
          {id}
        </p>
        <CopyIdButton valueId={TICKET_VALUE_ID} ticketId={id} />
      </div>
      <p className="mt-2 type-body-s text-gray-600">{ticket.hint}</p>
    </section>
  );
}
