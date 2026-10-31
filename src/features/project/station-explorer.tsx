'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { projectCopy } from '@/content/project';
import type { Station } from '@/data/models/station';
import { RouteDiagram } from './route-diagram';
import { DEFAULT_SERVES_CODE, StationServesCard } from './station-serves-card';

export type ExplorerStation = Pick<
  Station,
  'code' | 'name' | 'subtitle' | 'isProvisionalName' | 'serves'
>;

const { stations: copy } = projectCopy.about;

const legendDot = 'inline-block size-3.5 rounded-full border-2 border-primary-600 bg-surface';

/** Legend row under the diagram. It only explains the drawing, so it is hidden from screen readers. */
function Legend() {
  return (
    <ul aria-hidden className="flex flex-wrap gap-x-6 gap-y-2 type-body-xs text-gray-700">
      <li className="flex items-center gap-2">
        <span className="h-1 w-6 rounded-full bg-primary-600" />
        {copy.legend.line}
      </li>
      <li className="flex items-center gap-2">
        <MapPin className="size-3.5 text-gray-700" />
        {copy.legend.nearby}
      </li>
      <li className="flex items-center gap-2">
        <span className={legendDot} />
        {copy.legend.station}
      </li>
      <li className="flex items-center gap-2">
        <span className={`${legendDot} border-primary-800`} />
        {copy.legend.interchange}
      </li>
    </ul>
  );
}

/** The route diagram and the card for the selected station. Wide screens only (the page hides it). */
export function StationExplorer({ stations }: { stations: readonly ExplorerStation[] }) {
  const [selectedCode, setSelectedCode] = useState(
    stations.some((station) => station.code === DEFAULT_SERVES_CODE)
      ? DEFAULT_SERVES_CODE
      : (stations[0]?.code ?? ''),
  );
  const selected = stations.find((station) => station.code === selectedCode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-surface p-5">
        <RouteDiagram stations={stations} selectedCode={selectedCode} onSelect={setSelectedCode} />
        <Legend />
      </div>
      <div aria-live="polite" aria-atomic="true">
        {selected ? (
          <StationServesCard station={selected} />
        ) : (
          <p className="rounded-xl bg-primary-50 p-4 type-body-s text-gray-700">
            {copy.selected.hint}
          </p>
        )}
      </div>
    </div>
  );
}
