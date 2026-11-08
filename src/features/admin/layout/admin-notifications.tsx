'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Popover } from 'radix-ui';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { NotificationList } from '@/features/admin/notifications/notification-list';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { useStaffNotifications } from '@/lib/staff-notifications';

const copy = adminCopy.notifications;
const MAX_SHOWN = 5;

/** The bell: the signed-in staff member's notifications, with an unread count. */
export function AdminNotifications() {
  const { items, unreadCount, markRead, markAllRead } = useStaffNotifications();
  const announce = useAnnounce();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={adminCopy.shell.notificationsUnread(unreadCount)}
        className={cn(
          'hit-area relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-surface text-gray-800',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:border-gray-300 hover:bg-gray-50',
          'data-[state=open]:border-primary-200 data-[state=open]:bg-primary-50 data-[state=open]:text-primary-700',
        )}
      >
        <Bell aria-hidden className="size-4.5" />
        {unreadCount > 0 ? (
          <span
            aria-hidden
            className="absolute -top-1.5 -right-1.5 flex min-w-4.5 items-center justify-center rounded-full bg-danger-600 px-1 type-body-xs-semibold text-static-white"
          >
            {unreadCount}
          </span>
        ) : null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            'z-50 flex max-h-[min(32rem,calc(100dvh-5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-surface shadow-menu',
            'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
          )}
        >
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3">
            <h2 className="min-w-0 flex-1 type-heading-3xs text-gray-900">{copy.title}</h2>
            <Button
              variant="ghost"
              disabled={unreadCount === 0}
              onClick={() => {
                markAllRead();
                announce(copy.allRead);
              }}
              className="shrink-0"
            >
              {copy.markAllRead}
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-5 py-6 type-body-s text-gray-600">{copy.empty}</p>
            ) : (
              <NotificationList
                items={items.slice(0, MAX_SHOWN)}
                onOpen={(item) => {
                  markRead(item.id);
                  setOpen(false);
                }}
              />
            )}
          </div>
          <div className="border-t border-gray-200 px-5 py-3">
            <Link
              href={routes.admin.dashboard}
              onClick={() => setOpen(false)}
              className="type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
            >
              {copy.viewAll}
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
