import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';

/** The stations as a line rail of links, for screens too narrow for the route diagram. */
export function StationRail({ stations }: { stations: readonly Station[] }) {
  return (
    <LineRail variant="page" label={projectCopy.about.stations.title}>
      {stations.map((station) => (
        <LineRailStop
          key={station.code}
          variant="page"
          code={station.code}
          title={station.name}
          description={
            station.subtitle ??
            (station.isProvisionalName ? uiCopy.station.provisionalName : undefined)
          }
          href={routes.project.station(station.code)}
        />
      ))}
    </LineRail>
  );
}
