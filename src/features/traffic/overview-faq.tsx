import Link from 'next/link';
import { Accordion, type AccordionEntry } from '@/components/ui/accordion';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import type { FaqItem } from '@/data/models/faq';

const copy = trafficCopy.overview.faq;

/** "Popular questions": the travel questions as an accordion, and a link to all of them. */
export function OverviewFaq({
  headingId,
  items,
}: {
  headingId: string;
  items: readonly FaqItem[];
}) {
  const entries: AccordionEntry[] = items.map((item) => ({
    id: `${copy.idPrefix}${item.id}`,
    title: item.question,
    content: (
      <div className="flex max-w-150 flex-col gap-2 text-gray-600">
        {item.answer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    ),
  }));
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <h2 id={headingId} tabIndex={-1} className="type-heading-xs lg:type-heading-s">
        {copy.title}
      </h2>
      <Accordion items={entries} headingAs="h3" />
      <Link
        href={routes.project.faq}
        className="hit-area inline-flex w-fit items-center py-2.5 type-body-s-semibold text-primary-700 hover:underline"
      >
        {copy.seeAll}
      </Link>
    </section>
  );
}
