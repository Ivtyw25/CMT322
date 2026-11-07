import { authorityDashboard, developerDashboard } from '@/data/mock/staff-dashboard';
import type { AuthorityDashboard, DeveloperDashboard } from '@/data/models/staff-dashboard';

export async function getAuthorityDashboard(): Promise<AuthorityDashboard> {
  return authorityDashboard;
}

export async function getDeveloperDashboard(): Promise<DeveloperDashboard> {
  return developerDashboard;
}
