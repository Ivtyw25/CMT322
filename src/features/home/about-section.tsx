import { AccentBar } from '@/components/patterns/accent-bar';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import { HomeSection } from './section-frame';

const HEADING_ID = 'about-heading';

/** "About the Mutiara Line" (Figma 37:1037, mobile 133:6671): text only, no photo (owner decision 2026-11-07). */
export function AboutSection() {
  const copy = homeCopy.about;
  return (
    <HomeSection headingId={HEADING_ID}>
      <div className="flex max-w-200 flex-col items-start gap-5">
        <AccentBar />
        <h2 id={HEADING_ID} className="type-heading-s">
          {copy.title}
        </h2>
        <p className="type-body-xl leading-8 text-gray-700">{copy.body}</p>
        <ButtonLink href={copy.link.href}>{copy.link.label}</ButtonLink>
      </div>
    </HomeSection>
  );
}
