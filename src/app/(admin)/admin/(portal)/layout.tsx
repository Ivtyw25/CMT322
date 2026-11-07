import { getDeveloperDashboard } from '@/data/api/staff-dashboard';
import { AdminShell } from '@/features/admin/layout/admin-shell';

/** Every staff page except log in: sidebar, top bar and the signed-in check. */
export default async function PortalLayout({ children }: LayoutProps<'/'>) {
  const developer = await getDeveloperDashboard();
  return <AdminShell attentionCount={developer.attention.length}>{children}</AdminShell>;
}
