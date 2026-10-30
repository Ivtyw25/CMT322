import { LinkCard } from '@/components/ui/link-card';
import { homeCopy } from '@/content/home';
import { HomeSection, SectionHeader } from './section-frame';
import { sectionIcons } from './section-icons';

const HEADING_ID = 'guide-heading';

/** "How to use this platform" (Figma 37:1048, mobile 133:6678): eight link cards. */
export function GuideSection() {
  const copy = homeCopy.guide;
  return (
    <HomeSection headingId={HEADING_ID}>
      <SectionHeader headingId={HEADING_ID} title={copy.title} lede={copy.lede} />
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {copy.cards.map((card) => {
          const Icon = sectionIcons[card.icon];
          return (
            <li key={card.id} className="flex">
              <LinkCard
                href={card.href}
                title={card.title}
                media={
                  <span
                    aria-hidden
                    className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
                  >
                    <Icon className="size-5.5" />
                  </span>
                }
                className="w-full gap-3.5 rounded-3xl p-4 md:p-6 [&_h3]:type-body-m-semibold [&_h3]:text-wrap group-hover:[&_h3]:text-primary-700 [&_h3_a]:flex"
              >
                <p className="type-body-s text-gray-600">{card.text}</p>
              </LinkCard>
            </li>
          );
        })}
      </ul>
    </HomeSection>
  );
}
