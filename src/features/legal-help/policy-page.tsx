import { DocsSection } from '@/components/patterns/docs-section';
import { legalHelpCopy, type HelpSection } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import type { RelatedPage } from '@/components/patterns/related-pages';
import { HelpPageFrame } from './help-page-frame';

type PolicyCopy = {
  title: string;
  lede: string;
  sections: readonly HelpSection[];
  summary?: readonly string[];
  related: readonly RelatedPage[];
};

export function PolicyPage({
  copy,
  href,
  siteInfo,
}: {
  copy: PolicyCopy;
  href: string;
  siteInfo: SiteInfo;
}) {
  return (
    <HelpPageFrame href={href} {...copy} siteInfo={siteInfo}>
      {copy.summary ? (
        <div className="flex flex-col gap-3 rounded-lg border-l-2 border-primary-600 bg-primary-50 p-5">
          <p className="type-body-s-semibold text-primary-700">{legalHelpCopy.summaryTitle}</p>
          <ul className="list-disc space-y-2 pl-5 type-body-s text-gray-700">
            {copy.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {copy.sections.map((section) => (
        <DocsSection key={section.id} id={section.id} title={section.title}>
          <div className="flex flex-col gap-4 type-body-m text-gray-700">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul className="list-disc space-y-2 pl-5">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </DocsSection>
      ))}
    </HelpPageFrame>
  );
}
