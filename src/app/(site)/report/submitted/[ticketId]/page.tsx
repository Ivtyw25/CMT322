import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { getReportCategories, getTicket } from '@/data/api/tickets';
import { ReportNeedHelp } from '@/features/report-track/report-need-help';
import { SubmittedView } from '@/features/report-track/submitted-view';
import { normaliseTicketId } from '@/lib/reports';

const { submitted } = reportTrackCopy;

export const metadata: Metadata = {
  title: submitted.meta.title,
  description: submitted.meta.description,
  robots: { index: false },
};

export default async function ReportSubmittedPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const id = normaliseTicketId(decodeURIComponent(ticketId));
  const [ticket, categories] = await Promise.all([getTicket(id), getReportCategories()]);

  return (
    <DocsLayout
      currentHref={routes.reportTrack.report}
      onThisPage={[
        { id: 'ticket-id', label: submitted.onThisPage.ticket },
        { id: 'what-happens-next', label: submitted.onThisPage.next },
        { id: 'what-you-sent', label: submitted.onThisPage.sent },
        { id: 'confirmation-email', label: submitted.onThisPage.email },
      ]}
      aside={<ReportNeedHelp />}
    >
      <SubmittedView ticketId={id} serverTicket={ticket} categories={categories} />
    </DocsLayout>
  );
}
