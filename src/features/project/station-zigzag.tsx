import { LineFlow } from '@/components/patterns/line-diagram/line-flow';
import { LineZigzag } from '@/components/patterns/line-diagram/line-zigzag';
import { projectCopy } from '@/content/project';
import type { Station } from '@/data/models/station';
import { DEFAULT_SERVES_CODE, StationServesCard } from './station-serves-card';

/** The stations as the zigzag line of links (as on Home), for screens too narrow for the route diagram. */
export function StationZigzag({ stations }: { stations: readonly Station[] }) {
  const featured = stations.find((station) => station.code === DEFAULT_SERVES_CODE);
  return (
    <div className="flex flex-col gap-6">
      <LineFlow>
        <LineZigzag stations={stations} label={projectCopy.about.stations.title} />
      </LineFlow>
      {featured ? <StationServesCard station={featured} /> : null}
    </div>
  );
}
