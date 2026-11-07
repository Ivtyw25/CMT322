import Link from 'next/link';
import type { Careline } from '@/components/patterns/need-help-block';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';

const { needHelp } = reportTrackCopy.shared;
const linkClass = 'hit-area self-start text-primary-700 hover:text-primary-800';

type ReportNeedHelpProps = {
  /** The careline as a tap-to-call link; from `getSiteInfo()`. */
  careline?: Careline;
  withReportLink?: boolean;
};

/** "Need help?" for the group's pages: an optional report link and an optional careline link. */
export function ReportNeedHelp({ careline, withReportLink = false }: ReportNeedHelpProps) {
  return (
    <section aria-label={needHelp.title} className="flex flex-col gap-2">
      <h2 className="type-body-xs-semibold text-gray-900">{needHelp.title}</h2>
      <div className="flex flex-col gap-1.5 type-body-s">
        {withReportLink ? (
          <Link href={routes.reportTrack.report} className={linkClass}>
            {reportTrackCopy.track.sidebar.another}
          </Link>
        ) : null}
        {careline ? (
          <a href={careline.tel} className={`${linkClass} whitespace-nowrap`}>
            {uiCopy.docsPage.needHelp.careline(careline.label, careline.number)}
          </a>
        ) : null}
      </div>
    </section>
  );
}
