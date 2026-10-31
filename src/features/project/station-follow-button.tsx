'use client';

import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { StationCode } from '@/data/models/station';
import { useAnnounce } from '@/lib/announce/announcer';
import { useFollowedStations } from '@/lib/follows';

const { actions } = projectCopy.station;

type StationFollowButtonProps = { code: StationCode; name: string };

/**
 * Follow toggle for a station. A guest sees a link to Log in that returns here; a signed-in
 * visitor sees a toggle button. Both are in the page, and `data-session` shows one.
 */
export function StationFollowButton({ code, name }: StationFollowButtonProps) {
  return (
    <>
      <div data-auth="signed-in" className="flex">
        <FollowToggle code={code} name={name} />
      </div>
      <div data-auth="guest" className="flex">
        <ButtonLink
          variant="secondary"
          icon={<Bell aria-hidden className="size-4" />}
          href={routes.account.loginReturningTo(routes.project.station(code))}
        >
          {actions.follow}
        </ButtonLink>
      </div>
    </>
  );
}

/** The toggle alone, for the alerts card. Render it inside a signed-in-only wrapper. */
export function FollowToggle({ code, name }: StationFollowButtonProps) {
  const announce = useAnnounce();
  const { ready, isFollowing, follow, unfollow } = useFollowedStations();
  const following = ready && isFollowing(code);

  function toggle() {
    if (!ready) return;
    if (following) {
      unfollow(code);
      announce(actions.unfollowed(name));
    } else {
      follow(code);
      announce(actions.followed(name));
    }
  }

  return (
    <Button
      variant="secondary"
      aria-pressed={following}
      aria-label={actions.followLabel(name)}
      aria-busy={!ready || undefined}
      onClick={toggle}
      icon={
        following ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Bell aria-hidden className="size-4" />
        )
      }
      className={
        following
          ? 'border-primary-200 bg-primary-50 text-primary-700 hover:border-primary-200 hover:bg-primary-100 active:bg-primary-100'
          : undefined
      }
    >
      {following ? uiCopy.station.following : actions.follow}
    </Button>
  );
}
