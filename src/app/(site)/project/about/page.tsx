import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { PageFeedback } from '@/components/patterns/page-feedback';
import { RelatedPages } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getMilestones } from '@/data/api/construction';
import { getToday } from '@/data/api/clock';
import { getSiteInfo } from '@/data/api/site-info';
import { getStations } from '@/data/api/stations';
import { AboutBenefits } from '@/features/project/about-benefits';
import { AboutKeyFigures } from '@/features/project/about-key-figures';
import { AboutRoutes } from '@/features/project/about-routes';
import { AboutTimeline } from '@/features/project/about-timeline';
import { AboutTravelling } from '@/features/project/about-travelling';
import { DocsPageHead } from '@/features/project/docs-page-head';
import { DocsSection } from '@/features/project/docs-section';
import { StationExplorer } from '@/features/project/station-explorer';
import { StationRail } from '@/features/project/station-rail';

const { about } = projectCopy;

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
};

export default async function AboutPage() {
  const [stations, milestones, today, siteInfo] = await Promise.all([
    getStations(),
    getMilestones(),
    getToday(),
    getSiteInfo(),
  ]);

  return (
    <DocsLayout
      currentHref={routes.project.about}
      onThisPage={[
        { id: 'overview', label: about.toc.overview },
        { id: 'key-figures', label: about.toc.figures },
        { id: 'routes', label: about.toc.routes },
        { id: 'stations', label: about.toc.stations },
        { id: 'travelling', label: about.toc.travelling },
        { id: 'benefits', label: about.toc.benefits },
        { id: 'timeline', label: about.toc.timeline },
      ]}
      aside={<NeedHelpBlock careline={siteInfo.careline} />}
    >
      <div className="flex flex-col gap-12 lg:gap-16">
        <DocsPageHead
          title={about.header.title}
          breadcrumbCurrent={about.header.titleShort}
          lede={about.header.lede}
          updatedAt={about.header.updatedAt}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: projectCopy.sectionLabel, href: routes.project.overview },
          ]}
        />
        <DocsSection id="overview" title={about.overview.title}>
          <div className="flex max-w-170 flex-col gap-4 type-body-m text-gray-700">
            {about.overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </DocsSection>
        <DocsSection id="key-figures" title={about.figures.title}>
          <AboutKeyFigures />
        </DocsSection>
        <DocsSection id="routes" title={about.routes.title}>
          <AboutRoutes />
        </DocsSection>
        <DocsSection id="stations" title={about.stations.title}>
          <p className="type-body-m text-gray-700">{about.stations.lede}</p>
          <div className="hidden xl:block">
            <StationExplorer
              stations={stations.map(({ code, name, subtitle, isProvisionalName, serves }) => ({
                code,
                name,
                subtitle,
                isProvisionalName,
                serves,
              }))}
            />
          </div>
          <div className="xl:hidden">
            <StationRail stations={stations} />
          </div>
        </DocsSection>
        <DocsSection id="travelling" title={about.travelling.title}>
          <AboutTravelling />
        </DocsSection>
        <DocsSection id="benefits" title={about.benefits.title}>
          <AboutBenefits />
        </DocsSection>
        <DocsSection id="timeline" title={about.timeline.title}>
          <AboutTimeline milestones={milestones} today={today} />
        </DocsSection>
        <div className="flex flex-col gap-8 border-t border-gray-200 pt-6">
          <PageFeedback />
          <RelatedPages pages={about.related} />
        </div>
      </div>
    </DocsLayout>
  );
}
