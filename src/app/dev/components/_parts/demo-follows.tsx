'use client';

import { Button } from '@/components/ui/button';
import type { StationCode } from '@/data/models/station';
import { useFollowedStations } from '@/lib/follows';

type DemoFollowsProps = {
  stations: readonly { code: StationCode; name: string }[];
  labels: {
    follow: string;
    unfollow: string;
    following: string;
    nothing: string;
    guestNote: string;
  };
};

/** Follow and unfollow buttons over the shared follows context, for the gallery. */
export function DemoFollows({ stations, labels }: DemoFollowsProps) {
  const { codes, ready, signedIn, isFollowing, follow, unfollow } = useFollowedStations();
  if (ready && !signedIn) return <p className="type-body-s text-gray-600">{labels.guestNote}</p>;
  return (
    <div className="flex w-full flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {stations.map((station) => {
          const following = isFollowing(station.code);
          return (
            <li key={station.code} className="flex items-center gap-4">
              <span className="w-48 type-body-s text-gray-800">
                {station.code} {station.name}
              </span>
              <Button
                variant="secondary"
                aria-pressed={following}
                onClick={() => (following ? unfollow(station.code) : follow(station.code))}
              >
                {following ? labels.unfollow : labels.follow}
                <span className="sr-only"> {station.name}</span>
              </Button>
            </li>
          );
        })}
      </ul>
      <p data-testid="follows-summary" className="type-body-s text-gray-700">
        {`${labels.following}: ${codes.length > 0 ? codes.join(', ') : labels.nothing}`}
      </p>
    </div>
  );
}
