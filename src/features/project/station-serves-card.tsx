import Link from 'next/link';
import { routes } from '@/config/routes';
import type { Station } from '@/data/models/station';

export const DEFAULT_SERVES_CODE = 'S13';

type ServesStation = Pick<Station, 'code' | 'name' | 'subtitle' | 'serves'>;

/** The code chip, linked name and "serves" line of one station, on the pale blue card. */
export function StationServesCard({ station }: { station: ServesStation }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-primary-50 p-4">
      <span className="flex h-6 w-11 shrink-0 items-center justify-center rounded-md bg-primary-600 type-body-xs-semibold text-static-white">
        {station.code}
      </span>
      <div className="flex flex-col gap-0.5">
        <Link
          href={routes.project.station(station.code)}
          className="inline-flex min-h-11 items-center type-body-s-semibold text-gray-900 hover:text-primary-700 hover:underline md:min-h-0"
        >
          {station.name}
        </Link>
        <p className="type-body-s text-gray-700">{station.serves || station.subtitle}</p>
      </div>
    </div>
  );
}
