import Link from 'next/link';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';

const { needHelp } = reportTrackCopy.shared;

/** "Need help?" for the group's pages. The careline is plain text; the report link is optional. */
export function ReportNeedHelp({ withReportLink = false }: { withReportLink?: boolean }) {
  return (
    <section aria-label={needHelp.title} className="flex flex-col gap-2">
      <h2 className="type-body-xs-semibold text-gray-900">{needHelp.title}</h2>
      <div className="flex flex-col gap-1.5 type-body-s">
        {withReportLink ? (
          <Link
            href={routes.reportTrack.report}
            className="hit-area self-start text-primary-700 hover:text-primary-800"
          >
            {reportTrackCopy.track.sidebar.another}
          </Link>
        ) : null}
        <p className="text-gray-700">{needHelp.careline}</p>
      </div>
    </section>
  );
}
