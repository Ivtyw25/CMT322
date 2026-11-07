'use client';

import { LogOut } from 'lucide-react';
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
  pendingCount: number;
  onNavigate?: () => void;
  onSignOut: () => void;
  className?: string;
};

/** The staff sidebar (Figma 113:4669): brand, the role's navigation and the signed-in account. */
export function AdminSidebar({
  staff,
  pathname,
  pendingCount,
  onNavigate,
  onSignOut,
  className,
}: AdminSidebarProps) {
  const groups = adminNav[staff.role];
  return (
    <div className={cn('flex min-h-0 flex-col gap-7 bg-primary-900 px-4 pt-6 pb-5', className)}>
      <div className="flex flex-col gap-1.5 pl-2">
        <Logo
          tone="onDark"
          href={routes.admin.dashboard}
          label={adminCopy.shell.brandLabel}
          onClick={onNavigate}
        />
        <p className="type-body-xs-medium text-static-on-navy-200">{adminCopy.shell.portalName}</p>
      </div>

      <nav aria-label={adminCopy.shell.navLabel} className="flex flex-col gap-5 overflow-y-auto">
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
                const showBadge = 'pendingBadge' in item && item.pendingBadge && pendingCount > 0;
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
                            {pendingCount}
                          </span>
                          <span className="sr-only">
                            {adminCopy.nav.pendingBadge(pendingCount)}
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
