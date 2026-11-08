'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useStaffSession } from '@/lib/staff-session';
import { useTickets } from '@/lib/tickets';
import { notificationsFor, type StaffNotification } from './notifications';
import { readNotificationStore } from './read-store';

export type StaffNotificationItem = StaffNotification & { read: boolean };

type StaffNotificationsValue = {
  /** The signed-in staff member's notifications, newest first. */
  items: readonly StaffNotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

/** The notifications of the signed-in staff member, with their read state kept in this browser. */
export function useStaffNotifications(): StaffNotificationsValue {
  const { staff } = useStaffSession();
  const { tickets } = useTickets();
  const readIds = useSyncExternalStore(
    readNotificationStore.subscribe,
    readNotificationStore.getSnapshot,
    readNotificationStore.getServerSnapshot,
  );
  const staffId = staff?.id ?? null;

  const items = useMemo(() => {
    if (!staffId) return [];
    const read = new Set(readIds[staffId] ?? []);
    return notificationsFor(tickets, staffId).map((item) => ({ ...item, read: read.has(item.id) }));
  }, [tickets, staffId, readIds]);

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const markRead = useCallback(
    (id: string) => {
      if (staffId) readNotificationStore.markRead(staffId, [id]);
    },
    [staffId],
  );
  const markAllRead = useCallback(() => {
    if (staffId) {
      readNotificationStore.markRead(
        staffId,
        items.map((item) => item.id),
      );
    }
  }, [staffId, items]);

  return { items, unreadCount, markRead, markAllRead };
}
