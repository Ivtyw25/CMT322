import { navGroups, type NavGroup } from '@/content/nav';

export type NavGroupId = 'project' | 'traffic' | 'report-track';

export const navGroupList: readonly (NavGroup & { id: NavGroupId })[] = [
  navGroups.project,
  navGroups.traffic,
  navGroups.reportTrack,
];

const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** The nav group a page belongs to, from the route definitions. Account, legal and help: none. */
export function currentGroupId(pathname: string): NavGroupId | null {
  const group = navGroupList.find((candidate) =>
    candidate.items.some((item) => matches(pathname, item.href)),
  );
  return group?.id ?? null;
}

/** The group's own pages (for the section bar and the docs sidebar). */
export function groupById(id: NavGroupId) {
  return navGroupList.find((group) => group.id === id);
}
