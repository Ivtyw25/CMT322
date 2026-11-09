'use client';

import Link from 'next/link';
import { Stepper, type StepEntry } from '@/components/patterns/stepper';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { StationStage } from '@/data/models/station';
import { formatDate } from '@/lib/format/dates';
import { DocsSection } from '@/components/patterns/docs-section';
import { StationUpdateEntry } from './station-update-entry';
import { useLiveStation, type LiveStationInput } from './use-live-station';

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
 * "Construction progress": the percentage card, the six build stages and the timeline of the
 * project developer's progress updates. The newest update that sets a percentage drives the card
 * and the stages, so the page always matches what the developer published.
 */
export function StationProgress({ id, ...input }: { id: string } & LiveStationInput) {
  const { progress, stages, updates } = useLiveStation(input);
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
      <Stepper variant="stages" label={copy.stagesLabel} steps={stages.map(stageEntry)} />
      <div className="flex flex-col gap-3">
        <h3 className="type-body-m-semibold text-gray-900">{copy.siteUpdates.title}</h3>
        {updates.length > 0 ? (
          <ol aria-label={copy.siteUpdates.title} className="flex flex-col">
            {updates.map((update, index) => (
              <StationUpdateEntry key={update.id} update={update} first={index === 0} />
            ))}
          </ol>
        ) : (
          <p className="type-body-s text-gray-600">{copy.siteUpdates.empty}</p>
        )}
      </div>
      <Link
        href={routes.project.construction}
        className="hit-area w-fit type-body-s-medium text-primary-700 hover:text-primary-800"
      >
        {copy.link}
      </Link>
    </DocsSection>
  );
}
