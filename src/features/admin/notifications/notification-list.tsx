import Link from 'next/link';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { cn } from '@/lib/cn';
import { formatShortDateTime } from '@/lib/format/date-time';
import type { StaffNotificationItem } from '@/lib/staff-notifications';

const copy = adminCopy.notifications;

type NotificationListProps = {
  items: readonly StaffNotificationItem[];
  /** Called when a notification is opened, to mark it read. */
  onOpen: (item: StaffNotificationItem) => void;
};

/**
 * The notifications, newest first. Each one says who, what (a short excerpt), the ticket and when,
 * and links to the ticket. Unread ones have a dot, a heavier line and an "Unread" label.
 */
export function NotificationList({ items, onOpen }: NotificationListProps) {
  return (
    <ul aria-label={copy.listLabel}>
      {items.map((item) => (
        <li key={item.id} className="border-t border-gray-200 first:border-t-0">
          <Link
            href={routes.admin.ticket(item.ticketId)}
            onClick={() => onOpen(item)}
            className="flex gap-3 px-5 py-3 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2"
          >
            <span
              aria-hidden
              className={cn(
                'mt-1.5 size-2 shrink-0 rounded-full',
                item.read ? 'bg-transparent' : 'bg-primary-600',
              )}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span
                className={cn(
                  'wrap-anywhere',
                  item.read ? 'type-body-s text-gray-700' : 'type-body-s-semibold text-gray-900',
                )}
              >
                {item.read ? null : <span className="sr-only">{copy.unread}: </span>}
                {copy.kinds[item.kind](item.actor)}
              </span>
              <span className="type-body-s wrap-anywhere text-gray-600">
                {copy.excerpt(item.excerpt)}
              </span>
              <span className="flex flex-wrap gap-x-3 type-body-xs text-gray-500">
                <span>{item.ticketId}</span>
                <time dateTime={item.at}>{formatShortDateTime(item.at)}</time>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
