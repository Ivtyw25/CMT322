import { Accordion, type AccordionEntry } from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button-link';
import { AccentBar } from '@/components/patterns/accent-bar';
import { homeCopy } from '@/content/home';
import { HomeSection } from './section-frame';

const HEADING_ID = 'faq-heading';
/** Keeps these item ids apart from the FAQ page's own anchors. */
const ID_PREFIX = 'home-faq-';

export type FaqPreview = { id: string; question: string; summary: string };

type FaqSectionProps = { items: readonly FaqPreview[] };

/** "Common questions" (Figma 37:1203, mobile 133:6850): heading left, accordion right. */
export function FaqSection({ items }: FaqSectionProps) {
  const copy = homeCopy.faq;
  const entries: AccordionEntry[] = items.map((item) => ({
    id: `${ID_PREFIX}${item.id}`,
    title: item.question,
    content: <p className="max-w-150 text-gray-600">{item.summary}</p>,
  }));
  const [first] = entries;
  if (!first) return null;
  return (
    <HomeSection headingId={HEADING_ID}>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-25">
        <div className="flex flex-col items-start gap-3">
          <AccentBar />
          <h2 id={HEADING_ID} className="type-heading-xs lg:type-heading-s">
            {copy.title}
          </h2>
          <p className="type-body-m text-gray-600">{copy.lede}</p>
          <ButtonLink variant="secondary" href={copy.seeAll.href} className="mt-2">
            {copy.seeAll.label}
          </ButtonLink>
        </div>
        <Accordion items={entries} size="roomy" defaultOpenIds={[first.id]} />
      </div>
    </HomeSection>
  );
}
