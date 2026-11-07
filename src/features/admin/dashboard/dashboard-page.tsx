'use client';

import type {
  AuthorityDashboard as AuthorityDashboardData,
  DeveloperDashboard as DeveloperDashboardData,
} from '@/data/models/staff-dashboard';
import { useStaffSession } from '@/lib/staff-session';
import { AuthorityDashboard } from './authority-dashboard';
import { DeveloperDashboard } from './developer-dashboard';

type DashboardPageProps = {
  authority: AuthorityDashboardData;
  developer: DeveloperDashboardData;
};

/** One route, two dashboards: the signed-in role decides which one shows. */
export function DashboardPage({ authority, developer }: DashboardPageProps) {
  const { staff } = useStaffSession();
  if (!staff) return null;
  return staff.role === 'authority' ? (
    <AuthorityDashboard data={authority} />
  ) : (
    <DeveloperDashboard data={developer} />
  );
}
