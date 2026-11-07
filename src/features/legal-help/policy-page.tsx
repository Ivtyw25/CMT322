import { DocsSectionHeading } from '@/components/patterns/docs-section';
import type { RelatedPage } from '@/components/patterns/related-pages';
import { legalHelpCopy, type HelpAsideCopy, type HelpSection } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { HelpNote } from './help-note';
import { HelpPageFrame } from './help-page-frame';

type PolicyCopy = {
  title: string;
  lede: string;
  updated?: string;
  sections: readonly HelpSection[];
  summary?: readonly string[];
  aside?: HelpAsideCopy;
  related: readonly RelatedPage[];
};

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

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
        <div className="flex flex-col gap-2.5 rounded-lg bg-primary-50 px-4 py-5 type-body-s lg:px-6">
          <p className="type-body-s-semibold text-primary-800">{legalHelpCopy.summaryTitle}</p>
          <ul className="list-disc pl-5.25 text-gray-800">
            {copy.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {copy.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-4">
          <DocsSectionHeading id={section.id} title={section.title} />
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="type-body-m text-gray-700">
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <div className="type-body-m text-gray-700">
              <BulletList items={section.bullets} />
            </div>
          ) : null}
          {section.after?.map((paragraph) => (
            <p key={paragraph} className="type-body-m text-gray-700">
              {paragraph}
            </p>
          ))}
          {section.note ? <HelpNote tone={section.note.tone}>{section.note.text}</HelpNote> : null}
        </section>
      ))}
    </HelpPageFrame>
  );
}
