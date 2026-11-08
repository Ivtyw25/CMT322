import type { Metadata } from 'next';
import { reportTrackCopy } from '@/content/report-track';
import { getReportCategories, getTicketIds } from '@/data/api/tickets';
import { TrackPage } from '@/features/report-track/track-page';
import { normaliseTicketId, ticketIdProblem } from '@/lib/reports';

const { meta } = reportTrackCopy.track;

type Params = { params: Promise<{ ticketId: string }> };

export async function generateStaticParams() {
  return (await getTicketIds()).map((ticketId) => ({ ticketId }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = normaliseTicketId(decodeURIComponent((await params).ticketId));
  return {
    title: ticketIdProblem(id) ? meta.title : meta.titleTicket(id),
    description: meta.description,
    robots: { index: false },
  };
}

export default async function TrackTicketPage({ params }: Params) {
  const rawId = decodeURIComponent((await params).ticketId);
  const id = normaliseTicketId(rawId);
  const valid = ticketIdProblem(id) === null;
  const categories = await getReportCategories();
  return <TrackPage rawId={rawId} ticketId={valid ? id : null} categories={categories} />;
}
