import type { Metadata } from 'next';
import { DocsLayout } from '@/components/layout/docs-layout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import { getReportCategories } from '@/data/api/tickets';
import { getStations } from '@/data/api/stations';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { ReportAside } from '@/features/report-track/report-aside';
import { ReportForm } from '@/features/report-track/report-form';

const { report } = reportTrackCopy;

export const metadata: Metadata = {
  title: report.meta.title,
  description: report.meta.description,
};

export default async function ReportPage() {
  const [categories, stations] = await Promise.all([getReportCategories(), getStations()]);

  return (
    <DocsLayout
      currentHref={routes.reportTrack.report}
      onThisPage={[
        { id: 'type', label: report.onThisPage.type },
        { id: 'details', label: report.onThisPage.details },
        { id: 'location', label: report.onThisPage.location },
        { id: 'files', label: report.onThisPage.files },
        { id: 'contact', label: report.onThisPage.contact },
      ]}
      aside={<ReportAside />}
    >
      <div className="flex flex-col gap-10">
        <DocsPageHead
          title={report.header.title}
          lede={report.header.lede}
          breadcrumb={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: reportTrackCopy.overview.header.title, href: routes.reportTrack.overview },
          ]}
        />
        <ReportForm
          categories={categories}
          stations={stations.map(({ code, name, lat, lng }) => ({ code, name, lat, lng }))}
        />
      </div>
    </DocsLayout>
  );
}
