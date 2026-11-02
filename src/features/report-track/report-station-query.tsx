'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import type { ReportStation } from './report-values';

type ReportStationQueryProps = {
  stations: readonly ReportStation[];
  /** Called with the station named in `?station=` (keep it stable). An unknown code does nothing. */
  onStation: (station: ReportStation) => void;
};

/**
 * Reads `?station=<code>` (any case). A leaf of its own, inside `<Suspense>`, so the rest of the
 * form does not wait for the search params.
 */
export function ReportStationQuery({ stations, onStation }: ReportStationQueryProps) {
  const code = useSearchParams().get('station')?.toUpperCase() ?? null;

  useEffect(() => {
    const station = stations.find((entry) => entry.code === code);
    if (station) onStation(station);
  }, [code, stations, onStation]);

  return null;
}
