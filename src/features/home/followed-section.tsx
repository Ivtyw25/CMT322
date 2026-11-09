'use client';

import { ButtonLink } from '@/components/ui/button-link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/config/routes';
import { homeCopy } from '@/content/home';
import { useFollowedStations } from '@/lib/follows';
import { FollowedStationPanel } from './followed-station-panel';
import type { FollowedStationData } from './followed-stations-data';
import { HomeSection, SectionHeader } from './section-frame';

const copy = homeCopy.followed;
const HEADING_ID = 'your-stations-heading';

function Prompt({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-primary-50 p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="type-body-m-semibold text-primary-700">{title}</h3>
        <p className="type-body-s text-gray-700">{body}</p>
      </div>
      <ButtonLink href={href} className="self-start md:shrink-0 md:self-center">
        {action}
      </ButtonLink>
    </div>
  );
}

function SignedIn({ stations, today }: FollowedSectionProps) {
  const { ready, codes } = useFollowedStations();
  if (!ready) return null;
  const followed = codes
    .map((code) => stations.find((station) => station.code === code))
    .filter((station): station is FollowedStationData => station !== undefined);
  const first = followed[0];
  if (!first) {
    return <Prompt {...copy.none} href={routes.project.stations} />;
  }
  return (
    <Tabs defaultValue={first.code} key={followed.map((station) => station.code).join()}>
      <TabsList aria-label={copy.tabsLabel}>
        {followed.map((station) => (
          <TabsTrigger key={station.code} value={station.code}>
            {station.code} {station.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {followed.map((station) => (
        <TabsContent key={station.code} value={station.code}>
          <FollowedStationPanel station={station} today={today} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

type FollowedSectionProps = {
  /** Every station's section data; the visitor's follows pick from it. */
  stations: readonly FollowedStationData[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
};

/**
 * "Your stations": for each station the visitor follows, its traffic changes, construction
 * progress and recent reports. Guests get a prompt to log in and follow stations.
 */
export function FollowedSection({ stations, today }: FollowedSectionProps) {
  return (
    <HomeSection headingId={HEADING_ID}>
      <SectionHeader headingId={HEADING_ID} title={copy.title} lede={copy.lede} />
      <div data-auth="signed-in">
        <SignedIn stations={stations} today={today} />
      </div>
      <div data-auth="guest">
        <Prompt {...copy.guest} href={routes.account.loginReturningTo(routes.home)} />
      </div>
    </HomeSection>
  );
}
