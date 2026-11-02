import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import type { RouteStation } from './route-station';

type StationCardProps = { station: RouteStation; onClear: () => void };

/** The selected station: code, name, what it serves, and a link to its page. */
export function StationCard({ station, onClear }: StationCardProps) {
  const copy = trafficCopy.route;
  return (
    <section
      id="station-card"
      aria-label={station.name}
      className="flex flex-col gap-2 rounded-xl border border-primary-200 bg-primary-50 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="rounded-md bg-primary-600 px-2 py-0.5 type-body-s-semibold text-static-white">
            {station.code}
          </span>
          <h2 className="type-heading-3xs text-gray-900">{station.name}</h2>
        </div>
        <Button
          variant="ghost"
          className="py-0"
          aria-label={copy.selected.clearLabel(station.name)}
          onClick={onClear}
        >
          {copy.selected.clear}
        </Button>
      </div>
      {station.isProvisionalName ? (
        <p className="type-body-xs text-gray-600">{copy.stationList.provisionalName}</p>
      ) : null}
      <p className="type-body-s text-gray-700">{station.serves}</p>
      <Link
        href={routes.project.station(station.code)}
        className="hit-area w-fit type-body-s-semibold text-primary-700 hover:underline"
      >
        {copy.selected.viewStation}
      </Link>
    </section>
  );
}
