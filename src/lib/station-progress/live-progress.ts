import type { ProgressUpdate } from '@/data/models/progress-update';
import {
  STATION_STAGE_ORDER,
  type StationCode,
  type StationProgress,
  type StationStage,
  type StationStageId,
} from '@/data/models/station';
import { isoDateOf } from '@/lib/format/date-time';

/** Published, or scheduled and its day has come. */
function isLive(update: ProgressUpdate, today: string): boolean {
  return (
    update.state === 'published' ||
    (update.state === 'scheduled' && update.date !== '' && update.date <= today)
  );
}

/** A station's live progress updates, newest first. */
export function liveUpdatesFor(
  code: StationCode | string,
  updates: readonly ProgressUpdate[],
  today: string,
): ProgressUpdate[] {
  return updates
    .filter((update) => update.stationCode === code && isLive(update, today))
    .sort((a, b) => b.date.localeCompare(a.date) || b.savedAt.localeCompare(a.savedAt));
}

/** When an update took effect: its last save, or the day a scheduled update went live if later. */
function takesEffect(update: ProgressUpdate): number {
  return Math.max(Date.parse(update.savedAt), Date.parse(`${update.date}T00:00:00+08:00`) || 0);
}

/**
 * The station's progress from its live updates: the one that took effect last gives the
 * percentage, the current stage and the date. Null before any update (works not started).
 * Last saved rather than newest dated, so whatever the developer sets is what the public sees.
 */
export function progressFrom(live: readonly ProgressUpdate[]): StationProgress | null {
  let latest: ProgressUpdate | null = null;
  for (const update of live) {
    if (!latest || takesEffect(update) > takesEffect(latest)) latest = update;
  }
  if (!latest) return null;
  return {
    percent: latest.percent,
    currentStageId: latest.stage,
    updatedAt: isoDateOf(new Date(takesEffect(latest)).toISOString()),
  };
}

/**
 * The six stages with `current` in progress: earlier stages are done (a stage that was not done
 * yet is completed in the update's month), later ones keep their plan.
 */
function stagesAt(
  base: readonly StationStage[],
  current: StationStageId,
  updatedAt: string,
): StationStage[] {
  const currentAt = STATION_STAGE_ORDER.indexOf(current);
  return base.map((stage): StationStage => {
    const at = STATION_STAGE_ORDER.indexOf(stage.id);
    if (at < currentAt) {
      return stage.status === 'done'
        ? stage
        : { id: stage.id, status: 'done', completedIn: updatedAt.slice(0, 7) };
    }
    if (at === currentAt) return { id: stage.id, status: 'in-progress' };
    return stage;
  });
}

export type StationProgressView = {
  /** Live updates, newest first: the station page timeline. */
  updates: ProgressUpdate[];
  progress: StationProgress | null;
  stages: StationStage[];
};

/**
 * A station's progress as everyone sees it, worked out from its stage base and the progress
 * updates. The station records, the station page and the developer's Progress pages all use this.
 */
export function stationProgressFrom(
  code: StationCode | string,
  base: readonly StationStage[],
  updates: readonly ProgressUpdate[],
  today: string,
): StationProgressView {
  const live = liveUpdatesFor(code, updates, today);
  const progress = progressFrom(live);
  return {
    updates: live,
    progress,
    stages: progress ? stagesAt(base, progress.currentStageId, progress.updatedAt) : [...base],
  };
}
