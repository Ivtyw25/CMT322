'use client';

import Link from 'next/link';
import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { revealWorks } from './works-anchor';

/** "Try" and four quick links under the hero search. Plain links, so they also work without JavaScript. */
export function TryChips() {
  const { tryLabel, tryChips } = homeCopy.hero;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 lg:justify-end">
      <p className="type-body-s text-static-white">{tryLabel}</p>
      {tryChips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.target}
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            const target = new URL(chip.target, window.location.origin);
            if (target.pathname !== routes.home || !target.searchParams.has('area')) return;
            event.preventDefault();
            window.history.pushState(null, '', chip.target);
            revealWorks();
          }}
          className="hit-area rounded-full border border-static-white-35 bg-static-glass px-3 py-1 type-body-s text-static-white transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-static-glass-strong focus-visible:outline-static-white"
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}
