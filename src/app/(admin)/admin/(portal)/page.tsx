import { adminCopy } from '@/content/admin';
import { getDeveloperDashboard } from '@/data/api/staff-dashboard';
import { DashboardPage } from '@/features/admin/dashboard/dashboard-page';

export const metadata = adminCopy.meta.dashboard;

export default async function AdminDashboardPage() {
  const developer = await getDeveloperDashboard();
  return <DashboardPage developer={developer} />;
}
