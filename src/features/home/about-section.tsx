import Image from 'next/image';
import { AccentBar } from '@/components/patterns/accent-bar';
import { ButtonLink } from '@/components/ui/button-link';
import aboutPhoto from '@/assets/images/about-george-town.jpg';
import { homeCopy } from '@/content/home';
import { HomeSection } from './section-frame';

const HEADING_ID = 'about-heading';

/** "About the Mutiara Line" (Figma 37:1037, mobile 133:6671): text left, photo right. */
export function AboutSection() {
  const copy = homeCopy.about;
  return (
    <HomeSection headingId={HEADING_ID}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-18">
        <div className="flex flex-col items-start gap-5 lg:flex-1">
          <AccentBar />
          <h2 id={HEADING_ID} className="type-heading-xs lg:type-heading-s">
            {copy.title}
          </h2>
          <p className="type-body-m text-gray-700 lg:type-body-xl lg:leading-8">{copy.body}</p>
          <ButtonLink href={copy.link.href}>{copy.link.label}</ButtonLink>
        </div>
        <Image
          src={aboutPhoto}
          alt={copy.imageAlt}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="aspect-3/2 w-full rounded-3xl object-cover lg:w-140 lg:shrink-0"
        />
      </div>
    </HomeSection>
  );
}
