import { DocsLayout } from '@/components/layout/docs-layout';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { ReportCategory, Ticket } from '@/data/models/ticket';
import { ReportNeedHelp } from './report-need-help';
import { TrackSearch } from './track-search';
import { TrackView } from './track-view';

const { track } = reportTrackCopy;

type TrackPageProps = {
  /** The ID from the address, as written; `null` on /track. */
  rawId: string | null;
  /** The normalised ID when it has the ticket ID format, otherwise `null`. */
  ticketId: string | null;
  ticket: Ticket | null;
  categories: readonly ReportCategory[];
};

/** /track and /track/[id]: the search, and under it the result when the ID is well formed. */
export function TrackPage({ rawId, ticketId, ticket, categories }: TrackPageProps) {
  return (
    <DocsLayout
      currentHref={routes.reportTrack.track}
      onThisPage={
        ticketId
          ? [
              { id: 'status', label: track.onThisPage.status },
              { id: 'updates', label: track.onThisPage.updates },
              { id: 'report', label: track.onThisPage.report },
            ]
          : []
      }
      aside={<ReportNeedHelp withReportLink />}
    >
      <div className="flex flex-col gap-8">
        <DocsPageHead
          title={track.header.title}
          lede={track.header.lede}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            {
              label: reportTrackCopy.shared.breadcrumb.section,
              href: routes.reportTrack.overview,
            },
          ]}
          breadcrumbCurrent={reportTrackCopy.shared.breadcrumb.track}
        >
          <TrackSearch initialValue={rawId ?? ''} />
          <noscript>
            <p className="type-body-s text-gray-600">{track.noscript}</p>
          </noscript>
        </DocsPageHead>
        {ticketId ? (
          <div className="flex flex-col gap-8 border-t border-gray-200 pt-8">
            <TrackView ticketId={ticketId} serverTicket={ticket} categories={categories} />
          </div>
        ) : null}
      </div>
    </DocsLayout>
  );
}
