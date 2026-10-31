'use client';

import { useState } from 'react';
import { LineDiagram } from '@/components/patterns/line-diagram/line-diagram';
import type { MarkersByStation } from '@/components/patterns/line-diagram/line-markers';
import { LineRailView } from '@/components/patterns/line-diagram/line-rail-view';
import { devCopy } from '@/content/dev';
import type { Station, StationCode } from '@/data/models/station';

const copy = devCopy.traffic;

const MARKERS: MarkersByStation = {
  S09: ['construction', 'hazard'],
  S10: ['construction'],
  S06: ['closure'],
  S20: ['closure', 'construction'],
};

/** The line diagram (1280 px and up) and the rail (below) in select mode, for the gallery. */
export function DemoLineSelect({ stations }: { stations: readonly Station[] }) {
  const [selectedCode, setSelectedCode] = useState<StationCode | null>(null);
  const select = (code: StationCode) =>
    setSelectedCode((current) => (current === code ? null : code));
  const selected = stations.find((station) => station.code === selectedCode);
  return (
    <div className="flex w-full flex-col gap-4">
      <p role="status" className="type-body-s text-gray-700">
        {selected ? copy.lineSelected(selected.name) : copy.lineNone}
      </p>
      <div className="hidden overflow-x-auto xl:block">
        <LineDiagram
          stations={stations}
          mode="select"
          selectedCode={selectedCode}
          onSelect={select}
          markersByStation={MARKERS}
          legend={null}
          describeStation={(station, { markers }) =>
            markers.length > 0
              ? copy.lineStation(station.code, station.name, markers.length)
              : `${station.code} ${station.name}`
          }
        />
      </div>
      <div className="max-w-xl xl:hidden">
        <LineRailView
          stations={stations}
          mode="select"
          label={copy.lineRailLabel}
          selectedCode={selectedCode}
          onSelect={select}
          markersByStation={MARKERS}
          markerNote={copy.lineNote}
        />
      </div>
    </div>
  );
}
