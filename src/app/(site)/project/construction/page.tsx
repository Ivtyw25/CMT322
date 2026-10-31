import type { Metadata } from 'next';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { PageFeedback } from '@/components/patterns/page-feedback';
import { RelatedPages } from '@/components/patterns/related-pages';
import { Timeline, type TimelineEntry } from '@/components/patterns/timeline';
import { Callout } from '@/components/ui/callout';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getAreas } from '@/data/api/areas';
import { getToday } from '@/data/api/clock';
import { getConstructionUpdates, getMilestones } from '@/data/api/construction';
import { getSiteInfo } from '@/data/api/site-info';
import { ConstructionExplorer } from '@/features/project/construction-explorer';
import { DocsPageHead } from '@/features/project/docs-page-head';
import { milestoneDate } from '@/features/project/milestone-date';
import Link from 'next/link';

const { construction: copy } = projectCopy;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function ConstructionPage() {
  const [updates, milestones, areas, today, siteInfo] = await Promise.all([
    getConstructionUpdates(),
    getMilestones(),
    getAreas(),
    getToday(),
    getSiteInfo(),
  ]);

  const thisMonth = today.slice(0, 7);
  const entries: TimelineEntry[] = milestones.flatMap((milestone, index) => {
    const entry: TimelineEntry = {
      id: milestone.id,
      date: milestoneDate(milestone),
      text: milestone.title,
      state: milestone.date <= thisMonth ? 'past' : 'future',
    };
    const previous = milestones[index - 1];
    const marker: TimelineEntry[] =
      entry.state === 'future' && (!previous || previous.date <= thisMonth)
        ? [{ id: 'today', date: '', text: '', state: 'today' }]
        : [];
    return [...marker, entry];
  });

  return (
    <ConstructionExplorer
      updates={updates}
      areas={areas.map(({ id, label }) => ({ id, label }))}
      head={
        <DocsPageHead
          title={copy.header.title}
          lede={copy.header.lede}
          updatedAt={updates[0]?.date ?? copy.header.updatedAt}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: projectCopy.sectionLabel, href: routes.project.overview },
          ]}
        />
      }
      timeline={<Timeline items={entries} orientation="responsive" />}
      needHelp={<NeedHelpBlock careline={siteInfo.careline} />}
      tail={
        <>
          <Callout tone="info">
            <p>{copy.updates.note.body}</p>
            <Link
              href={routes.traffic.map}
              className="hit-area type-body-s-medium text-primary-700 hover:underline"
            >
              {copy.updates.note.link}
            </Link>
          </Callout>
          <div className="flex flex-col gap-8 border-t border-gray-200 pt-6">
            <PageFeedback />
            <RelatedPages pages={copy.related} />
          </div>
        </>
      }
    />
  );
}
