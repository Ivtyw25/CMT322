import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { uiCopy } from '@/content/ui';
import { getFaq } from '@/data/api/faq';
import { getSiteInfo } from '@/data/api/site-info';
import { getRoadChangesThisWeek } from '@/data/api/traffic';
import { OverviewFaq } from '@/features/traffic/overview-faq';
import { OverviewPageCards } from '@/features/traffic/overview-page-cards';
import { OverviewRoadChanges } from '@/features/traffic/overview-road-changes';

const copy = trafficCopy.overview;
const WEEK_ITEMS = 3;
const FAQ_ITEMS = 4;
const FAQ_CATEGORY = 'getting-around';

const IDS = { pages: 'pages', week: 'road-changes', questions: 'popular-questions' } as const;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function TrafficOverviewPage() {
  const [changes, siteInfo, faq] = await Promise.all([
    getRoadChangesThisWeek(WEEK_ITEMS),
    getSiteInfo(),
    getFaq(),
  ]);
  const questions = faq.items
    .filter((item) => item.categoryId === FAQ_CATEGORY)
    .slice(0, FAQ_ITEMS);
  const onThisPage = [
    { id: IDS.pages, label: copy.toc.pages },
    { id: IDS.week, label: copy.toc.week },
    ...(questions.length > 0 ? [{ id: IDS.questions, label: copy.toc.questions }] : []),
  ];

  return (
    <DocsLayout
      currentHref={routes.traffic.overview}
      onThisPage={onThisPage}
      aside={<NeedHelpBlock careline={siteInfo.careline} />}
    >
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <Breadcrumb
            items={[{ label: uiCopy.breadcrumb.home, href: routes.home }]}
            current={copy.header.title}
          />
          <h1 className="type-heading-s lg:type-heading-m">{copy.header.title}</h1>
          <p className="max-w-175 type-body-l text-gray-600 lg:type-body-xl">{copy.header.lede}</p>
        </header>
        <OverviewPageCards headingId={IDS.pages} />
        <OverviewRoadChanges headingId={IDS.week} items={changes} />
        {questions.length > 0 ? <OverviewFaq headingId={IDS.questions} items={questions} /> : null}
      </div>
    </DocsLayout>
  );
}
