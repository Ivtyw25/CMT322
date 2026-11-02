import { CalendarDays, Map as MapIcon, Route as RouteIcon, type LucideIcon } from 'lucide-react';
import { LinkCard } from '@/components/ui/link-card';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';

const copy = trafficCopy.overview.pages;

const CARD_TARGETS: Record<(typeof copy.cards)[number]['id'], { href: string; icon: LucideIcon }> =
  {
    map: { href: routes.traffic.map, icon: MapIcon },
    route: { href: routes.traffic.route, icon: RouteIcon },
    announcements: { href: routes.traffic.announcements, icon: CalendarDays },
  };

/** "Pages in this section": one link card for each Traffic page (Figma 66:2206). */
export function OverviewPageCards({ headingId }: { headingId: string }) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2 id={headingId} tabIndex={-1} className="type-heading-xs">
        {copy.title}
      </h2>
      <ul className="grid gap-4 md:grid-cols-3 md:gap-3 lg:gap-4">
        {copy.cards.map((card) => {
          const { href, icon: Icon } = CARD_TARGETS[card.id];
          const bodyId = `overview-card-${card.id}`;
          return (
            <li key={card.id} className="flex">
              <LinkCard
                href={href}
                title={card.title}
                titleAs="h3"
                titleTone="link"
                describedBy={bodyId}
                className="w-full gap-3 p-5"
                media={
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon aria-hidden className="size-5" />
                  </span>
                }
              >
                <p id={bodyId} className="type-body-s text-gray-600">
                  {card.body}
                </p>
                <ul className="mt-auto flex flex-col gap-2 border-t border-gray-200 pt-4 type-body-s text-gray-700">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </LinkCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
