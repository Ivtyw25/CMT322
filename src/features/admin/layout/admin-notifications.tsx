'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Popover } from 'radix-ui';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffRole } from '@/data/models/staff';
import { cn } from '@/lib/cn';

type AdminNotificationsProps = {
  role: StaffRole;
  /** Tickets waiting to be claimed (authority) or items needing attention (developer). */
  count: number;
};

/** The bell: a small panel that says what is waiting and links to it. */
export function AdminNotifications({ role, count }: AdminNotificationsProps) {
  const copy = adminCopy.shell.notificationPanel;
  const authority = role === 'authority';
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={adminCopy.shell.notifications}
        className={cn(
          'hit-area relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-surface text-gray-800',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:border-gray-300 hover:bg-gray-50',
          'data-[state=open]:border-primary-200 data-[state=open]:bg-primary-50 data-[state=open]:text-primary-700',
        )}
      >
        <Bell aria-hidden className="size-4.5" />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger-600"
          />
        ) : null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            'z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col gap-3 rounded-2xl border border-gray-200 bg-surface p-4 shadow-menu',
            'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
          )}
        >
          <p className="type-body-s text-gray-800">
            {authority ? copy.authority(count) : copy.developer(count)}
          </p>
          <Popover.Close asChild>
            <Link
              href={authority ? routes.admin.ticketsByStatus('submitted') : routes.admin.dashboard}
              className="type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
            >
              {authority ? copy.authorityAction : copy.developerAction}
            </Link>
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
