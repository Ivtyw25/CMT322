'use client';

import Link from 'next/link';
import { ProgressEntry } from '@/components/patterns/progress-entry';
import { StationProgressSummary } from '@/components/patterns/station-progress-summary';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { DocsSection } from '@/components/patterns/docs-section';
import { useLiveStation, type LiveStationInput } from './use-live-station';

const { construction: copy } = projectCopy.station;

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
      <StationProgressSummary progress={progress} stages={stages} />
      <div className="flex flex-col gap-3">
        <h3 className="type-body-m-semibold text-gray-900">{copy.siteUpdates.title}</h3>
        {updates.length > 0 ? (
          <ol aria-label={copy.siteUpdates.title} className="flex flex-col">
            {updates.map((update, index) => (
              <ProgressEntry key={update.id} update={update} first={index === 0} />
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
