import type { StaffProgressUpdate } from '@/data/models/staff-content';
import {
  STATION_STAGE_ORDER,
  type StationCode,
  type StationProgress,
  type StationStage,
  type StationStageId,
} from '@/data/models/station';

/** Published, or scheduled and its day has come. */
function isLive(update: StaffProgressUpdate, today: string): boolean {
  return (
    update.state === 'published' ||
    (update.state === 'scheduled' && update.date !== '' && update.date <= today)
  );
}

/** A station's live progress updates, newest first. */
export function liveUpdatesFor(
  code: StationCode | string,
  updates: readonly StaffProgressUpdate[],
  today: string,
): StaffProgressUpdate[] {
  return updates
    .filter((update) => update.stationCode === code && isLive(update, today))
    .sort((a, b) => b.date.localeCompare(a.date) || b.savedAt.localeCompare(a.savedAt));
}

/**
 * The station's progress as the public sees it: the newest live update that sets a percentage
 * gives the percentage, the current stage and the date. Without one, the station record's.
 */
export function liveProgress(
  progress: StationProgress | null,
  newestFirst: readonly StaffProgressUpdate[],
): StationProgress | null {
  const latest = newestFirst.find((update) => update.percent !== null);
  if (!latest || latest.percent === null) return progress;
  return { percent: latest.percent, currentStageId: latest.stage, updatedAt: latest.date };
}

/**
 * The six stages with `current` in progress: earlier stages are done (a stage that was not done
 * yet is completed in the update's month), later ones planned.
 */
export function stagesAt(
  stages: readonly StationStage[],
  current: StationStageId,
  updatedAt: string,
): StationStage[] {
  const currentAt = STATION_STAGE_ORDER.indexOf(current);
  return stages.map((stage): StationStage => {
    const at = STATION_STAGE_ORDER.indexOf(stage.id);
    if (at < currentAt) {
      return stage.status === 'done'
        ? stage
        : { id: stage.id, status: 'done', completedIn: updatedAt.slice(0, 7) };
    }
    if (at === currentAt) return { id: stage.id, status: 'in-progress' };
    return stage.status === 'planned'
      ? stage
      : { id: stage.id, status: 'planned', when: '', isTarget: false };
  });
}
