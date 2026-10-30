import Link from 'next/link';
import { useId } from 'react';
import { routes } from '@/config/routes';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

export type Careline = { label: string; number: string; tel: string };

const linkClass = cn(
  'inline-flex min-h-11 items-center type-body-s text-primary-700 md:min-h-0',
  'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:underline',
);

/**
 * "Need help?" for docs pages: report, track, and the careline as a tap-to-call link.
 * Pass the careline from `getSiteInfo()`. Sits under the "On this page" list from 1280 px and
 * after the article below (DocsLayout `aside`).
 */
export function NeedHelpBlock({ careline, className }: { careline: Careline; className?: string }) {
  const titleId = useId();
  const { needHelp } = uiCopy.docsPage;
  return (
    <section aria-labelledby={titleId} className={cn('flex flex-col gap-2', className)}>
      <h2 id={titleId} className="type-body-xs-semibold text-gray-900">
        {needHelp.title}
      </h2>
      <ul className="flex flex-col md:gap-1.5">
        <li>
          <Link href={routes.reportTrack.report} className={linkClass}>
            {needHelp.report}
          </Link>
        </li>
        <li>
          <Link href={routes.reportTrack.track} className={linkClass}>
            {needHelp.track}
          </Link>
        </li>
        <li>
          <a href={careline.tel} className={linkClass}>
            {needHelp.careline(careline.label, careline.number)}
          </a>
        </li>
      </ul>
    </section>
  );
}
