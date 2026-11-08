'use client';

import { ChevronsLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import { cn } from '@/lib/cn';
import { initialsOf } from '@/lib/format/person';
import { adminNav, isNavItemCurrent } from './admin-nav';

type AdminSidebarProps = {
  staff: StaffMember;
  pathname: string;
  unclaimedCount: number;
  onNavigate?: () => void;
  onSignOut: () => void;
  /** Desktop only: closes the sidebar. The drawer has its own close button. */
  onCollapse?: () => void;
  /** The element the collapse button controls. */
  sidebarId?: string;
  className?: string;
};

/** The staff sidebar (Figma 113:4669): brand, the role's navigation and the signed-in account. */
export function AdminSidebar({
  staff,
  pathname,
  unclaimedCount,
  onNavigate,
  onSignOut,
  onCollapse,
  sidebarId,
  className,
}: AdminSidebarProps) {
  const groups = adminNav[staff.role];
  return (
    <div
      className={cn(
        'scrollbar-none flex min-h-0 flex-col gap-7 overflow-y-auto overscroll-contain bg-primary-900 px-4 pt-6 pb-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 pl-2">
        <div className="flex flex-col gap-1.5">
          <Logo
            tone="onDark"
            href={routes.admin.dashboard}
            label={adminCopy.shell.brandLabel}
            onClick={onNavigate}
          />
          <p className="type-body-xs-medium text-static-on-navy-200">
            {adminCopy.shell.portalName}
          </p>
        </div>
        {onCollapse ? (
          <button
            type="button"
            aria-controls={sidebarId}
            aria-expanded
            aria-label={adminCopy.shell.collapseSidebar}
            onClick={onCollapse}
            className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-static-on-navy-100 transition-colors duration-(--duration-fast) hover:bg-static-glass hover:text-static-white focus-visible:outline-static-white"
          >
            <ChevronsLeft aria-hidden className="size-4.5" />
          </button>
        ) : null}
      </div>

      <nav aria-label={adminCopy.shell.navLabel} className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-0.5">
            <p
              id={`admin-nav-${group.id}`}
              className="pb-1.5 pl-3 type-body-xs-semibold text-static-on-navy-300"
            >
              {group.label}
            </p>
            <ul aria-labelledby={`admin-nav-${group.id}`} className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const current = isNavItemCurrent(item, pathname);
                const Icon = item.icon;
                const showBadge =
                  'unclaimedBadge' in item && item.unclaimedBadge && unclaimedCount > 0;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'hit-area flex items-center gap-3 rounded-lg px-3 py-2.25 type-body-s-medium',
                        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                        'focus-visible:outline-static-white',
                        current
                          ? 'bg-primary-600 text-static-white'
                          : 'text-static-on-navy-100 hover:bg-static-glass hover:text-static-white',
                      )}
                    >
                      <Icon aria-hidden className="size-4.5 shrink-0" />
                      <span className="min-w-0 flex-1">{item.label}</span>
                      {showBadge ? (
                        <>
                          <span
                            aria-hidden
                            className="rounded-full bg-static-glass-strong px-2 py-px type-body-xs-semibold text-static-white"
                          >
                            {unclaimedCount}
                          </span>
                          <span className="sr-only">
                            {adminCopy.nav.unclaimedBadge(unclaimedCount)}
                          </span>
                        </>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl bg-static-glass p-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-500 type-body-xs-semibold text-static-white"
        >
          {initialsOf(staff.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="type-body-s-semibold text-static-white">{staff.name}</p>
          <p className="type-body-xs text-static-on-navy-200">{adminCopy.roles[staff.role]}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label={adminCopy.shell.logOut}
          className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-static-on-navy-100 transition-colors duration-(--duration-fast) hover:text-static-white focus-visible:outline-static-white"
        >
          <LogOut aria-hidden className="size-4.5" />
        </button>
      </div>
    </div>
  );
}
