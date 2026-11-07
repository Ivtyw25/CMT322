import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { TicketQueue } from '@/features/admin/tickets/ticket-queue';

export const metadata = adminCopy.meta.tickets;

export default function AdminTicketsPage() {
  return (
    <Suspense>
      <TicketQueue />
    </Suspense>
  );
}
