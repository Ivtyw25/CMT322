'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { StationCode } from '@/data/models/station';
import { useFollowedStations } from '@/lib/follows';
import { FollowToggle } from './station-follow-button';

const { alerts } = projectCopy.station;

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 type-body-m-semibold text-primary-700">
      <Bell aria-hidden className="size-4.5 shrink-0" />
      {children}
    </h2>
  );
}

const cardClass = 'flex flex-col gap-2 rounded-2xl bg-primary-50 p-5';

function SignedIn({ code, name }: { code: StationCode; name: string }) {
  const { ready, isFollowing } = useFollowedStations();
  if (ready && isFollowing(code)) {
    return (
      <div className={cardClass}>
        <Title>{alerts.following.title(name)}</Title>
        <p className="type-body-s text-gray-700">{alerts.following.body}</p>
        <Link
          href={routes.account.profileSection('notifications')}
          className="hit-area w-fit type-body-s-medium text-primary-700 hover:underline"
        >
          {alerts.following.link}
        </Link>
      </div>
    );
  }
  return (
    <div className={cardClass}>
      <Title>{alerts.notFollowing.title(name)}</Title>
      <p className="type-body-s text-gray-700">{alerts.notFollowing.body}</p>
      <div className="mt-1 flex">
        <FollowToggle code={code} name={name} />
      </div>
    </div>
  );
}

/** The rail card about email alerts. Three variants: following, not following, guest. */
export function StationAlertsCard({ code, name }: { code: StationCode; name: string }) {
  return (
    <>
      <div data-auth="signed-in">
        <SignedIn code={code} name={name} />
      </div>
      <div data-auth="guest" className={cardClass}>
        <Title>{alerts.signedOut.title(name)}</Title>
        <p className="type-body-s text-gray-700">{alerts.signedOut.body}</p>
        <ButtonLink
          variant="ghost"
          href={routes.account.loginReturningTo(routes.project.station(code))}
          className="w-fit py-0"
        >
          {alerts.signedOut.action}
        </ButtonLink>
      </div>
    </>
  );
}
