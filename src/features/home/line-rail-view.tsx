import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import type { Station } from '@/data/models/station';
import { stationDescription, stationHref } from './line-station';

/** All stations as the vertical line rail: the phone view and Route view up to 1279 px. */
export function LineRailView({ stations }: { stations: readonly Station[] }) {
  return (
    <LineRail variant="page">
      {stations.map((station) => (
        <LineRailStop
          key={station.code}
          variant="page"
          code={station.code}
          title={station.name}
          description={stationDescription(station)}
          href={stationHref(station.code)}
        />
      ))}
    </LineRail>
  );
}
