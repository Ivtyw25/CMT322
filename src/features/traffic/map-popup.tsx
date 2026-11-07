import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import type { TrafficEntry } from './traffic-entry';

const linkClass = 'type-body-s-medium text-primary-700 hover:text-primary-800';

/** The details of one road change inside the map's popup (Figma 67:2416). */
export function MapPopup({ entry }: { entry: TrafficEntry }) {
  const copy = trafficCopy.map.popup;
  const firstStation = entry.stationCodes[0];
  const titleId = `popup-${entry.id}`;
  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="flex w-[min(18.75rem,calc(100vw-4rem))] flex-col gap-2"
    >
      <Tag kind={entry.layer} className="self-start" />
      <h3 id={titleId} className="type-heading-3xs text-gray-900">
        {entry.title}
      </h3>
      <p className="type-body-s text-gray-700">{entry.summary}</p>
      <p className="flex items-center gap-2 type-body-s text-gray-700">
        <Calendar aria-hidden className="size-3.5 shrink-0 text-gray-500" />
        {entry.dateText}
      </p>
      {entry.hoursText ? (
        <p className="flex items-center gap-2 type-body-s text-gray-700">
          <Clock aria-hidden className="size-3.5 shrink-0 text-gray-500" />
          {entry.hoursText}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entry.announcementId ? (
          <Link href={routes.traffic.announcement(entry.announcementId)} className={linkClass}>
            {copy.readAnnouncement}
          </Link>
        ) : null}
        {firstStation ? (
          <Link href={routes.reportTrack.reportAt(firstStation)} className={linkClass}>
            {copy.reportProblem}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
