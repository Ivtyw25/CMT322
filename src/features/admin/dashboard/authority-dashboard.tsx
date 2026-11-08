'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { AdminPageHead } from '@/features/admin/page-head';
import { AdminPanel } from '@/features/admin/panel';
import { formatFullDateTime, formatShortDateTime } from '@/lib/format/date-time';
import { useTickets } from '@/lib/tickets';
import { authorityFigures, waitingBreakdown, type ActivityItem } from './dashboard-figures';
import { StatCard } from './stat-card';

const copy = adminCopy.dashboard.authority;

const typeShade = {
  complaint: 'bg-primary-700',
  inquiry: 'bg-primary-300',
} as const;

const rowGrid = 'md:grid-cols-[9.375rem_1fr_9.375rem_6rem]';

function activityText(item: ActivityItem): string {
  switch (item.kind) {
    case 'submitted':
      return copy.activity.submitted(item.ticketId, item.name);
    case 'claimed':
      return copy.activity.claimed(item.name, item.ticketId);
    case 'replied':
      return copy.activity.replied(item.name, item.ticketId, item.subject);
  }
}

/** Dashboard for the government authority (Figma 113:4668). Every figure comes from the tickets. */
export function AuthorityDashboard() {
  const { tickets, now } = useTickets();
  const nowIso = now();
  const figures = useMemo(() => authorityFigures(tickets, nowIso), [tickets, nowIso]);
  const maxArea = Math.max(1, ...figures.openByArea.map((row) => row.count));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHead
        title={adminCopy.dashboard.title}
        intro={`${copy.intro} ${adminCopy.page.updated(formatFullDateTime(nowIso))}`}
        action={<ButtonLink href={routes.admin.tickets}>{copy.openQueue}</ButtonLink>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={copy.stats.unclaimed.label}
          value={String(figures.counts.submitted)}
          hint={copy.stats.unclaimed.hint(figures.pastTarget)}
          tone="danger"
        />
        <StatCard
          label={copy.stats.pending.label}
          value={String(figures.counts.pending)}
          hint={copy.stats.pending.hint}
        />
        <StatCard
          label={copy.stats.inProgress.label}
          value={String(figures.counts['in-progress'])}
          hint={copy.stats.inProgress.hint}
        />
        <StatCard
          label={copy.stats.resolved.label}
          value={String(figures.counts.resolved)}
          hint={copy.stats.resolved.hint(figures.averageDaysToResolve)}
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
              href={routes.admin.ticketsByStatus('submitted')}
              className="shrink-0 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
            >
              {copy.needsReply.viewAll}
            </Link>
          }
        >
          {figures.needsReply.length === 0 ? (
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
                {figures.needsReply.map(({ ticket, waitedMs, overdue }) => {
                  const waited = waitingBreakdown(waitedMs);
                  return (
                    <li key={ticket.id} className="border-b border-gray-200 last:border-b-0">
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
                          {overdue ? (
                            <Tag kind="overdue" />
                          ) : (
                            copy.needsReply.waited[waited.unit](waited.n)
                          )}
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
            {figures.openByArea.length === 0 ? (
              <p className="type-body-s text-gray-600">{copy.byArea.empty}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {figures.openByArea.map((row) => (
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
            )}
          </AdminPanel>

          <AdminPanel headingId="by-type-heading" title={copy.byType.title}>
            <div aria-hidden className="flex gap-0.5 overflow-hidden rounded-sm">
              {figures.byType.map((row) => (
                <span
                  key={row.type}
                  className={`block h-2.5 min-w-px basis-0 ${typeShade[row.type]}`}
                  style={{ flexGrow: row.count }}
                />
              ))}
            </div>
            <ul className="flex flex-col gap-3">
              {figures.byType.map((row) => (
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
        {figures.activity.length === 0 ? (
          <p className="border-t border-gray-200 px-5 py-6 type-body-s text-gray-600">
            {copy.activity.empty}
          </p>
        ) : (
          <ul>
            {figures.activity.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 border-t border-gray-200 px-5 py-3"
              >
                <Clock aria-hidden className="size-4 shrink-0 text-gray-500" />
                <p className="min-w-0 flex-1 type-body-s wrap-anywhere text-gray-800">
                  {activityText(item)}
                </p>
                <p className="shrink-0 type-body-xs text-gray-500">
                  {formatShortDateTime(item.at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
