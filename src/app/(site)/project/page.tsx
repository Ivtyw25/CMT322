import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getMostAskedFaq } from '@/data/api/faq';
import { getConstructionUpdates } from '@/data/api/construction';
import { getSiteInfo } from '@/data/api/site-info';
import { DocsPageHead } from '@/features/project/docs-page-head';
import { DocsSection } from '@/features/project/docs-section';
import { OverviewLatestUpdate } from '@/features/project/overview-latest-update';
import { OverviewPageCards } from '@/features/project/overview-page-cards';
import { OverviewPopularQuestions } from '@/features/project/overview-popular-questions';

const { overview } = projectCopy;

export const metadata: Metadata = {
  title: overview.meta.title,
  description: overview.meta.description,
};

const sections = {
  pages: 'pages',
  latest: 'latest-update',
  questions: 'popular-questions',
} as const;

export default async function ProjectOverviewPage() {
  const [updates, popular, siteInfo] = await Promise.all([
    getConstructionUpdates(),
    getMostAskedFaq(),
    getSiteInfo(),
  ]);

  return (
    <DocsLayout
      currentHref={routes.project.overview}
      onThisPage={[
        { id: sections.pages, label: overview.toc.pages },
        { id: sections.latest, label: overview.toc.latest },
        { id: sections.questions, label: overview.toc.questions },
      ]}
      aside={<NeedHelpBlock careline={siteInfo.careline} />}
    >
      <div className="flex flex-col gap-12 lg:gap-16">
        <DocsPageHead
          title={overview.header.title}
          lede={overview.header.lede}
          breadcrumb={[{ label: uiCopy.breadcrumb.home, href: routes.home }]}
        />
        <DocsSection id={sections.pages} title={overview.pages.title}>
          <OverviewPageCards />
        </DocsSection>
        <DocsSection id={sections.latest} title={overview.latest.title}>
          <OverviewLatestUpdate update={updates[0] ?? null} />
        </DocsSection>
        <DocsSection id={sections.questions} title={overview.questions.title}>
          <OverviewPopularQuestions items={popular.slice(0, 3)} />
        </DocsSection>
      </div>
    </DocsLayout>
  );
}
