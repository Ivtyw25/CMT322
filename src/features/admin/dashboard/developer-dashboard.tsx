'use client';

import { Camera, Map, Megaphone, Plus, TriangleAlert, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type {
  AttentionKind,
  AttentionSection,
  AttentionTone,
  DeveloperDashboard as DeveloperDashboardData,
} from '@/data/models/staff-dashboard';
import { NotificationsPanel } from '@/features/admin/notifications/notifications-panel';
import { AdminPageHead } from '@/features/admin/page-head';
import { AdminPanel } from '@/features/admin/panel';
import { cn } from '@/lib/cn';
import { useStaffSession } from '@/lib/staff-session';
import { useTickets } from '@/lib/tickets';
import { StatCard } from './stat-card';
import { TicketCountCards } from './ticket-count-cards';
import { UnclaimedTickets } from './unclaimed-tickets';

const copy = adminCopy.dashboard.developer;

const attentionIcon: Record<AttentionKind, LucideIcon> = {
  alert: TriangleAlert,
  announcement: Megaphone,
  map: Map,
  progress: Camera,
};

const attentionHref: Record<AttentionSection, string> = {
  announcements: routes.admin.announcements,
  'map-items': routes.admin.mapItems,
  progress: routes.admin.progress,
};

const hintTone: Record<AttentionTone, string> = {
  warning: 'text-warning-700',
  info: 'text-primary-700',
  neutral: 'text-gray-700',
};

const quickActions: readonly { id: string; label: string; href: string; icon: LucideIcon }[] = [
  {
    id: 'announcement',
    label: copy.quickActions.announcement,
    href: routes.admin.announcementNew,
    icon: Megaphone,
  },
  { id: 'map', label: copy.quickActions.mapItem, href: routes.admin.mapItems, icon: Map },
  {
    id: 'progress',
    label: copy.quickActions.progress,
    href: routes.admin.progressNew,
    icon: Camera,
  },
];

/** Dashboard for the project developer (Figma 116:4824). */
export function DeveloperDashboard({ data }: { data: DeveloperDashboardData }) {
  const { staff } = useStaffSession();
  const { tickets } = useTickets();
  const { liveMapItems } = data;
  const mapTotal = liveMapItems.closures + liveMapItems.worksites + liveMapItems.hazards;
  const handling = tickets.filter((ticket) => ticket.handler?.staffId === staff?.id);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHead
        title={adminCopy.dashboard.title}
        intro={`${copy.intro} ${adminCopy.page.updated(data.updatedAt)}`}
        action={<ButtonLink href={routes.admin.announcementNew}>{copy.newAnnouncement}</ButtonLink>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={copy.stats.active.label}
          value={String(data.activeAnnouncements.count)}
          hint={copy.stats.active.hint(data.activeAnnouncements.endingWithinWeek)}
          hintTone="warning"
        />
        <StatCard
          label={copy.stats.scheduled.label}
          value={String(data.scheduled.count)}
          hint={copy.stats.scheduled.hint(data.scheduled.nextStarts)}
        />
        <StatCard
          label={copy.stats.mapItems.label}
          value={String(mapTotal)}
          hint={copy.stats.mapItems.hint(
            liveMapItems.closures,
            liveMapItems.worksites,
            liveMapItems.hazards,
          )}
        />
        <StatCard
          label={copy.stats.progress.label}
          value={data.lastProgressUpdate.date}
          hint={data.lastProgressUpdate.title}
        />
      </div>

      <TicketCountCards />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <AdminPanel
          headingId="attention-heading"
          title={copy.attention.title}
          hint={copy.attention.hint}
          flush
          className="xl:flex-1"
        >
          {data.attention.length === 0 ? (
            <p className="border-t border-gray-200 px-5 py-6 type-body-s text-gray-600">
              {copy.attention.empty}
            </p>
          ) : (
            <ul>
              {data.attention.map((item) => {
                const Icon = attentionIcon[item.kind];
                return (
                  <li key={item.id} className="border-t border-gray-200">
                    <Link
                      href={attentionHref[item.section]}
                      className="flex items-start gap-3.5 px-5 py-3.5 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2"
                    >
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-700"
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="type-body-s-medium text-gray-900">{item.title}</span>
                        <span className={cn('type-body-xs', hintTone[item.tone])}>{item.hint}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </AdminPanel>

        <div className="flex flex-col gap-4 xl:w-90 xl:shrink-0">
          <AdminPanel headingId="quick-actions-heading" title={copy.quickActions.title}>
            <ul className="flex flex-col gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <li key={action.id}>
                    <Link
                      href={action.href}
                      className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 type-body-s-medium text-gray-900 transition-colors duration-(--duration-fast) hover:border-gray-300 hover:bg-gray-50"
                    >
                      <Icon aria-hidden className="size-4.5 shrink-0 text-primary-700" />
                      <span className="min-w-0 flex-1">{action.label}</span>
                      <Plus aria-hidden className="size-4 shrink-0 text-gray-500" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </AdminPanel>

          <AdminPanel
            headingId="handling-heading"
            title={copy.handling.title}
            hint={copy.handling.hint}
            action={
              <Link
                href={routes.admin.tickets}
                className="shrink-0 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
              >
                {copy.handling.viewAll}
              </Link>
            }
          >
            {handling.length === 0 ? (
              <p className="type-body-s text-gray-600">{copy.handling.empty}</p>
            ) : (
              <ul>
                {handling.map((ticket) => (
                  <li key={ticket.id} className="border-t border-gray-200">
                    <Link
                      href={routes.admin.ticket(ticket.id)}
                      className="flex flex-col gap-0.5 py-2.5 transition-colors duration-(--duration-fast) hover:bg-gray-50"
                    >
                      <span className="type-body-s-medium text-gray-900">{ticket.subject}</span>
                      <span className="type-body-xs text-gray-500">{ticket.id}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>
      </div>

      <UnclaimedTickets />
      <NotificationsPanel />
    </div>
  );
}
