'use client';

import { Button } from '@/components/ui/button';
import { adminCopy } from '@/content/admin';
import { AdminPanel } from '@/features/admin/panel';
import { useAnnounce } from '@/lib/announce/announcer';
import { useStaffNotifications } from '@/lib/staff-notifications';
import { NotificationList } from './notification-list';

const copy = adminCopy.notifications;
const MAX_SHOWN = 8;

/** The dashboard's "Notifications" panel: the same feed as the bell, with "Mark all as read". */
export function NotificationsPanel() {
  const { items, unreadCount, markRead, markAllRead } = useStaffNotifications();
  const announce = useAnnounce();

  return (
    <AdminPanel
      headingId="notifications-heading"
      title={copy.title}
      hint={copy.hint}
      flush
      action={
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
      }
    >
      {items.length === 0 ? (
        <p className="border-t border-gray-200 px-5 py-6 type-body-s text-gray-600">{copy.empty}</p>
      ) : (
        <div className="border-t border-gray-200">
          <NotificationList
            items={items.slice(0, MAX_SHOWN)}
            onOpen={(item) => markRead(item.id)}
          />
        </div>
      )}
    </AdminPanel>
  );
}
