'use client';

import type { StaffMember } from '@/data/models/staff';
import { cn } from '@/lib/cn';
import { AdminSidebar } from './admin-sidebar';

type AdminSidebarFrameProps = {
  id: string;
  staff: StaffMember;
  pathname: string;
  unclaimedCount: number;
  collapsed: boolean;
  onCollapse: () => void;
  onSignOut: () => void;
};

/**
 * From 1024 px: the sidebar at one fixed width, wide enough for every label and the account card
 * on a single line. The sidebar scrolls without a visible scrollbar.
 */
export function AdminSidebarFrame({
  id,
  staff,
  pathname,
  unclaimedCount,
  collapsed,
  onCollapse,
  onSignOut,
}: AdminSidebarFrameProps) {
  return (
    <aside
      id={id}
      className={cn(
        'sticky top-0 hidden h-dvh w-72 shrink-0',
        collapsed ? 'lg:hidden' : 'lg:block',
      )}
    >
      <AdminSidebar
        staff={staff}
        pathname={pathname}
        unclaimedCount={unclaimedCount}
        onSignOut={onSignOut}
        onCollapse={onCollapse}
        sidebarId={id}
        className="h-full"
      />
    </aside>
  );
}
