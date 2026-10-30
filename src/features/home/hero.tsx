import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import type { SearchEntry } from '@/data/models/search';
import heroPhoto from '@/assets/images/hero.jpg';
import { HomeContainer } from './home-container';
import { HeroSearch } from './hero-search';
import { TryChips } from './try-chips';

const HERO_TITLE_ID = 'home-hero-title';

/**
 * Home hero (Figma 37:1026, mobile 133:6557). It starts at the top of the page, behind the
 * transparent header. The text block keeps a fixed top padding, so closing the site notice
 * does not move it.
 */
export function Hero({ searchIndex }: { searchIndex: readonly SearchEntry[] }) {
  const { title, tagline, actions } = homeCopy.hero;
  return (
    <section
      aria-labelledby={HERO_TITLE_ID}
      className="relative min-h-155.5 md:min-h-160 lg:h-200 lg:min-h-0"
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden bg-static-navy">
        <Image src={heroPhoto} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <div className="absolute inset-x-0 top-0 h-55 bg-nav-scrim" />
      </div>
      <HomeContainer className="relative pt-47.5 pb-10 lg:pt-71.75 lg:pb-0">
        <div className="flex max-w-140 flex-col items-start gap-3.5 lg:ml-auto lg:w-160 lg:max-w-none lg:items-end lg:text-right">
          <h1
            id={HERO_TITLE_ID}
            className="type-hero-title-compact text-static-white min-[390px]:type-hero-title-mobile lg:type-hero-title"
          >
            {title}
          </h1>
          <p className="type-hero-tagline-mobile text-static-on-navy-200 lg:type-hero-tagline">
            {tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <HeroSearch entries={searchIndex} />
          <TryChips />
          <div className="flex items-center gap-3 pt-1.5">
            <ButtonLink variant="secondary" href={actions.trafficMap.href}>
              {actions.trafficMap.label}
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              href={actions.report.href}
              className="text-static-white hover:underline focus-visible:outline-static-white active:text-static-white"
            >
              {actions.report.label}
            </ButtonLink>
          </div>
        </div>
      </HomeContainer>
    </section>
  );
}
