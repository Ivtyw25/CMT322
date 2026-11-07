import type { Metadata } from 'next';
import { adminCopy } from '@/content/admin';
import { getStaffTicketIds } from '@/data/api/staff-tickets';
import { getReportCategories } from '@/data/api/tickets';
import { TicketDetail } from '@/features/admin/tickets/ticket-detail';

type Params = { params: Promise<{ ticketId: string }> };

const normalise = (raw: string) => decodeURIComponent(raw).trim().toUpperCase();

export async function generateStaticParams() {
  return (await getStaffTicketIds()).map((ticketId) => ({ ticketId }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return adminCopy.meta.ticket(normalise((await params).ticketId));
}

export default async function AdminTicketPage({ params }: Params) {
  const ticketId = normalise((await params).ticketId);
  const categories = await getReportCategories();
  return <TicketDetail ticketId={ticketId} categories={categories} />;
}
