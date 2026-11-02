import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Announcement } from '@/data/models/announcement';
import { formatDateRange } from '@/lib/format/dates';
import { DocsSection } from './docs-section';

const { traffic: copy } = projectCopy.station;

const linkClass = 'hit-area type-body-s-medium text-primary-700 hover:underline';

function NoticeAction({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link href={href} aria-label={`${label}${copy.actionSuffix(title)}`} className={linkClass}>
      {label}
    </Link>
  );
}

/** "Traffic around this station": up to five active or upcoming notices, then links to the rest. */
export function StationTraffic({
  id,
  name,
  notices,
}: {
  id: string;
  name: string;
  notices: readonly Announcement[];
}) {
  return (
    <DocsSection id={id} title={copy.title}>
      <p className="-mt-2 type-body-m text-gray-600">{copy.lede(name)}</p>
      {notices.length > 0 ? (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-surface">
          {notices.map((notice) => (
            <li key={notice.id}>
              <article
                aria-labelledby={`notice-${notice.id}`}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap gap-2">
                    <Tag kind={notice.type} />
                    <Tag kind={notice.status === 'upcoming' ? 'upcoming' : 'active'} />
                  </div>
                  <h3 id={`notice-${notice.id}`} className="type-body-m-semibold text-gray-900">
                    {notice.title}
                  </h3>
                  <p className="type-body-s text-gray-700">{notice.summary}</p>
                  <div className="flex flex-col gap-1 type-body-xs text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin aria-hidden className="size-3.5 shrink-0" />
                      {notice.road}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar aria-hidden className="size-3.5 shrink-0" />
                      {uiCopy.time.range(...formatDateRange(notice.startDate, notice.endDate))}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <NoticeAction
                    href={routes.traffic.announcement(notice.id)}
                    label={uiCopy.actions.viewNotice}
                    title={notice.title}
                  />
                  <NoticeAction
                    href={routes.traffic.mapFocus(notice.id)}
                    label={uiCopy.actions.viewOnMap}
                    title={notice.title}
                  />
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-surface p-4">
          <p className="type-body-s-semibold text-gray-900">{copy.empty.title(name)}</p>
          <p className="type-body-s text-gray-700">{copy.empty.body}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Link href={routes.traffic.announcements} className={linkClass}>
          {copy.links.announcements}
        </Link>
        <Link href={routes.traffic.map} className={linkClass}>
          {copy.links.map}
        </Link>
      </div>
    </DocsSection>
  );
}
