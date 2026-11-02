import { Tag, type TagKind } from '@/components/ui/tag';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { Station } from '@/data/models/station';
import type { Ticket, TicketStatus } from '@/data/models/ticket';
import { formatDate } from '@/lib/format/dates';
import { DocsSection } from './docs-section';

const { reports: copy } = projectCopy.station;

const tagOf: Record<TicketStatus, TagKind> = {
  submitted: 'pending',
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

/** "Reports near this station": up to five tickets, rows are not links, then the report prompt. */
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
            <li key={ticket.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="type-body-s-medium text-gray-900">{ticket.title}</p>
                <p className="type-body-xs text-gray-500">
                  {ticket.status === 'resolved'
                    ? copy.resolved(formatDate(ticket.updatedAt.slice(0, 10)))
                    : copy.reported(formatDate(ticket.submittedAt.slice(0, 10)))}
                </p>
              </div>
              <Tag kind={tagOf[ticket.status]} />
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
