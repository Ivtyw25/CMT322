import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { DocsAside } from '@/components/layout/docs-aside';
import { DocsLayout } from '@/components/layout/docs-layout';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { SectionHeading } from '@/components/patterns/section-heading';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const { samples, labels, states } = devCopy;
const headings = samples.docsHeadings.map((label, index) => ({
  id: `gallery-docs-${index + 1}`,
  label,
}));
const nestedHeadings = samples.docsNestedHeadings.map((item, index) => ({
  id: `gallery-nested-${index + 1}`,
  label: item.label,
  children: item.children.map((child, childIndex) => ({
    id: `gallery-nested-${index + 1}-${childIndex + 1}`,
    label: child,
  })),
}));

export function DocsSection() {
  return (
    <GallerySection id="docs-layout" note={labels.docsNote}>
      <div className="-mx-5 border-y border-gray-200 md:-mx-8 lg:-mx-10">
        <DocsLayout
          currentHref={routes.project.about}
          onThisPage={headings}
          aside={<NeedHelpBlock careline={samples.careline} />}
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
      <Specimen caption={states.nestedAside} className="sm:w-72">
        <DocsAside items={nestedHeadings} previewActiveId="gallery-nested-2-2" />
      </Specimen>
      <div className="-mx-5 border-y border-gray-200 md:-mx-8 lg:-mx-10">
        <DocsLayout
          currentHref={routes.project.stations}
          preview={{ activeId: '' }}
          aside={<NeedHelpBlock careline={samples.careline} />}
        >
          <h3 className="type-heading-s">{states.asideOnly}</h3>
        </DocsLayout>
      </div>
    </GallerySection>
  );
}
