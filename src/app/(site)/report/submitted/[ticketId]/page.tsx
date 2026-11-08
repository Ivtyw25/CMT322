import type { Metadata } from 'next';
import { reportTrackCopy } from '@/content/report-track';
import { getSiteInfo } from '@/data/api/site-info';
import { getReportCategories } from '@/data/api/tickets';
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
  const [categories, siteInfo] = await Promise.all([getReportCategories(), getSiteInfo()]);

  return <SubmittedView ticketId={id} categories={categories} careline={siteInfo.careline} />;
}
