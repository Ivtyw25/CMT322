'use client';

import { ExternalLink, Menu, PanelLeftOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AppearanceMenu } from '@/components/layout/appearance-menu';
import { IconButton } from '@/components/ui/icon-button';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffRole } from '@/data/models/staff';
import { AdminNotifications } from './admin-notifications';

type AdminTopbarProps = {
  role: StaffRole;
  notificationCount: number;
  menuId: string;
  menuOpen: boolean;
  onOpenMenu: () => void;
  /** The desktop sidebar is closed: show the button that opens it again. */
  sidebarCollapsed: boolean;
  sidebarId: string;
  onExpandSidebar: () => void;
};

/** The staff top bar (Figma 112:4704): search, public site link, theme and notifications. */
export function AdminTopbar({
  role,
  notificationCount,
  menuId,
  menuOpen,
  onOpenMenu,
  sidebarCollapsed,
  sidebarId,
  onExpandSidebar,
}: AdminTopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const search = adminCopy.shell.search[role];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;
    router.push(
      role === 'authority' ? routes.admin.ticketsWith(text) : routes.admin.announcementsWith(text),
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-surface px-5 md:gap-4 md:px-8">
      <IconButton
        variant="plain"
        aria-label={adminCopy.shell.openMenu}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={onOpenMenu}
        className="-ml-2 lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </IconButton>
      {sidebarCollapsed ? (
        <IconButton
          variant="plain"
          aria-label={adminCopy.shell.expandSidebar}
          aria-expanded={false}
          aria-controls={sidebarId}
          onClick={onExpandSidebar}
          className="-ml-2 hidden lg:inline-flex"
        >
          <PanelLeftOpen aria-hidden className="size-5" />
        </IconButton>
      ) : null}

      <form
        role="search"
        aria-label={search.label}
        onSubmit={submit}
        className="relative min-w-0 flex-1 md:max-w-105 md:flex-none md:basis-105"
      >
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-500"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={search.label}
          placeholder={search.placeholder}
          autoComplete="off"
          className="min-h-11 w-full truncate rounded-lg border border-gray-200 bg-gray-50 py-2.25 pr-3 pl-9 type-body-s text-gray-900 transition-colors duration-(--duration-fast) ease-(--ease-standard) placeholder:text-gray-500 hover:border-gray-300 focus-visible:border-primary-600 focus-visible:shadow-focus focus-visible:outline-none md:min-h-0"
        />
      </form>

      <div className="hidden flex-1 md:block" />

      <Link
        href={routes.home}
        target="_blank"
        rel="noopener noreferrer"
        className="hit-area flex shrink-0 items-center gap-1.5 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
      >
        <ExternalLink aria-hidden className="size-3.5" />
        <span className="sr-only md:not-sr-only">{adminCopy.shell.publicSite}</span>
        <span className="sr-only">{adminCopy.shell.opensInNewTab}</span>
      </Link>
      <AppearanceMenu />
      <AdminNotifications role={role} count={notificationCount} />
    </header>
  );
}
