'use client';

import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { ButtonLink } from '@/components/ui/button-link';
import { Callout } from '@/components/ui/callout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import type { Ticket } from '@/data/models/ticket';
import { formatDate } from '@/lib/format/dates';
import { isoDateOf } from '@/lib/format/date-time';
import { useSession } from '@/lib/session';

const { report, resolution, ...result } = reportTrackCopy.track.result;

function Resolution({ ticket }: { ticket: Ticket }) {
  const resolvedAt = ticket.updates.find((update) => update.status === 'resolved')?.at;
  if (ticket.status === 'resolved' && ticket.resolution) {
    return (
      <Callout tone="success" title={resolution.title}>
        <p>{ticket.resolution}</p>
        {resolvedAt ? (
          <p className="mt-1 type-body-xs text-gray-600">
            {resolution.resolvedOn(formatDate(isoDateOf(resolvedAt)))}
          </p>
        ) : null}
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

/** The report text and photos for the account that sent it; a private note for everyone else. */
export function TrackReportSection({ ticket }: { ticket: Ticket }) {
  const { status, user } = useSession();
  const owner = user !== null && ticket.reporterId === user.id;

  return (
    <div className="flex flex-col gap-5">
      {status === 'loading' ? null : owner ? (
        <>
          <p className="type-body-m text-gray-700">{ticket.description}</p>
          {ticket.attachmentCount > 0 ? (
            <ul className="flex flex-wrap gap-2.5">
              {Array.from({ length: ticket.attachmentCount }, (_, index) => (
                <li key={index}>
                  <div
                    role="img"
                    aria-label={result.attachmentAlt(index + 1, ticket.attachmentCount)}
                  >
                    <ImagePlaceholder decorative className="h-24 w-35 rounded-lg" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="type-body-s text-gray-600">{report.noPhotos}</p>
          )}
        </>
      ) : (
        <>
          <Callout tone="info">
            <p className="type-body-s-semibold text-gray-900">{result.privateTitle}</p>
            <p>{result.privateBody}</p>
          </Callout>
          {status === 'guest' ? (
            <ButtonLink
              href={routes.account.loginReturningTo(routes.reportTrack.ticket(ticket.id))}
              className="self-start"
            >
              {result.login}
            </ButtonLink>
          ) : null}
        </>
      )}
      <Resolution ticket={ticket} />
    </div>
  );
}
