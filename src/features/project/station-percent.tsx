'use client';

import { projectCopy } from '@/content/project';
import { useLiveStation, type LiveStationInput } from './use-live-station';

const { stats: copy } = projectCopy.station;

/** The header's progress figure, from the same live progress as the Construction progress card. */
export function StationPercent(input: LiveStationInput) {
  const { progress } = useLiveStation(input);
  return progress ? copy.progressValue(progress.percent) : copy.progressNotStarted;
}
