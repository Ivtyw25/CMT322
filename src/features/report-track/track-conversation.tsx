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
import { resolutionReply, useTickets } from '@/lib/tickets';
import { TrackReplyForm } from './track-reply-form';

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
 * The conversation: the report, the replies of the authority and the reporter's own replies.
 * Anyone with the ticket ID sees the report and the authority's replies, without the reporter's
 * name or files. Only the reporter (the account that sent the report, or the browser it was sent
 * from) sees their own replies and can reply.
 */
export function TrackConversation({ ticket }: { ticket: Ticket }) {
  const { status, user } = useSession();
  const { sentFromHere } = useTickets();
  const owner = (user !== null && ticket.reporterId === user.id) || sentFromHere(ticket.id);

  return (
    <div className="flex flex-col gap-5">
      <TicketThread
        ticket={ticket}
        viewer="reporter"
        hideReporter={!owner}
        showReporterReplies={owner}
      />
      {ticket.replies.length === 0 ? (
        <p className="type-body-s text-gray-600">{updates.empty}</p>
      ) : null}
      <Resolution ticket={ticket} />
      {owner ? <TrackReplyForm ticket={ticket} /> : null}
      {!owner && status === 'guest' ? (
        <div className="flex flex-col items-start gap-3">
          <p className="type-body-s text-gray-600">{result.ownerPrompt}</p>
          <ButtonLink
            variant="secondary"
            href={routes.account.loginReturningTo(routes.reportTrack.ticket(ticket.id))}
          >
            {result.login}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
