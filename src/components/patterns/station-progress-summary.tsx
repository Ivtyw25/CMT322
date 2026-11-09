import { Stepper, type StepEntry } from '@/components/patterns/stepper';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { StationProgress, StationStage } from '@/data/models/station';
import { formatDate } from '@/lib/format/dates';

const { construction: copy } = projectCopy.station;

function stageEntry(stage: StationStage): StepEntry {
  const label = uiCopy.stationStages[stage.id];
  if (stage.status === 'done') {
    return {
      id: stage.id,
      label,
      state: 'complete',
      detail: uiCopy.stationStages.completedIn(formatDate(stage.completedIn)),
    };
  }
  if (stage.status === 'in-progress') return { id: stage.id, label, state: 'current' };
  if (stage.when === '') return { id: stage.id, label, state: 'upcoming' };
  return {
    id: stage.id,
    label,
    state: 'upcoming',
    detail: stage.isTarget
      ? uiCopy.stationStages.target(stage.when)
      : uiCopy.stationStages.plannedFor(stage.when),
  };
}

/**
 * A station's percentage card and its six build stages, as commuters see them on the station
 * page. The staff Progress page shows the same.
 */
export function StationProgressSummary({
  progress,
  stages,
}: {
  progress: StationProgress | null;
  stages: readonly StationStage[];
}) {
  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-surface p-5 md:p-6">
        {progress ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="type-heading-m text-primary-700">
                {projectCopy.station.stats.progressValue(progress.percent)}
              </span>
              <span className="type-body-m text-gray-700">
                {copy.summary(uiCopy.stationStages[progress.currentStageId])}
              </span>
            </p>
            <div aria-hidden className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-600"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="type-body-xs text-gray-500">
              {copy.updatedBy(formatDate(progress.updatedAt))}
            </p>
          </>
        ) : (
          <>
            <h3 className="type-body-m-semibold text-gray-900">{copy.notStarted.title}</h3>
            <p className="type-body-s text-gray-700">{copy.notStarted.body}</p>
          </>
        )}
      </div>
      <Stepper variant="stages" label={copy.stagesLabel} steps={stages.map(stageEntry)} />
    </>
  );
}
