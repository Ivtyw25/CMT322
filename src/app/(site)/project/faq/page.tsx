import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { PageFeedback } from '@/components/patterns/page-feedback';
import { RelatedPages } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { getFaq, getMostAskedFaq } from '@/data/api/faq';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { DocsSectionHeading } from '@/components/patterns/docs-section';
import { FaqExplorer } from '@/features/project/faq-explorer';
import { FaqHelpCard } from '@/features/project/faq-help-card';

const { faq } = projectCopy;

export const metadata: Metadata = {
  title: faq.meta.title,
  description: faq.meta.description,
};

export default async function FaqPage() {
  const [{ categories, items }, mostAsked] = await Promise.all([getFaq(), getMostAskedFaq()]);

  return (
    <DocsLayout
      currentHref={routes.project.faq}
      onThisPage={[
        { id: 'topics', label: faq.toc.topics },
        { id: 'questions', label: faq.toc.mostAsked },
      ]}
      aside={<FaqHelpCard />}
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
        <div className="flex flex-col gap-8 border-t border-gray-200 pt-6">
          <PageFeedback icons />
          <RelatedPages pages={faq.related} />
        </div>
      </div>
    </DocsLayout>
  );
}
