import { Flag, Search, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';

type CardId = (typeof reportTrackCopy.overview.pages.cards)[number]['id'];

const cardTargets: Record<CardId, { icon: LucideIcon; href: string }> = {
  report: { icon: Flag, href: routes.reportTrack.report },
  track: { icon: Search, href: routes.reportTrack.track },
};

/** The two pages of the group. The title link covers the whole card. */
export function OverviewPageCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reportTrackCopy.overview.pages.cards.map((card) => {
        const { icon: Icon, href } = cardTargets[card.id];
        return (
          <li
            key={card.id}
            className="group relative flex flex-col gap-3 rounded-2xl border border-gray-200 bg-surface p-5 transition-colors duration-(--duration-fast) hover:border-primary-300 active:bg-gray-50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-600"
          >
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
            >
              <Icon className="size-4.5" />
            </span>
            <h3 className="type-heading-3xs text-primary-700 group-hover:underline">
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:rounded-2xl"
              >
                {card.title}
              </Link>
            </h3>
            <p className="type-body-s text-gray-600">{card.body}</p>
            <ul className="mt-auto flex flex-col gap-1.5 border-t border-gray-200 pt-3 type-body-s text-gray-700">
              {card.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
