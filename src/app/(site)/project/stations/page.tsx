import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { PageFeedback } from '@/components/patterns/page-feedback';
import { RelatedPages } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getStations } from '@/data/api/stations';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { StationsExplorer } from '@/features/project/stations-explorer';
import { StationsSegments } from '@/features/project/stations-segments';

const { stations: copy } = projectCopy;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function StationsPage() {
  const stations = await getStations();
  const listed = stations.map(({ code, name, subtitle, isProvisionalName, area }) => ({
    code,
    name,
    subtitle,
    isProvisionalName,
    area,
  }));

  return (
    <DocsLayout currentHref={routes.project.stations}>
      <div className="flex flex-col gap-8 lg:gap-10">
        <DocsPageHead
          title={copy.header.title}
          lede={copy.header.lede}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: projectCopy.sectionLabel, href: routes.project.overview },
          ]}
        />
        <StationsExplorer stations={listed} segments={<StationsSegments />} />
        <div className="flex flex-col gap-8 border-t border-gray-200 pt-6">
          <PageFeedback icons />
          <RelatedPages pages={copy.related} />
        </div>
      </div>
    </DocsLayout>
  );
}
