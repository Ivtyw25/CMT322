import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import type { SearchEntry } from '@/data/models/search';
import heroPhoto from '@/assets/images/hero.jpg';
import { Container } from '@/components/layout/container';
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
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) max(100vw, 1160px), (max-width: 1023px) max(100vw, 1193px), max(100vw, 1491px)"
          className="object-cover object-[25%_50%] lg:object-center"
        />
        <div className="absolute inset-0 bg-hero-scrim" />
        <div className="absolute inset-x-0 top-0 h-55 bg-nav-scrim" />
      </div>
      <Container gutter="wide" className="relative pt-47.5 pb-10 lg:pt-71.75 lg:pb-0">
        <div className="ml-auto flex max-w-140 flex-col items-end gap-3.5 text-right lg:w-160 lg:max-w-none">
          <h1 id={HERO_TITLE_ID} className="type-hero-title text-static-white">
            {title}
          </h1>
          <p className="type-hero-tagline text-static-on-navy-200">
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
              className="text-static-white hover:text-static-on-navy-200 focus-visible:outline-static-white active:text-static-white"
            >
              {actions.report.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
