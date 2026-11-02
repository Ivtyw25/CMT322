import Link from 'next/link';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { Stepper, type StepEntry } from '@/components/patterns/stepper';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station, StationStage } from '@/data/models/station';
import { formatDate } from '@/lib/format/dates';
import { DocsSection } from './docs-section';

const { construction: copy } = projectCopy.station;
const MAX_UPDATES = 3;

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
  if (stage.status === 'in-progress') {
    return { id: stage.id, label, state: 'current', detail: stage.detail };
  }
  return {
    id: stage.id,
    label,
    state: 'upcoming',
    detail: stage.isTarget
      ? uiCopy.stationStages.target(stage.when)
      : uiCopy.stationStages.plannedFor(stage.when),
  };
}

/** "Construction progress": the percentage card, the six build stages and the latest site notes. */
export function StationProgress({ id, station }: { id: string; station: Station }) {
  const { progress } = station;
  const updates = station.siteUpdates.slice(0, MAX_UPDATES);
  return (
    <DocsSection id={id} title={copy.title}>
      <p className="-mt-2 type-body-m text-gray-600">{copy.lede}</p>
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
      <Stepper variant="stages" label={copy.stagesLabel} steps={station.stages.map(stageEntry)} />
      <div className="flex flex-col gap-3">
        <h3 className="type-body-m-semibold text-gray-900">{copy.siteUpdates.title}</h3>
        {updates.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {updates.map((update) => (
              <li key={update.id} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <ImagePlaceholder decorative className="h-23 w-full shrink-0 rounded-lg sm:w-35" />
                <div className="flex flex-col gap-1">
                  <time dateTime={update.date} className="type-body-xs text-gray-500">
                    {formatDate(update.date)}
                  </time>
                  <p className="type-body-s text-gray-800">{update.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-body-s text-gray-600">{copy.siteUpdates.empty}</p>
        )}
      </div>
      <Link
        href={routes.project.construction}
        className="hit-area w-fit type-body-s-medium text-primary-700 hover:underline"
      >
        {copy.link}
      </Link>
    </DocsSection>
  );
}
