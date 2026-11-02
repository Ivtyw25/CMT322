import type { Metadata } from 'next';
import { reportTrackCopy } from '@/content/report-track';
import { TrackPage } from '@/features/report-track/track-page';

const { meta } = reportTrackCopy.track;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function TrackSearchPage() {
  return <TrackPage rawId={null} ticketId={null} ticket={null} categories={[]} />;
}
