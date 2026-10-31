import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';
import { DEFAULT_SERVES_CODE, StationServesCard } from './station-serves-card';

/** The stations as a line rail of links, for screens too narrow for the route diagram. */
export function StationRail({ stations }: { stations: readonly Station[] }) {
  const featured = stations.find((station) => station.code === DEFAULT_SERVES_CODE);
  return (
    <div className="flex flex-col gap-6">
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
      {featured ? <StationServesCard station={featured} /> : null}
    </div>
  );
}
