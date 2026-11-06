import { DocsLayout } from '@/components/layout/docs-layout';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { RelatedPages, type RelatedPage } from '@/components/patterns/related-pages';
import { routes } from '@/config/routes';
import { legalHelpCopy, type HelpAsideCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { HelpAside } from './help-aside';

type HelpPageFrameProps = {
  href: string;
  title: string;
  lede: string;
  sections: readonly { id: string; title: string }[];
  related: readonly RelatedPage[];
  aside?: HelpAsideCopy;
  updated?: string;
  siteInfo: SiteInfo;
  children: React.ReactNode;
};

export function HelpPageFrame({
  href,
  title,
  lede,
  sections,
  related,
  aside,
  updated,
  siteInfo,
  children,
}: HelpPageFrameProps) {
  const group = legalHelpCopy.groups.find((candidate) =>
    candidate.items.some((item) => item.href === href),
  );
  const action =
    href === routes.help.accessibility || href === routes.help.sitemap
      ? { href: routes.help.contact, label: legalHelpCopy.aside.contact }
      : { href: routes.project.faq, label: legalHelpCopy.aside.faq };
  return (
    <DocsLayout
      currentHref={href}
      groups={legalHelpCopy.groups}
      asideDivider={false}
      onThisPage={sections.map((section) => ({ id: section.id, label: section.title }))}
      aside={
        <HelpAside
          siteInfo={siteInfo}
          aside={
            aside ?? {
              title: legalHelpCopy.aside.title,
              body: legalHelpCopy.aside.body,
              primary: action,
            }
          }
        />
      }
    >
      <div className="flex flex-col gap-8 lg:gap-12">
        <DocsPageHead
          title={title}
          lede={lede}
          breadcrumb={[
            { label: legalHelpCopy.home, href: routes.home },
            ...(group && group.id !== 'legal' && group.items[0]
              ? [{ label: group.label, href: group.items[0].href }]
              : []),
          ]}
        >
          {updated ? <p className="type-body-xs text-gray-500">{updated}</p> : null}
        </DocsPageHead>
        {children}
        <RelatedPages pages={related} className="border-t border-gray-200 pt-8" />
      </div>
    </DocsLayout>
  );
}
