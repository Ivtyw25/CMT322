'use client';

import { UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { AdminPanel } from '@/features/admin/panel';
import { useAnnounce } from '@/lib/announce/announcer';
import { useStaffSession } from '@/lib/staff-session';
import { useTickets } from '@/lib/tickets';
import { waitingBreakdown, waitingTickets } from './dashboard-figures';

const copy = adminCopy.dashboard.unclaimed;

/**
 * Pending tickets nobody has picked up, oldest first, on both dashboards. "I'm working on this"
 * claims the ticket (it becomes In progress and leaves this list); the ticket ID opens it.
 */
export function UnclaimedTickets({ className }: { className?: string }) {
  const { tickets, now, claim } = useTickets();
  const { staff } = useStaffSession();
  const announce = useAnnounce();
  const list = useRef<HTMLDivElement>(null);
  const nowIso = now();
  const waiting = useMemo(() => waitingTickets(tickets, nowIso), [tickets, nowIso]);

  function take(ticketId: string) {
    if (!staff) return;
    claim(ticketId, staff);
    announce(copy.claimed(ticketId, staff.name));
    list.current?.focus();
  }

  return (
    <AdminPanel
      headingId="unclaimed-heading"
      title={copy.title}
      hint={copy.hint}
      flush
      className={className}
      action={
        <Link
          href={routes.admin.ticketsByStatus('pending')}
          className="shrink-0 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
        >
          {copy.viewAll}
        </Link>
      }
    >
      <div ref={list} tabIndex={-1} className="border-t border-gray-200 outline-none">
        {waiting.length === 0 ? (
          <p className="px-5 py-6 type-body-s text-gray-600">{copy.empty}</p>
        ) : (
          <ul aria-label={copy.listLabel}>
            {waiting.map(({ ticket, waitedMs, overdue }) => {
              const waited = waitingBreakdown(waitedMs);
              return (
                <li
                  key={ticket.id}
                  className="flex flex-col gap-3 border-b border-gray-200 px-5 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
                >
                  <Link
                    href={routes.admin.ticket(ticket.id)}
                    className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-sm"
                  >
                    <span className="type-body-s-medium text-primary-700">{ticket.id}</span>
                    <span className="type-body-s wrap-anywhere text-gray-900">
                      {ticket.subject}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 type-body-xs text-gray-600">
                      <span>
                        <span className="sr-only">{copy.areaLabel}: </span>
                        {ticket.areaLabel}
                      </span>
                      <span className="flex min-h-5 items-center gap-1">
                        <span className="sr-only">{copy.waitingLabel}: </span>
                        {overdue ? <Tag kind="overdue" /> : copy.waited[waited.unit](waited.n)}
                      </span>
                    </span>
                  </Link>
                  <Button
                    variant="secondary"
                    icon={<UserCheck aria-hidden className="size-4" />}
                    onClick={() => take(ticket.id)}
                    className="shrink-0 self-start sm:self-auto"
                  >
                    {copy.claim}
                    <span className="sr-only">{` ${ticket.id}`}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminPanel>
  );
}
