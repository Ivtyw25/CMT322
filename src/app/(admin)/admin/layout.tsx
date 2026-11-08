import type { Metadata } from 'next';
import { getStaffMembers } from '@/data/api/staff';
import { StaffSessionProvider } from '@/lib/staff-session';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The staff portal: its own session, with no commuter header, notice or footer. The log in page and
 * the portal pages (own shell) both sit inside it. Tickets come from the shared ticket store.
 */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const members = await getStaffMembers();
  return <StaffSessionProvider members={members}>{children}</StaffSessionProvider>;
}
