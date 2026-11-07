'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffTicketStatus } from '@/data/models/staff-ticket';
import type { AuthorityDashboard as AuthorityDashboardData } from '@/data/models/staff-dashboard';
import { AdminPageHead } from '@/features/admin/page-head';
import { AdminPanel } from '@/features/admin/panel';
import { useStaffTickets } from '@/features/admin/tickets/staff-tickets-provider';
import { StatCard } from './stat-card';

const copy = adminCopy.dashboard.authority;

const typeShade = {
  complaint: 'bg-primary-700',
  feedback: 'bg-primary-500',
  inquiry: 'bg-primary-300',
} as const;

const rowGrid = 'md:grid-cols-[9.375rem_1fr_9.375rem_6rem]';

/** Dashboard for the government authority (Figma 113:4668). */
export function AuthorityDashboard({ data }: { data: AuthorityDashboardData }) {
  const { tickets, getTicket } = useStaffTickets();
  const count = (status: StaffTicketStatus) =>
    tickets.filter((ticket) => ticket.status === status).length;
  const maxArea = Math.max(...data.openByArea.map((row) => row.count));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHead
        title={adminCopy.dashboard.title}
        intro={`${copy.intro} ${adminCopy.page.updated(data.updatedAt)}`}
        action={<ButtonLink href={routes.admin.tickets}>{copy.openQueue}</ButtonLink>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={copy.stats.newToday.label}
          value={String(data.newToday.count)}
          hint={copy.stats.newToday.hint(data.newToday.moreThanYesterday)}
        />
        <StatCard
          label={copy.stats.waiting.label}
          value={String(count('pending'))}
          hint={copy.stats.waiting.hint(data.pastTarget)}
          tone="danger"
        />
        <StatCard
          label={copy.stats.inProgress.label}
          value={String(count('in-progress'))}
          hint={copy.stats.inProgress.hint}
        />
        <StatCard
          label={copy.stats.resolved.label}
          value={String(count('resolved'))}
          hint={copy.stats.resolved.hint(data.averageDaysToResolve)}
        />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <AdminPanel
          headingId="needs-reply-heading"
          title={copy.needsReply.title}
          hint={copy.needsReply.hint}
          flush
          className="xl:flex-1"
          action={
            <Link
              href={routes.admin.ticketsByStatus('pending')}
              className="shrink-0 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
            >
              {copy.needsReply.viewAll}
            </Link>
          }
        >
          {data.needsReply.length === 0 ? (
            <p className="border-t border-gray-200 px-5 py-6 type-body-s text-gray-600">
              {copy.needsReply.empty}
            </p>
          ) : (
            <div className="border-t border-gray-200">
              <div
                aria-hidden
                className={`hidden gap-4 border-b border-gray-200 bg-gray-50 px-5 py-2 type-body-xs-semibold text-gray-600 md:grid ${rowGrid}`}
              >
                <span>{copy.needsReply.columns.ticket}</span>
                <span>{copy.needsReply.columns.subject}</span>
                <span>{copy.needsReply.columns.area}</span>
                <span>{copy.needsReply.columns.waiting}</span>
              </div>
              <ul aria-label={copy.needsReply.tableLabel}>
                {data.needsReply.map((row) => {
                  const ticket = getTicket(row.ticketId);
                  if (!ticket) return null;
                  return (
                    <li key={row.ticketId} className="border-b border-gray-200 last:border-b-0">
                      <Link
                        href={routes.admin.ticket(ticket.id)}
                        className={`grid gap-x-4 gap-y-1 px-5 py-3 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2 md:items-center ${rowGrid}`}
                      >
                        <span className="type-body-s-medium text-primary-700">{ticket.id}</span>
                        <span className="type-body-s text-gray-900">{ticket.subject}</span>
                        <span className="type-body-s text-gray-600">
                          <span className="md:sr-only">{copy.needsReply.areaLabel}: </span>
                          {ticket.areaLabel}
                        </span>
                        <span className="flex min-h-5 items-center gap-1 type-body-s text-gray-600">
                          <span className="md:sr-only">{copy.needsReply.waitingLabel}:</span>
                          {row.overdue ? <Tag kind="overdue" /> : row.waiting}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </AdminPanel>

        <div className="flex flex-col gap-4 xl:w-90 xl:shrink-0">
          <AdminPanel headingId="by-area-heading" title={copy.byArea.title}>
            <ul className="flex flex-col gap-3">
              {data.openByArea.map((row) => (
                <li key={row.areaLabel} className="flex flex-col gap-1">
                  <p className="flex gap-2 type-body-s">
                    <span className="min-w-0 flex-1 text-gray-800">{row.areaLabel}</span>
                    <span className="type-body-s-semibold text-gray-900">{row.count}</span>
                  </p>
                  <span aria-hidden className="block h-2 overflow-hidden rounded-sm bg-gray-100">
                    <span
                      className="block h-2 rounded-sm bg-primary-600"
                      style={{ width: `${Math.min(100, (row.count / maxArea) * 100)}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </AdminPanel>

          <AdminPanel headingId="by-type-heading" title={copy.byType.title}>
            <div aria-hidden className="flex gap-0.5 overflow-hidden rounded-sm">
              {data.byType.map((row) => (
                <span
                  key={row.type}
                  className={`block h-2.5 min-w-px basis-0 ${typeShade[row.type]}`}
                  style={{ flexGrow: row.count }}
                />
              ))}
            </div>
            <ul className="flex flex-col gap-3">
              {data.byType.map((row) => (
                <li key={row.type} className="flex items-center gap-2">
                  <span aria-hidden className={`size-2.5 rounded-xs ${typeShade[row.type]}`} />
                  <span className="min-w-0 flex-1 type-body-s text-gray-800">
                    {adminCopy.tickets.types[row.type]}
                  </span>
                  <span className="type-body-s-semibold text-gray-900">{row.count}</span>
                </li>
              ))}
            </ul>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel headingId="activity-heading" title={copy.activity.title} flush>
        <ul>
          {data.recentActivity.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border-t border-gray-200 px-5 py-3"
            >
              <Clock aria-hidden className="size-4 shrink-0 text-gray-500" />
              <p className="min-w-0 flex-1 type-body-s text-gray-800">{item.text}</p>
              <p className="shrink-0 type-body-xs text-gray-500">{item.when}</p>
            </li>
          ))}
        </ul>
      </AdminPanel>
    </div>
  );
}
