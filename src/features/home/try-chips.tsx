import Link from 'next/link';
import { homeCopy } from '@/content/home';

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
          className="hit-area rounded-full border border-static-white-35 bg-static-glass px-3 py-1 type-body-s text-static-white transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-static-glass-strong focus-visible:outline-static-white"
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}
