import type { Metadata } from 'next';
import { getNow } from '@/data/api/clock';
import { getStaffMembers } from '@/data/api/staff';
import { getAssignees, getReplyTemplates, getStaffTickets } from '@/data/api/staff-tickets';
import { StaffTicketsProvider } from '@/features/admin/tickets/staff-tickets-provider';
import { StaffSessionProvider } from '@/lib/staff-session';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The staff portal: its own session and ticket state, with no commuter header, notice or footer.
 * The log in page and the portal pages (own shell) both sit inside it.
 */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const [members, tickets, assignees, templates, mockNow] = await Promise.all([
    getStaffMembers(),
    getStaffTickets(),
    getAssignees(),
    getReplyTemplates(),
    getNow(),
  ]);
  return (
    <StaffSessionProvider members={members}>
      <StaffTicketsProvider
        tickets={tickets}
        assignees={assignees}
        templates={templates}
        mockNow={mockNow}
      >
        {children}
      </StaffTicketsProvider>
    </StaffSessionProvider>
  );
}
