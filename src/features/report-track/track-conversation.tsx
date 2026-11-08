'use client';

import { TicketThread } from '@/components/patterns/ticket-thread';
import { ButtonLink } from '@/components/ui/button-link';
import { Callout } from '@/components/ui/callout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import type { Ticket } from '@/data/models/ticket';
import { formatDate } from '@/lib/format/dates';
import { isoDateOf } from '@/lib/format/date-time';
import { useSession } from '@/lib/session';
import { resolutionReply } from '@/lib/tickets';

const { resolution, updates, ...result } = reportTrackCopy.track.result;

function Resolution({ ticket }: { ticket: Ticket }) {
  const closing = resolutionReply(ticket);
  if (closing) {
    return (
      <Callout tone="success" title={resolution.title}>
        <p>{closing.body}</p>
        <p className="mt-1 type-body-xs text-gray-600">
          {resolution.resolvedOn(formatDate(isoDateOf(closing.at)))}
        </p>
      </Callout>
    );
  }
  return (
    <Callout tone="info">
      <p className="type-body-s-semibold text-gray-900">{resolution.title}</p>
      <p>{resolution.pending}</p>
    </Callout>
  );
}

/**
 * The conversation: the report and the replies of the authority. Only the account that sent the
 * report sees what it said; anyone with the ticket ID sees the replies.
 */
export function TrackConversation({ ticket }: { ticket: Ticket }) {
  const { status, user } = useSession();
  const owner = user !== null && ticket.reporterId === user.id;

  const notice =
    status === 'loading' ? (
      <div aria-hidden className="h-16 rounded-md bg-gray-100" />
    ) : owner ? undefined : (
      <div className="flex flex-col items-start gap-3">
        <Callout tone="info" className="w-full">
          <p className="type-body-s-semibold text-gray-900">{result.privateTitle}</p>
          <p>{result.privateBody}</p>
        </Callout>
        {status === 'guest' ? (
          <ButtonLink href={routes.account.loginReturningTo(routes.reportTrack.ticket(ticket.id))}>
            {result.login}
          </ButtonLink>
        ) : null}
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <TicketThread ticket={ticket} viewer="reporter" submissionNotice={notice} />
      {ticket.replies.length === 0 ? (
        <p className="type-body-s text-gray-600">{updates.empty}</p>
      ) : null}
      <Resolution ticket={ticket} />
    </div>
  );
}
