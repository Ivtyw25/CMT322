import Link from 'next/link';
import { routes } from '@/config/routes';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';

const linkClass =
  'type-body-s-semibold text-primary-700 transition-colors duration-(--duration-fast) hover:text-primary-800';

/** "Any questions? Read the FAQ, or contact us at <email> or <careline>." */
export function HelpQuestions({ siteInfo }: { siteInfo: SiteInfo }) {
  const copy = legalHelpCopy.questions;
  return (
    <p className="type-body-s text-gray-600">
      {copy.lead}{' '}
      <Link href={routes.project.faq} className={linkClass}>
        {copy.faq}
      </Link>
      {copy.contact}{' '}
      <a href={siteInfo.email.href} className={linkClass}>
        {siteInfo.email.address}
      </a>{' '}
      {copy.or}{' '}
      <a href={siteInfo.careline.tel} className={`${linkClass} whitespace-nowrap`}>
        {siteInfo.careline.number}
      </a>
      .
    </p>
  );
}
