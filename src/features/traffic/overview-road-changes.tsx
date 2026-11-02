import { Calendar, CircleCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Tag } from '@/components/ui/tag';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import type { Announcement } from '@/data/models/announcement';
import { formatDateRange } from '@/lib/format/dates';
import { formatHourRange } from '@/lib/format/times';

const copy = trafficCopy.overview.week;

/** "12 Oct 2026 to Jul 2027", plus the working hours for night works. */
function dateTextOf(item: Announcement): string {
  const [from, to] = formatDateRange(item.startDate, item.endDate);
  if (!item.dailyHours) return copy.dateRange(from, to);
  const [fromHour, toHour] = formatHourRange(item.dailyHours.from, item.dailyHours.to);
  return copy.dateRangeHours(from, to, fromHour, toHour);
}

const metaClass = 'flex items-start gap-1.5 type-body-s text-gray-600';
const textLinkClass =
  'hit-area type-body-s-semibold text-primary-700 transition-colors duration-(--duration-fast) hover:underline';

/** "Road changes this week" (Figma 66:2206): status, title, place and dates, a link to the map. */
export function OverviewRoadChanges({
  headingId,
  items,
}: {
  headingId: string;
  items: readonly Announcement[];
}) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <h2 id={headingId} tabIndex={-1} className="type-heading-xs lg:type-heading-s">
        {copy.title}
      </h2>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="flex items-center gap-2 border-y border-gray-200 py-6 type-body-m text-gray-700">
            <CircleCheck aria-hidden className="size-5 shrink-0 text-success-600" />
            {copy.empty.title}
          </p>
        ) : (
          <ul
            aria-label={copy.listLabel}
            className="divide-y divide-gray-200 border-y border-gray-200"
          >
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-4">
                <div className="flex min-w-0 flex-col items-start gap-1.5">
                  <Tag kind={item.status} />
                  <h3 className="type-body-m-semibold text-gray-900">{item.title}</h3>
                  <ul className="flex flex-col gap-1 md:flex-row md:flex-wrap md:gap-x-4">
                    <li className={metaClass}>
                      <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gray-500" />
                      <span>
                        <VisuallyHidden>{copy.locationLabel}: </VisuallyHidden>
                        {item.location}
                      </span>
                    </li>
                    <li className={metaClass}>
                      <Calendar aria-hidden className="mt-0.5 size-4 shrink-0 text-gray-500" />
                      <span>
                        <VisuallyHidden>{copy.datesLabel}: </VisuallyHidden>
                        {dateTextOf(item)}
                      </span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={routes.traffic.mapFocus(item.id)}
                  aria-label={copy.viewOnMapNamed(item.title)}
                  className={`${textLinkClass} shrink-0`}
                >
                  {copy.viewOnMap}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={routes.traffic.announcements}
          className={`${textLinkClass} inline-flex w-fit items-center py-2.5`}
        >
          {copy.seeAll}
        </Link>
      </div>
    </section>
  );
}
