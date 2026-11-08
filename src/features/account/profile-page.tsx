'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { routes, profileSections } from '@/config/routes';
import { accountCopy } from '@/content/account';
import { accountUiCopy } from '@/content/account-ui';
import { uiCopy } from '@/content/ui';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/layout/container';
import { Switch } from '@/components/ui/switch';
import { Tag } from '@/components/ui/tag';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { AccountProfile } from '@/data/models/account';
import type { Area } from '@/data/models/area';
import type { Station } from '@/data/models/station';
import { useSession } from '@/lib/session';
import { useFollowedStations } from '@/lib/follows';
import { writeFollows } from '@/lib/follows/follows';
import { lastActivityAt, useTickets } from '@/lib/tickets';
import { useProfile, saveProfile, clearProfile } from '@/lib/profile/profile';
import { authDelay } from '@/lib/auth/auth';
import { initialsOf } from '@/lib/format/person';
import { formatDate } from '@/lib/format/dates';
import { formatClockTime, isoDateOf } from '@/lib/format/date-time';
import { AccountSectionBar } from './account-section-bar';
import { ProfileDetails } from './profile-details';
import { ProfileSecurity } from './profile-security';
import { AccountSidebar } from './account-sidebar';
import { ProfileCard, profileLabel, profileRow, profileRowAction } from './profile-card';

export function ProfilePage({
  profile,
  areas,
  stations,
}: {
  profile: AccountProfile;
  areas: Area[];
  stations: Station[];
}) {
  const copy = accountCopy.account;
  const { user, signOut } = useSession();
  const overrides = useProfile();
  const { tickets } = useTickets();
  const follows = useFollowedStations();
  const [message, setMessage] = useState('');
  const [removed, setRemoved] = useState<Station | null>(null);
  const [requested, setRequested] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pending, setPending] = useState(false);
  const addStation = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!removed) return;
    const timer = window.setTimeout(() => setRemoved(null), 6000);
    return () => window.clearTimeout(timer);
  }, [removed]);
  useEffect(() => {
    const focusHash = () => {
      try {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (profileSections.some((section) => section === id)) document.getElementById(id)?.focus();
      } catch {
        // Invalid URL escapes are not account section identifiers.
      }
    };
    focusHash();
    window.addEventListener('hashchange', focusHash);
    return () => window.removeEventListener('hashchange', focusHash);
  }, []);
  if (!user) return null;
  const name = overrides.name ?? user.name;
  const email = overrides.email ?? user.email;
  const details = {
    name,
    email,
    phone: overrides.phone ?? profile.phone ?? '',
    homeArea: overrides.homeArea ?? user.homeArea,
  };
  const allTickets = tickets
    .filter((ticket) => ticket.reporterId === user.id)
    .toSorted((a, b) => Date.parse(lastActivityAt(b)) - Date.parse(lastActivityAt(a)));
  const navLabels = [
    copy.nav.items.details,
    copy.nav.items.reports,
    copy.nav.items.stations,
    copy.nav.items.notifications,
    copy.nav.items.security,
    copy.nav.items.privacy,
  ];
  const items = profileSections.map((id, index) => ({
    id,
    label: navLabels[index] ?? copy.nav.label,
  }));

  return (
    <div className="wrap-anywhere">
      <header className="border-b border-gray-200 bg-gray-50">
        <Container gutter="wide" className="py-7 lg:py-10">
          <Breadcrumb
            items={[{ label: uiCopy.breadcrumb.home, href: routes.home }]}
            current={copy.breadcrumb}
          />
          <div className="mt-5 flex flex-col items-start gap-5 md:flex-row md:items-center">
            <span
              aria-hidden
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-600 type-heading-xs text-static-white lg:size-18"
            >
              {initialsOf(name)}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="type-heading-m">{name}</h1>
              <div className="mt-1 flex flex-col gap-4 type-body-s text-gray-600 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-2">
                <p>{email}</p>
                <p>{copy.header.memberSince(profile.memberSince)}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={signOut}>
              {copy.header.logOut}
            </Button>
          </div>
        </Container>
      </header>
      <Container gutter="wide" className="flex gap-16 pb-7 lg:py-12">
        <aside className="hidden w-docs-sidebar shrink-0 lg:block">
          <div className="sticky top-32">
            <AccountSidebar items={items} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <AccountSectionBar items={items} />
          <div className="flex max-w-article flex-col gap-6">
            <ProfileCard id="profile" title={copy.details.title} lede={copy.details.lede}>
              <ProfileDetails
                details={details}
                areas={areas}
                verified={profile.emailVerified && !overrides.email}
                announce={setMessage}
              />
            </ProfileCard>
            <ProfileCard
              id="reports"
              actionBeside
              title={copy.reports.title}
              lede={copy.reports.lede}
              action={
                allTickets.length ? (
                  <ButtonLink variant="ghost" href={routes.reportTrack.track}>
                    {copy.reports.viewAll}
                  </ButtonLink>
                ) : null
              }
            >
              <div
                className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 pb-5 sm:grid-cols-3 sm:gap-3 md:px-6"
                aria-label={copy.reports.countsLabel}
              >
                {(['pending', 'inProgress', 'resolved'] as const).map((status) => (
                  <div
                    key={status}
                    className={`rounded-lg px-4 py-3.5 ${status === 'pending' ? 'bg-warning-50 text-warning-700' : status === 'inProgress' ? 'bg-primary-50 text-primary-700' : 'bg-success-50 text-success-700'}`}
                  >
                    <p className="type-heading-s">
                      {
                        allTickets.filter(
                          (ticket) =>
                            ticket.status === (status === 'inProgress' ? 'in-progress' : status),
                        ).length
                      }
                    </p>
                    <p className="mt-0.5 type-body-s text-gray-600">
                      {copy.reports.counts[status]}
                    </p>
                  </div>
                ))}
              </div>
              {allTickets.slice(0, 1).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={routes.reportTrack.ticket(ticket.id)}
                  className="flex flex-col items-start gap-4 border-t border-gray-200 px-4 py-4 last:rounded-b-xl hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block min-h-10 type-body-s-medium wrap-anywhere md:min-h-0">
                      {ticket.subject}
                    </span>
                    <span className="mt-0.5 block type-body-xs text-gray-600">
                      {copy.reports.meta(
                        ticket.id,
                        formatDate(isoDateOf(lastActivityAt(ticket))),
                        formatClockTime(lastActivityAt(ticket)),
                      )}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-start gap-4 md:flex-row md:items-center">
                    <Tag kind={ticket.status === 'in-progress' ? 'inProgress' : ticket.status} />
                    <ChevronRight aria-hidden className="size-4 text-gray-400" />
                  </span>
                </Link>
              ))}
              {!allTickets.length ? (
                <div className="space-y-2 border-t border-gray-200 px-4 py-4 md:px-6">
                  <p className="type-body-m">{copy.reports.empty.body}</p>
                  <Link
                    href={routes.reportTrack.report}
                    className="inline-flex min-h-11 items-center type-body-s-semibold text-primary-700"
                  >
                    {copy.reports.empty.action}
                  </Link>
                </div>
              ) : null}
            </ProfileCard>
            <ProfileCard
              id="stations"
              title={copy.stations.title}
              lede={copy.stations.lede}
              action={
                <ButtonLink ref={addStation} variant="secondary" href={routes.project.stations}>
                  {copy.stations.add}
                </ButtonLink>
              }
            >
              <ul className="flex flex-col gap-2.5 px-4 pb-5 md:flex-row md:flex-wrap md:px-6">
                {stations
                  .filter((station) => follows.isFollowing(station.code))
                  .map((station) => (
                    <li
                      key={station.code}
                      className="flex min-w-0 items-center justify-between gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 md:max-w-80"
                    >
                      <Link
                        href={routes.project.station(station.code)}
                        className="hit-area flex min-w-0 items-center gap-2.5"
                      >
                        <span className="rounded bg-primary-600 px-1.5 py-0.5 type-body-xs-semibold text-static-white">
                          {station.code}
                        </span>
                        <span className="min-w-0">
                          <span className="block type-body-s-medium wrap-anywhere">
                            {station.name}
                          </span>
                          <span className="block type-body-xs text-gray-500">{station.area}</span>
                        </span>
                      </Link>
                      <Button
                        variant="ghost"
                        className="size-4 p-0 text-gray-400"
                        aria-label={copy.stations.remove(station.name)}
                        onClick={(event) => {
                          const row = event.currentTarget.closest('li');
                          const target =
                            row?.nextElementSibling?.querySelector('button') ??
                            row?.previousElementSibling?.querySelector('button');
                          follows.unfollow(station.code);
                          setRemoved(station);
                          setMessage(copy.stations.removed(station.name));
                          requestAnimationFrame(() =>
                            target
                              ? (target as HTMLButtonElement).focus()
                              : addStation.current?.focus(),
                          );
                        }}
                      >
                        <X aria-hidden className="size-4" />
                      </Button>
                    </li>
                  ))}
              </ul>
              {!follows.codes.length ? (
                <p className="px-4 pb-5 type-body-m md:px-6">{copy.stations.empty.body}</p>
              ) : null}
              {removed ? (
                <div className="px-4 pb-3 md:px-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      follows.follow(removed.code);
                      setMessage(copy.stations.added(removed.name));
                      setRemoved(null);
                    }}
                  >
                    {copy.stations.undo}
                  </Button>
                </div>
              ) : null}
            </ProfileCard>
            <ProfileCard
              id="notifications"
              title={copy.notifications.title}
              lede={copy.notifications.lede(email)}
            >
              {(
                Object.keys(profile.notifications) as (keyof AccountProfile['notifications'])[]
              ).map((id) => (
                <div key={id} className="border-t border-gray-200 px-4 py-4 md:px-6">
                  <Switch
                    label={copy.notifications.items[id].label}
                    description={copy.notifications.items[id].hint}
                    checked={overrides.notifications?.[id] ?? profile.notifications[id]}
                    onCheckedChange={(checked) => {
                      saveProfile({
                        notifications: {
                          ...profile.notifications,
                          ...overrides.notifications,
                          [id]: checked,
                        },
                      });
                      setMessage(copy.notifications.saved);
                    }}
                  />
                </div>
              ))}
              {!follows.codes.length ? (
                <p className="border-t border-gray-200 px-4 py-4 type-body-s text-gray-500 md:px-6">
                  {copy.notifications.noStationsNote}
                </p>
              ) : null}
            </ProfileCard>
            <ProfileCard id="security" title={copy.security.title} lede={copy.security.lede}>
              <ProfileSecurity profile={profile} announce={setMessage} />
            </ProfileCard>
            <ProfileCard id="privacy" title={copy.privacy.title} lede={copy.privacy.lede}>
              <div className={profileRow}>
                <p className={profileLabel}>{copy.privacy.download.label}</p>
                <Button
                  variant="ghost"
                  className={profileRowAction}
                  disabled={requested}
                  onClick={() => {
                    setRequested(true);
                    setMessage(copy.privacy.download.requested(email));
                  }}
                >
                  {requested ? accountUiCopy.requested : copy.privacy.download.request}
                </Button>
                <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1">
                  <p className="type-body-s text-gray-900">{copy.privacy.download.title}</p>
                  <p className="mt-0.5 type-body-xs text-gray-500">{copy.privacy.download.hint}</p>
                </div>
              </div>
              <div className={profileRow}>
                <p className={profileLabel}>{copy.privacy.terms.label}</p>
                <Link
                  href={routes.legal.terms}
                  className={`${profileRowAction} hit-area inline-flex items-center justify-end type-body-s-semibold text-primary-700 hover:text-primary-800`}
                >
                  {copy.privacy.terms.view}
                </Link>
                <p className="col-start-1 row-start-2 type-body-s text-gray-900 md:col-start-2 md:row-start-1">
                  {copy.privacy.terms.value}
                </p>
              </div>
            </ProfileCard>
            <ProfileCard
              id="delete-account"
              tone="danger"
              title={copy.delete.title}
              lede={copy.delete.body}
              action={
                <Button
                  variant="secondary"
                  className="border-danger-100 text-danger-700"
                  onClick={() => setDeleting(true)}
                >
                  {copy.delete.action}
                </Button>
              }
            />
            <p role="status" className="type-body-s text-success-700 empty:-mt-6">
              {message}
            </p>
          </div>
        </div>
      </Container>
      <ConfirmDialog
        open={deleting}
        title={copy.delete.confirm.title}
        body={copy.delete.confirm.body}
        confirm={copy.delete.confirm.confirm}
        pending={pending}
        onClose={() => setDeleting(false)}
        onConfirm={async () => {
          setPending(true);
          await authDelay(700);
          clearProfile();
          writeFollows([]);
          signOut();
        }}
      />
    </div>
  );
}
