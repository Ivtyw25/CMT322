import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { DocsLayout } from '@/components/layout/docs-layout';
import { SectionHeading } from '@/components/patterns/section-heading';
import { GallerySection } from '@/app/dev/components/_parts/section';

const { samples, labels } = devCopy;
const headings = samples.docsHeadings.map((label, index) => ({
  id: `gallery-docs-${index + 1}`,
  label,
}));

export function DocsSection() {
  return (
    <GallerySection id="docs-layout" note={labels.docsNote}>
      <div className="-mx-5 border-y border-gray-200 md:-mx-8 lg:-mx-10">
        <DocsLayout
          currentHref={routes.project.about}
          onThisPage={headings}
          needHelp={
            <p className="type-body-xs-semibold text-gray-900">{samples.docsArticleTitle}</p>
          }
        >
          <h3 className="type-heading-s">{samples.docsArticleTitle}</h3>
          {headings.map((heading) => (
            <div key={heading.id} className="mt-10 flex flex-col gap-3">
              <SectionHeading id={heading.id}>{heading.label}</SectionHeading>
              {[0, 1, 2].map((paragraph) => (
                <p key={paragraph} className="type-body-m text-gray-700">
                  {samples.docsParagraph}
                </p>
              ))}
            </div>
          ))}
        </DocsLayout>
      </div>
    </GallerySection>
  );
}
