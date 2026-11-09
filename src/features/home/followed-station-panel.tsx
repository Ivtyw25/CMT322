'use client';

import { Calendar, Construction, MapPin, MessageSquareText, TrafficCone } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Tag, type TagKind } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { TicketStatus } from '@/data/models/ticket';
import { useLiveStation } from '@/features/project/use-live-station';
import { formatDate, formatDateRange } from '@/lib/format/dates';
import { isoDateOf } from '@/lib/format/date-time';
import { lastActivityAt, useTickets } from '@/lib/tickets';
import type { FollowedStationData } from './followed-stations-data';

const copy = homeCopy.followed;
const MAX_REPORTS = 3;

const ticketTag: Record<TicketStatus, TagKind> = {
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

const linkClass =
  'hit-area w-fit type-body-s-medium text-primary-700 transition-colors duration-(--duration-fast) hover:text-primary-800';
const itemLinkClass =
  'type-body-s-medium wrap-anywhere text-gray-900 transition-colors duration-(--duration-fast) hover:text-primary-700';

function Card({
  icon: Icon,
  title,
  footer,
  children,
}: {
  icon: LucideIcon;
  title: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-surface p-5">
      <h4 className="flex items-center gap-2 type-body-m-semibold text-gray-900">
        <Icon aria-hidden className="size-4.5 shrink-0 text-primary-600" />
        {title}
      </h4>
      <div className="flex flex-1 flex-col gap-3">{children}</div>
      <div className="flex flex-col gap-1">{footer}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="type-body-s text-gray-600">{children}</p>;
}

function TrafficCard({ station }: { station: FollowedStationData }) {
  return (
    <Card
      icon={TrafficCone}
      title={copy.traffic.title}
      footer={
        <Link
          href={routes.withHash(routes.project.station(station.code), 'traffic')}
          className={linkClass}
        >
          {copy.traffic.all(station.name)}
        </Link>
      }
    >
      {station.notices.length > 0 ? (
        <ul className="flex flex-col divide-y divide-gray-200">
          {station.notices.map((notice) => (
            <li key={notice.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap gap-2">
                <Tag kind={notice.type} />
                <Tag kind={notice.status === 'upcoming' ? 'upcoming' : 'active'} />
              </div>
              <Link href={routes.traffic.announcement(notice.id)} className={itemLinkClass}>
                {notice.title}
              </Link>
              <p className="flex items-center gap-1.5 type-body-xs text-gray-600">
                <MapPin aria-hidden className="size-3.5 shrink-0" />
                {notice.road}
              </p>
              <p className="flex items-center gap-1.5 type-body-xs text-gray-600">
                <Calendar aria-hidden className="size-3.5 shrink-0" />
                {uiCopy.time.range(...formatDateRange(notice.startDate, notice.endDate))}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{copy.traffic.empty(station.name)}</Empty>
      )}
    </Card>
  );
}

function ConstructionCard({ station, today }: { station: FollowedStationData; today: string }) {
  const { progress, updates } = useLiveStation({
    code: station.code,
    base: station.base,
    updates: station.updates,
    today,
  });
  const latest = updates[0];
  return (
    <Card
      icon={Construction}
      title={copy.construction.title}
      footer={
        <Link
          href={routes.withHash(routes.project.station(station.code), 'progress')}
          className={linkClass}
        >
          {copy.construction.all(station.name)}
        </Link>
      }
    >
      {progress ? (
        <>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="type-heading-xs text-primary-700">
              {projectCopy.station.stats.progressValue(progress.percent)}
            </span>
            <span className="type-body-s text-gray-700">
              {projectCopy.station.construction.summary(
                uiCopy.stationStages[progress.currentStageId],
              )}
            </span>
          </p>
          <div aria-hidden className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary-600"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          {latest ? (
            <div className="flex flex-col gap-0.5">
              <p className="type-body-xs text-gray-500">{copy.construction.latest}</p>
              <p className="type-body-s-medium text-gray-900">{latest.title}</p>
              <p className="flex items-center gap-1.5 type-body-xs text-gray-600">
                <Calendar aria-hidden className="size-3.5 shrink-0" />
                {formatDate(latest.date)}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <Empty>{copy.construction.notStarted}</Empty>
      )}
    </Card>
  );
}

function ReportsCard({ station }: { station: FollowedStationData }) {
  const { tickets } = useTickets();
  const near = tickets
    .filter((ticket) => ticket.stationCode === station.code)
    .slice(0, MAX_REPORTS);
  const reportsCopy = projectCopy.station.reports;
  return (
    <Card
      icon={MessageSquareText}
      title={copy.reports.title}
      footer={
        <>
          <Link
            href={routes.withHash(routes.project.station(station.code), 'reports')}
            className={linkClass}
          >
            {copy.reports.all(station.name)}
          </Link>
          <Link href={routes.reportTrack.reportAt(station.code)} className={linkClass}>
            {copy.reports.report}
          </Link>
        </>
      }
    >
      {near.length > 0 ? (
        <ul className="flex flex-col divide-y divide-gray-200">
          {near.map((ticket) => (
            <li key={ticket.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
              <div className="flex">
                <Tag kind={ticketTag[ticket.status]} />
              </div>
              <Link href={routes.reportTrack.ticket(ticket.id)} className={itemLinkClass}>
                {ticket.subject}
              </Link>
              <p className="type-body-xs text-gray-600">
                {ticket.status === 'resolved'
                  ? reportsCopy.resolved(formatDate(isoDateOf(lastActivityAt(ticket))))
                  : reportsCopy.reported(formatDate(isoDateOf(ticket.submittedAt)))}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{copy.reports.empty(station.name)}</Empty>
      )}
    </Card>
  );
}

/** One followed station on Home: its traffic changes, construction progress and recent reports. */
export function FollowedStationPanel({
  station,
  today,
}: {
  station: FollowedStationData;
  today: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="type-heading-2xs text-gray-900">
          {station.code} {station.name}
        </h3>
        <Link href={routes.project.station(station.code)} className={linkClass}>
          {copy.stationPage(station.name)}
        </Link>
      </div>
      <p className="-mt-3 type-body-s text-gray-600">{station.area}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TrafficCard station={station} />
        <ConstructionCard station={station} today={today} />
        <ReportsCard station={station} />
      </div>
    </div>
  );
}
