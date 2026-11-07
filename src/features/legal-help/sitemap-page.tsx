import Link from 'next/link';
import { routes } from '@/config/routes';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { HelpPageFrame } from './help-page-frame';

export function SitemapPage({ siteInfo }: { siteInfo: SiteInfo }) {
  const copy = legalHelpCopy.sitemap;
  return (
    <HelpPageFrame href={routes.help.sitemap} {...copy} sections={[]} siteInfo={siteInfo}>
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-8">
        {copy.groups.map((group) => (
          <section key={group.id} aria-labelledby={group.id} className="flex flex-col gap-2.5">
            <h2
              id={group.id}
              className="border-b-2 border-primary-600 pb-2 type-body-m-semibold text-gray-900"
            >
              {group.label}
            </h2>
            <ul className="flex flex-col items-start gap-2.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hit-area block type-body-s-medium text-primary-700 hover:text-primary-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </HelpPageFrame>
  );
}
