import { adminCopy } from '@/content/admin';
import { getAuthorityDashboard, getDeveloperDashboard } from '@/data/api/staff-dashboard';
import { DashboardPage } from '@/features/admin/dashboard/dashboard-page';

export const metadata = adminCopy.meta.dashboard;

export default async function AdminDashboardPage() {
  const [authority, developer] = await Promise.all([
    getAuthorityDashboard(),
    getDeveloperDashboard(),
  ]);
  return <DashboardPage authority={authority} developer={developer} />;
}
