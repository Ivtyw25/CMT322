'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { SkipLink } from '@/components/layout/skip-link';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { useAnnounce } from '@/lib/announce/announcer';
import { useMediaQuery } from '@/lib/dom/use-media-query';
import { useStaffSession } from '@/lib/staff-session';
import { useTickets } from '@/lib/tickets';
import { AdminMobileMenu } from './admin-mobile-menu';
import { AdminSidebarFrame } from './admin-sidebar-frame';
import { AdminTopbar } from './admin-topbar';
import { useSidebarLayout } from './use-sidebar-layout';

type AdminShellProps = {
  children: React.ReactNode;
};

/**
 * The staff portal frame (Figma 113:4668): sidebar on desktop, a drawer behind a menu button
 * below 1024 px, and the top bar. Signed-out visitors go to the staff log in page; nothing of
 * the portal is drawn until a staff session is found.
 */
export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const announce = useAnnounce();
  const { status, staff, signOut } = useStaffSession();
  const { unclaimedCount } = useTickets();
  const menuId = useId();
  const sidebarId = useId();
  const sidebar = useSidebarLayout();
  const [menuRequested, setMenuRequested] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  useEffect(() => {
    if (status === 'signed-out') router.replace(routes.admin.login);
  }, [status, router]);

  if (!staff) {
    return (
      <main
        id="main"
        tabIndex={-1}
        aria-busy="true"
        className="flex min-h-dvh items-center justify-center bg-gray-50 type-body-s text-gray-600"
      >
        {adminCopy.shell.checking}
      </main>
    );
  }

  function handleSignOut() {
    signOut();
    announce(adminCopy.shell.loggedOut);
    router.replace(routes.admin.login);
  }

  const menuOpen = menuRequested && !isDesktop;

  return (
    <div className="flex min-h-dvh bg-gray-50">
      <SkipLink />
      <AdminSidebarFrame
        id={sidebarId}
        staff={staff}
        pathname={pathname}
        unclaimedCount={unclaimedCount}
        collapsed={sidebar.collapsed}
        onCollapse={() => sidebar.setCollapsed(true)}
        onSignOut={handleSignOut}
      />
      <AdminMobileMenu
        id={menuId}
        open={menuOpen}
        onOpenChange={setMenuRequested}
        staff={staff}
        pathname={pathname}
        unclaimedCount={unclaimedCount}
        onSignOut={handleSignOut}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          role={staff.role}
          menuId={menuId}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuRequested(true)}
          sidebarCollapsed={sidebar.collapsed}
          sidebarId={sidebarId}
          onExpandSidebar={() => sidebar.setCollapsed(false)}
        />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
