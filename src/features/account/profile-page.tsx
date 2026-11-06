'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { routes, profileSections } from '@/config/routes';
import { accountCopy } from '@/content/account';
import { accountUiCopy } from '@/content/account-ui';
import { uiCopy } from '@/content/ui';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tag } from '@/components/ui/tag';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { AccountProfile } from '@/data/models/account';
import type { Area } from '@/data/models/area';
import type { Station } from '@/data/models/station';
import type { Ticket } from '@/data/models/ticket';
import { useSession } from '@/lib/session';
import { useFollowedStations } from '@/lib/follows';
import { writeFollows } from '@/lib/follows/follows';
import { readSubmittedReports } from '@/lib/reports';
import { useProfile, saveProfile, clearProfile } from '@/lib/profile/profile';
import { authDelay } from '@/lib/auth/auth';
import { initialsOf } from '@/lib/format/person';
import { formatDate } from '@/lib/format/dates';
import { formatClockTime } from '@/lib/format/date-time';
import { AccountSectionBar } from './account-section-bar';
import { ProfileDetails } from './profile-details';
import { ProfileSecurity } from './profile-security';
import { AccountSidebar } from './account-sidebar';
import { ProfileCard } from './profile-card';

const subscribe = () => () => {};
const browserReady = () => true;
const serverReady = () => false;

export function ProfilePage({
  profile,
  areas,
  stations,
  tickets,
}: {
  profile: AccountProfile;
  areas: Area[];
  stations: Station[];
  tickets: Ticket[];
}) {
  const copy = accountCopy.account;
  const { user, signOut } = useSession();
  const overrides = useProfile();
  const follows = useFollowedStations();
  const hydrated = useSyncExternalStore(subscribe, browserReady, serverReady);
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
  const allTickets = [
    ...(hydrated ? readSubmittedReports().filter((ticket) => ticket.reporterId === user.id) : []),
    ...tickets,
  ]
    .filter((ticket, index, list) => list.findIndex((other) => other.id === ticket.id) === index)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
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
  const card = 'rounded-xl border border-gray-200 bg-surface p-5 md:p-6';

  return (
    <div className="wrap-anywhere">
      <header className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-content px-5 py-8 md:px-8 lg:py-10">
          <Breadcrumb
            items={[{ label: uiCopy.breadcrumb.home, href: routes.home }]}
            current={copy.breadcrumb}
          />
          <div className="mt-6 flex flex-col items-start gap-5 md:flex-row md:items-center">
            <span
              aria-hidden
              className="flex size-18 shrink-0 items-center justify-center rounded-full bg-primary-600 type-heading-xs text-static-white"
            >
              {initialsOf(name)}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="type-heading-s lg:type-heading-m">{name}</h1>
              <div className="mt-2 flex flex-col gap-4 type-body-s text-gray-600 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-2">
                <p>{email}</p>
                <p>{copy.header.memberSince(profile.memberSince)}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={signOut}>
              {copy.header.logOut}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-content gap-16 px-5 pb-8 md:px-8 lg:py-12">
        <aside className="hidden w-docs-sidebar shrink-0 lg:block">
          <div className="sticky top-32">
            <AccountSidebar items={items} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <AccountSectionBar items={items} />
          <div className="flex max-w-article flex-col gap-6">
            <ProfileCard id="profile" title={copy.details.title} className={card}>
              <p className="type-body-s text-gray-600">{copy.details.lede}</p>
              <ProfileDetails
                details={details}
                areas={areas}
                verified={profile.emailVerified && !overrides.email}
                announce={setMessage}
              />
            </ProfileCard>
            <ProfileCard id="reports" title={copy.reports.title} className={card}>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                aria-label={copy.reports.countsLabel}
              >
                {(['pending', 'inProgress', 'resolved'] as const).map((status) => (
                  <div
                    key={status}
                    className={`rounded-lg p-4 ${status === 'pending' ? 'bg-warning-50 text-warning-700' : status === 'inProgress' ? 'bg-primary-50 text-primary-700' : 'bg-success-50 text-success-700'}`}
                  >
                    <p className="type-heading-s">
                      {
                        allTickets.filter((ticket) =>
                          status === 'pending'
                            ? ticket.status === 'pending' || ticket.status === 'submitted'
                            : ticket.status ===
                              (status === 'inProgress' ? 'in-progress' : 'resolved'),
                        ).length
                      }
                    </p>
                    <p className="type-body-s text-gray-600">{copy.reports.counts[status]}</p>
                  </div>
                ))}
              </div>
              {allTickets.slice(0, 3).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={routes.reportTrack.ticket(ticket.id)}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <span className="min-w-0">
                    <span className="block type-body-s-semibold wrap-anywhere">{ticket.title}</span>
                    <span className="mt-2 block type-body-xs text-gray-600">
                      {copy.reports.meta(
                        ticket.id,
                        formatDate(ticket.updatedAt.slice(0, 10)),
                        formatClockTime(ticket.updatedAt),
                      )}
                    </span>
                  </span>
                  <Tag kind={ticket.status === 'in-progress' ? 'inProgress' : ticket.status} />
                </Link>
              ))}
              {!allTickets.length ? <p className="type-body-m">{copy.reports.empty.body}</p> : null}
              <Link
                href={allTickets.length ? routes.reportTrack.track : routes.reportTrack.report}
                className="inline-flex min-h-11 items-center type-body-s-semibold text-primary-700"
              >
                {allTickets.length ? copy.reports.viewAll : copy.reports.empty.action}
              </Link>
            </ProfileCard>
            <ProfileCard id="stations" title={copy.stations.title} className={card}>
              <p className="type-body-s text-gray-600">{copy.stations.lede}</p>
              <ul className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                {stations
                  .filter((station) => follows.isFollowing(station.code))
                  .map((station) => (
                    <li
                      key={station.code}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 md:max-w-80"
                    >
                      <Link
                        href={routes.project.station(station.code)}
                        className="flex min-h-11 min-w-0 flex-col justify-center type-body-s-semibold wrap-anywhere"
                      >
                        <span className="mr-2 text-primary-700">{station.code}</span>
                        {station.name}
                        <span className="mt-1 block type-body-xs text-gray-500">
                          {station.area}
                        </span>
                      </Link>
                      <Button
                        variant="ghost"
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
                <p className="type-body-m">{copy.stations.empty.body}</p>
              ) : null}
              {removed ? (
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
              ) : null}
              <Link
                ref={addStation}
                href={routes.project.stations}
                className="inline-flex min-h-11 items-center type-body-s-semibold text-primary-700"
              >
                {copy.stations.add}
              </Link>
            </ProfileCard>
            <ProfileCard id="notifications" title={copy.notifications.title} className={card}>
              <p className="type-body-s wrap-anywhere text-gray-600">
                {copy.notifications.lede(email)}
              </p>
              {(
                Object.keys(profile.notifications) as (keyof AccountProfile['notifications'])[]
              ).map((id) => (
                <div key={id} className="space-y-2 border-t border-gray-200 pt-4">
                  <Switch
                    label={copy.notifications.items[id].label}
                    aria-describedby={`notification-${id}`}
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
                  <p id={`notification-${id}`} className="type-body-s text-gray-500">
                    {copy.notifications.items[id].hint}
                  </p>
                </div>
              ))}
              {!follows.codes.length ? (
                <p className="type-body-s text-gray-500">{copy.notifications.noStationsNote}</p>
              ) : null}
            </ProfileCard>
            <ProfileCard id="security" title={copy.security.title} className={card}>
              <ProfileSecurity profile={profile} announce={setMessage} />
            </ProfileCard>
            <ProfileCard id="privacy" title={copy.privacy.title} className={card}>
              <p className="type-body-s text-gray-600">{copy.privacy.lede}</p>
              <div className="space-y-3">
                <p className="type-body-s-semibold">{copy.privacy.download.title}</p>
                <p className="type-body-s text-gray-500">{copy.privacy.download.hint}</p>
                <Button
                  variant="secondary"
                  disabled={requested}
                  onClick={() => {
                    setRequested(true);
                    setMessage(copy.privacy.download.requested(email));
                  }}
                >
                  {requested ? accountUiCopy.requested : copy.privacy.download.request}
                </Button>
              </div>
              <Link
                href={routes.legal.terms}
                className="inline-flex min-h-11 items-center type-body-s text-primary-700"
              >
                {copy.privacy.terms.value}
              </Link>
            </ProfileCard>
            <section className={card}>
              <h2 className="type-body-m-semibold text-danger-700">{copy.delete.title}</h2>
              <p className="mt-3 type-body-s text-gray-600">{copy.delete.body}</p>
              <Button
                variant="secondary"
                className="mt-5 text-danger-700"
                onClick={() => setDeleting(true)}
              >
                {copy.delete.action}
              </Button>
            </section>
            <p role="status" className="type-body-s text-success-700">
              {message}
            </p>
          </div>
        </div>
      </div>
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
