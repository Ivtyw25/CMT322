import { AccentBar } from '@/components/patterns/accent-bar';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import type { AreaId } from '@/data/models/area';
import { Container } from '@/components/layout/container';
import { WORKS_HEADING_ID, WORKS_SECTION_ID } from './works-anchor';
import { WorksArea, type WorksAreaOption } from './works-area';
import type { WorksItem } from './works-items';

type WorksSectionProps = {
  areas: readonly WorksAreaOption[];
  items: readonly WorksItem[];
  area: AreaId | null;
};

/** "Works in your area" (Figma 37:1110, mobile 133:6584): heading, area chips, list and sign-up card. */
export function WorksSection({ areas, items, area }: WorksSectionProps) {
  const copy = homeCopy.works;
  return (
    <section
      id={WORKS_SECTION_ID}
      aria-labelledby={WORKS_HEADING_ID}
      className="scroll-mt-header-mobile bg-gray-50 py-10 md:py-16 lg:scroll-mt-header lg:py-20"
    >
      <Container gutter="wide" className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-3">
            <AccentBar />
            <h2
              id={WORKS_HEADING_ID}
              tabIndex={-1}
              className="type-heading-xs outline-none lg:type-heading-s"
            >
              {copy.title}
            </h2>
            <p className="type-body-m text-gray-600">{copy.lede}</p>
          </div>
          <ButtonLink
            variant="secondary"
            href={copy.allAnnouncements.href}
            fullWidth
            className="md:w-auto md:shrink-0"
          >
            {copy.allAnnouncements.label}
          </ButtonLink>
        </div>
        <WorksArea areas={areas} items={items} initialArea={area} />
      </Container>
    </section>
  );
}
