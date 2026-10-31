import { Phone } from 'lucide-react';
import Link from 'next/link';
import { InfoList, type InfoListItem } from '@/components/ui/info-list';
import { routes } from '@/config/routes';
import { commonCopy } from '@/content/common';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';
import type { SiteInfo } from '@/data/models/site-info';

const { glance, help } = projectCopy.station;

export type Neighbour = { code: string; name: string; distanceKm: number | null };

/** "Station at a glance": code, line, type, segment, neighbours, interchanges and landmarks. */
export function StationGlance({
  station,
  neighbours,
}: {
  station: Station;
  neighbours: readonly Neighbour[];
}) {
  const items: InfoListItem[] = [
    { id: 'code', label: glance.labels.code, value: station.code },
    { id: 'line', label: glance.labels.line, value: commonCopy.lineName },
    { id: 'type', label: glance.labels.type, value: uiCopy.station.elevated },
    {
      id: 'segment',
      label: glance.labels.segment,
      value: glance.segmentValue(station.segment, uiCopy.station.segments[station.segment]),
    },
    {
      id: 'connects',
      label: glance.labels.connectsTo,
      value: (
        <ul className="flex flex-col gap-1">
          {neighbours.map((neighbour) => (
            <li key={neighbour.code}>
              <Link
                href={routes.project.station(neighbour.code)}
                className="hit-area text-primary-700 hover:underline"
              >
                {`${neighbour.code} ${neighbour.name}`}
              </Link>
              {neighbour.distanceKm !== null
                ? `, ${uiCopy.station.distance(neighbour.distanceKm)}`
                : ''}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'interchange',
      label: glance.labels.interchange,
      value:
        station.interchanges.length > 0 ? station.interchanges.join(', ') : glance.noInterchange,
    },
    ...(station.nearby.length > 0
      ? [{ id: 'nearby', label: glance.labels.nearby, value: station.nearby.join(', ') }]
      : []),
  ];
  return (
    <section
      aria-labelledby="station-glance"
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-surface p-5"
    >
      <h2 id="station-glance" className="type-body-m-semibold text-gray-900">
        {glance.title}
      </h2>
      <InfoList items={items} className="[&_dt]:w-24 [&_dt]:md:w-24" />
    </section>
  );
}

/** "Urgent problem at the worksite?": the careline and the 999 reminder. */
export function StationUrgentHelp({ careline }: { careline: SiteInfo['careline'] }) {
  return (
    <section
      aria-labelledby="station-urgent"
      className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-surface p-5"
    >
      <h2 id="station-urgent" className="type-body-s-semibold text-gray-900">
        {help.title}
      </h2>
      <a
        href={careline.tel}
        className="hit-area flex w-fit items-center gap-2 type-body-s-medium text-primary-700 hover:underline"
      >
        <Phone aria-hidden className="size-4" />
        {uiCopy.docsPage.needHelp.careline(careline.label, careline.number)}
      </a>
      <p className="type-body-xs text-gray-600">{help.body}</p>
    </section>
  );
}
