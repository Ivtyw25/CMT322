import { Camera, LayoutGrid, Inbox, Map, Megaphone, type LucideIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffRole } from '@/data/models/staff';

export type AdminNavItem = {
  id: 'dashboard' | 'tickets' | 'announcements' | 'mapItems' | 'progress';
  label: string;
  href: string;
  icon: LucideIcon;
  /** Items under this path (a ticket page, an editor) keep the item highlighted. */
  matchPrefix: string | null;
  /** Shows the number of pending tickets after the label. */
  pendingBadge?: boolean;
};

export type AdminNavGroup = { id: string; label: string; items: readonly AdminNavItem[] };

const { groups, items } = adminCopy.nav;

const dashboard: AdminNavItem = {
  id: 'dashboard',
  label: items.dashboard,
  href: routes.admin.dashboard,
  icon: LayoutGrid,
  matchPrefix: null,
};

/** What each role sees in the sidebar (Figma 113:4668 and 116:4824). */
export const adminNav = {
  authority: [
    { id: 'overview', label: groups.overview, items: [dashboard] },
    {
      id: 'feedback',
      label: groups.feedback,
      items: [
        {
          id: 'tickets',
          label: items.tickets,
          href: routes.admin.tickets,
          icon: Inbox,
          matchPrefix: routes.admin.tickets,
          pendingBadge: true,
        },
      ],
    },
  ],
  developer: [
    { id: 'overview', label: groups.overview, items: [dashboard] },
    {
      id: 'traffic',
      label: groups.traffic,
      items: [
        {
          id: 'announcements',
          label: items.announcements,
          href: routes.admin.announcements,
          icon: Megaphone,
          matchPrefix: routes.admin.announcements,
        },
        {
          id: 'mapItems',
          label: items.mapItems,
          href: routes.admin.mapItems,
          icon: Map,
          matchPrefix: routes.admin.mapItems,
        },
      ],
    },
    {
      id: 'project',
      label: groups.project,
      items: [
        {
          id: 'progress',
          label: items.progress,
          href: routes.admin.progress,
          icon: Camera,
          matchPrefix: routes.admin.progress,
        },
      ],
    },
  ],
} as const satisfies Record<StaffRole, readonly AdminNavGroup[]>;

export function isNavItemCurrent(item: AdminNavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  return item.matchPrefix !== null && pathname.startsWith(`${item.matchPrefix}/`);
}
