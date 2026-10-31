import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { RelatedPages } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getFaq, getMostAskedFaq } from '@/data/api/faq';
import { getSiteInfo } from '@/data/api/site-info';
import { DocsPageHead } from '@/features/project/docs-page-head';
import { DocsSectionHeading } from '@/features/project/docs-section';
import { FaqExplorer } from '@/features/project/faq-explorer';
import { FaqHelpCard } from '@/features/project/faq-help-card';

const { faq } = projectCopy;

export const metadata: Metadata = {
  title: faq.meta.title,
  description: faq.meta.description,
};

export default async function FaqPage() {
  const [{ categories, items }, mostAsked, siteInfo] = await Promise.all([
    getFaq(),
    getMostAskedFaq(),
    getSiteInfo(),
  ]);

  return (
    <DocsLayout
      currentHref={routes.project.faq}
      onThisPage={[
        { id: 'topics', label: faq.toc.topics },
        { id: 'questions', label: faq.toc.mostAsked },
      ]}
      aside={<FaqHelpCard careline={siteInfo.careline} />}
    >
      <div className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6">
          <DocsPageHead
            title={faq.header.title}
            breadcrumbCurrent={faq.header.titleShort}
            lede={faq.header.lede}
            breadcrumb={[
              { label: uiCopy.breadcrumb.home, href: routes.home },
              { label: projectCopy.sectionLabel, href: routes.project.overview },
            ]}
          />
          <FaqExplorer
            categories={categories}
            items={items}
            mostAsked={mostAsked}
            topicsHeading={<DocsSectionHeading id="topics" title={faq.topics.title} />}
          />
        </div>
        <RelatedPages pages={faq.related} />
      </div>
    </DocsLayout>
  );
}
