import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Tag, type TagKind } from '@/components/ui/tag';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { Station } from '@/data/models/station';
import type { Ticket, TicketStatus } from '@/data/models/ticket';
import { formatDate } from '@/lib/format/dates';
import { isoDateOf } from '@/lib/format/date-time';
import { lastActivityAt } from '@/lib/tickets';
import { DocsSection } from '@/components/patterns/docs-section';

const { reports: copy } = projectCopy.station;

const tagOf: Record<TicketStatus, TagKind> = {
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

/**
 * "Reports near this station": up to five tickets, each opening the report on the Track page by
 * its ticket ID, then the report prompt.
 */
export function StationReports({
  id,
  station,
  tickets,
}: {
  id: string;
  station: Pick<Station, 'code' | 'name'>;
  tickets: readonly Ticket[];
}) {
  return (
    <DocsSection id={id} title={copy.title}>
      <p className="-mt-2 type-body-m text-gray-600">{copy.lede}</p>
      {tickets.length > 0 ? (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-surface">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="relative flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-(--duration-fast) hover:bg-gray-50"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <Link
                  href={routes.reportTrack.ticket(ticket.id)}
                  className="type-body-s-medium wrap-anywhere text-gray-900 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                >
                  {ticket.subject}
                </Link>
                <p className="type-body-xs text-gray-500">{ticket.id}</p>
                <p className="type-body-xs text-gray-500">
                  {ticket.status === 'resolved'
                    ? copy.resolved(formatDate(isoDateOf(lastActivityAt(ticket))))
                    : copy.reported(formatDate(isoDateOf(ticket.submittedAt)))}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Tag kind={tagOf[ticket.status]} />
                <ChevronRight aria-hidden className="size-4 text-gray-400" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-surface p-4">
          <p className="type-body-s-semibold text-gray-900">{copy.empty.title(station.name)}</p>
          <p className="type-body-s text-gray-600">{copy.empty.body}</p>
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl bg-primary-50 p-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="type-body-m-semibold text-primary-700">{copy.cta.title(station.name)}</h3>
          <p className="type-body-s text-gray-700">{copy.cta.body}</p>
        </div>
        <ButtonLink
          href={routes.reportTrack.reportAt(station.code)}
          className="self-start md:shrink-0"
        >
          {copy.cta.action}
        </ButtonLink>
      </div>
    </DocsSection>
  );
}
