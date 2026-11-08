'use client';

import { useMemo } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { NotificationsPanel } from '@/features/admin/notifications/notifications-panel';
import { AdminPageHead } from '@/features/admin/page-head';
import { AdminPanel } from '@/features/admin/panel';
import { useTickets } from '@/lib/tickets';
import { authorityFigures } from './dashboard-figures';
import { TicketCountCards } from './ticket-count-cards';
import { UnclaimedTickets } from './unclaimed-tickets';

const copy = adminCopy.dashboard.authority;

const typeShade = {
  complaint: 'bg-primary-700',
  inquiry: 'bg-primary-300',
} as const;

/** Dashboard for the government authority (Figma 113:4668). Every figure comes from the tickets. */
export function AuthorityDashboard() {
  const { tickets } = useTickets();
  const figures = useMemo(() => authorityFigures(tickets), [tickets]);
  const maxArea = Math.max(1, ...figures.openByArea.map((row) => row.count));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHead
        title={adminCopy.dashboard.title}
        intro={copy.intro}
        action={<ButtonLink href={routes.admin.tickets}>{copy.openQueue}</ButtonLink>}
      />

      <TicketCountCards />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <UnclaimedTickets className="xl:flex-1" />

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

      <NotificationsPanel />
    </div>
  );
}
