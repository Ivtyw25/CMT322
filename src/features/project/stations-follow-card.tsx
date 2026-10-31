'use client';

import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { Station } from '@/data/models/station';
import { useFollowedStations } from '@/lib/follows';

const { aside } = projectCopy.stations;

const cardClass = 'flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4';

function SignedInCard({ stations }: { stations: readonly Pick<Station, 'code' | 'name'>[] }) {
  const { codes, ready } = useFollowedStations();
  const followed = stations.filter((station) => codes.includes(station.code));

  return (
    <div className={cardClass} aria-busy={!ready || undefined}>
      <h2 className="type-body-s-semibold text-gray-900">{aside.following.title}</h2>
      {ready ? (
        <p className="type-body-xs text-gray-600">
          {followed.length > 0
            ? aside.following.body(followed.map((station) => `${station.code} ${station.name}`))
            : aside.none.body}
        </p>
      ) : (
        <div aria-hidden className="flex flex-col gap-1.5">
          <span className="rounded h-4 w-full bg-gray-100" />
          <span className="rounded h-4 w-2/3 bg-gray-100" />
        </div>
      )}
      <ButtonLink href={routes.account.profileSection('stations')} fullWidth>
        {aside.following.action}
      </ButtonLink>
    </div>
  );
}

/**
 * The "Stations you follow" card. Both variants are in the page; the head script's
 * `data-session` shows one, so the card never flashes the wrong one.
 */
export function StationsFollowCard({
  stations,
}: {
  stations: readonly Pick<Station, 'code' | 'name'>[];
}) {
  return (
    <>
      <div data-auth="signed-in">
        <SignedInCard stations={stations} />
      </div>
      <div data-auth="guest" className={cardClass}>
        <h2 className="type-body-s-semibold text-gray-900">{aside.signedOut.title}</h2>
        <p className="type-body-xs text-gray-600">{aside.signedOut.body}</p>
        <ButtonLink href={routes.account.loginReturningTo(routes.project.stations)} fullWidth>
          {aside.signedOut.action}
        </ButtonLink>
      </div>
    </>
  );
}
