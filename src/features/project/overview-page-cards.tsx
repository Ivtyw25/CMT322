import { Camera, CircleHelp, Info, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';

type CardId = (typeof projectCopy.overview.pages.cards)[number]['id'];

/** Icon and the deep link behind each of the three sub-link labels, per card. */
const cardTargets: Record<CardId, { icon: LucideIcon; links: readonly [string, string, string] }> =
  {
    about: {
      icon: Info,
      links: [
        routes.withHash(routes.project.about, 'routes'),
        routes.withHash(routes.project.about, 'stations'),
        routes.withHash(routes.project.about, 'timeline'),
      ],
    },
    faq: {
      icon: CircleHelp,
      links: [
        routes.project.faqItem('construction-hours'),
        routes.project.faqItem('road-closures'),
        routes.project.faqTopic('land'),
      ],
    },
    construction: {
      icon: Camera,
      links: [
        routes.withHash(routes.project.construction, 'updates'),
        routes.withHash(routes.project.construction, 'update-filters'),
        routes.withHash(routes.project.construction, 'timeline'),
      ],
    },
  };

/** The three pages of the Project group, each with its description and three deep links. */
export function OverviewPageCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {projectCopy.overview.pages.cards.map((card) => {
        const { icon: Icon, links } = cardTargets[card.id];
        const titleId = `overview-card-${card.id}`;
        return (
          <li
            key={card.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-surface p-5"
          >
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
            >
              <Icon className="size-4.5" />
            </span>
            <h3 id={titleId} className="type-heading-3xs text-primary-700">
              <Link
                href={card.href}
                className="inline-flex min-h-11 min-w-11 items-center hover:underline md:min-h-0 md:min-w-0"
              >
                {card.title}
              </Link>
            </h3>
            <p className="type-body-s text-gray-600">{card.description}</p>
            <ul
              aria-labelledby={titleId}
              className="mt-auto flex flex-col border-t border-gray-200 pt-3"
            >
              {card.highlights.map((label, index) => (
                <li key={label}>
                  <Link
                    href={links[index] ?? card.href}
                    className="flex min-h-11 items-center type-body-s text-gray-700 transition-colors duration-(--duration-fast) hover:text-primary-700 hover:underline md:min-h-6.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
