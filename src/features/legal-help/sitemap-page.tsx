import Link from 'next/link';
import { routes } from '@/config/routes';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { HelpPageFrame } from './help-page-frame';

export function SitemapPage({ siteInfo }: { siteInfo: SiteInfo }) {
  const copy = legalHelpCopy.sitemap;
  return (
    <HelpPageFrame href={routes.help.sitemap} {...copy} sections={[]} siteInfo={siteInfo}>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {copy.groups.map((group) => (
          <section key={group.id} aria-labelledby={group.id} className="flex flex-col gap-2">
            <h2 id={group.id} className="type-body-m-semibold">
              {group.label}
            </h2>
            <ul className="flex flex-col border-t-2 border-primary-600 pt-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 min-w-11 items-center py-2 type-body-m-medium text-primary-700 hover:underline"
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
