import { developerDashboard } from '@/data/mock/staff-dashboard';
import type { DeveloperDashboard } from '@/data/models/staff-dashboard';

export async function getDeveloperDashboard(): Promise<DeveloperDashboard> {
  return developerDashboard;
}
