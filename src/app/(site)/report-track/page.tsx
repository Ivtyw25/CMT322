import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { Callout } from '@/components/ui/callout';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { DocsSection } from '@/components/patterns/docs-section';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import { OverviewPageCards } from '@/features/report-track/overview-page-cards';
import { OverviewPopularQuestions } from '@/features/report-track/overview-popular-questions';
import { OverviewSteps } from '@/features/report-track/overview-steps';
import { ReportNeedHelp } from '@/features/report-track/report-need-help';

const { overview } = reportTrackCopy;

export const metadata: Metadata = {
  title: overview.meta.title,
  description: overview.meta.description,
};

const ids = { pages: 'pages', how: 'how-it-works', faq: 'popular-questions' } as const;

export default function ReportTrackOverviewPage() {
  return (
    <DocsLayout
      currentHref={routes.reportTrack.overview}
      onThisPage={[
        { id: ids.pages, label: overview.onThisPage.pages },
        { id: ids.how, label: overview.onThisPage.howItWorks },
        { id: ids.faq, label: overview.onThisPage.faq },
      ]}
      aside={<ReportNeedHelp />}
    >
      <div className="flex flex-col gap-12 lg:gap-16">
        <DocsPageHead
          title={overview.header.title}
          lede={
            <>
              {overview.header.lede} <span data-auth="guest">{overview.header.ledeGuest}</span>
            </>
          }
          breadcrumb={[{ label: uiCopy.breadcrumb.home, href: routes.home }]}
        />
        <DocsSection id={ids.pages} title={overview.pages.title}>
          <OverviewPageCards />
        </DocsSection>
        <div className="flex flex-col gap-6">
          <DocsSection id={ids.how} title={overview.howItWorks.title}>
            <OverviewSteps />
          </DocsSection>
          <Callout tone="warning">{overview.emergency}</Callout>
        </div>
        <DocsSection id={ids.faq} title={overview.faq.title}>
          <OverviewPopularQuestions />
        </DocsSection>
      </div>
    </DocsLayout>
  );
}
