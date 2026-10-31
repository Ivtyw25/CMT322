import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { RelatedPages } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getStations } from '@/data/api/stations';
import { DocsPageHead } from '@/features/project/docs-page-head';
import { StationsExplorer } from '@/features/project/stations-explorer';
import { StationsFollowCard } from '@/features/project/stations-follow-card';

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
    <DocsLayout
      currentHref={routes.project.stations}
      aside={<StationsFollowCard stations={listed} />}
    >
      <div className="flex flex-col gap-8 lg:gap-12">
        <DocsPageHead
          title={copy.header.title}
          lede={copy.header.lede}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: projectCopy.sectionLabel, href: routes.project.overview },
          ]}
        />
        <StationsExplorer stations={listed} />
        <RelatedPages pages={copy.related} className="border-t border-gray-200 pt-8" />
      </div>
    </DocsLayout>
  );
}
