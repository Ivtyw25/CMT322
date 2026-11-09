'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ProgressEntry } from '@/components/patterns/progress-entry';
import { StationProgressSummary } from '@/components/patterns/station-progress-summary';
import { ButtonLink } from '@/components/ui/button-link';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
import { Tag } from '@/components/ui/tag';
import { progressStationParam, routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { uiCopy } from '@/content/ui';
import type { ProgressUpdate } from '@/data/models/progress-update';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { AdminPageHead } from '@/features/admin/page-head';
import { RowMenu } from '@/features/admin/row-menu';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { formatFullDateTime } from '@/lib/format/date-time';
import { progressStore, type ProgressStation } from '@/lib/staff-records/progress-store';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { stationProgressFrom } from '@/lib/station-progress/live-progress';

const copy = adminCopy.progress;

type ProgressPageProps = {
  base: readonly ProgressUpdate[];
  /** Every station in line order, with its stages before any update. */
  stations: readonly ProgressStation[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
};

function dateTextOf(update: ProgressUpdate): string | undefined {
  if (update.state === 'published') return undefined;
  if (update.state === 'scheduled') return copy.dates.scheduled(formatDate(update.date));
  return copy.dates.draft(update.savedAt ? formatFullDateTime(update.savedAt) : '');
}

/**
 * Progress updates (Figma 117:5417), one station at a time: the station list on the left and, for
 * the chosen station, its progress and timeline exactly as the station page shows them, with the
 * developer's drafts and scheduled updates on top.
 */
export function ProgressPage({ base, stations, today }: ProgressPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const records = useStaffRecords(progressStore, base);
  const [toDelete, setToDelete] = useState<ProgressUpdate | null>(null);

  const views = useMemo(
    () =>
      stations.map((station) => {
        const view = stationProgressFrom(station.code, station.base, records, today);
        const liveIds = new Set(view.updates.map((update) => update.id));
        const unpublished = records
          .filter((record) => record.stationCode === station.code && !liveIds.has(record.id))
          .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
        return { station, ...view, unpublished };
      }),
    [stations, records, today],
  );

  // The station in the address, or the one the developer saved an update for last.
  const lastSaved = [...records].sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0];
  const requested = searchParams.get(progressStationParam)?.toUpperCase();
  const current =
    views.find((view) => view.station.code === requested) ??
    views.find((view) => view.station.code === lastSaved?.stationCode) ??
    views[0];

  return (
    <DeveloperOnly>
      <div className="flex flex-col gap-6">
        <AdminPageHead
          title={copy.title}
          intro={copy.intro}
          action={
            <ButtonLink
              href={
                current
                  ? routes.admin.progressNewFor(current.station.code)
                  : routes.admin.progressNew
              }
            >
              {current ? copy.newFor(current.station.code) : copy.newUpdate}
            </ButtonLink>
          }
        />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <Field label={copy.station} className="lg:hidden">
            <MenuSelect
              value={current?.station.code ?? ''}
              onValueChange={(code) =>
                router.replace(routes.admin.progressFor(code), { scroll: false })
              }
              options={views.map(({ station, progress }) => ({
                value: station.code,
                label: `${station.code} ${station.name}, ${
                  progress ? copy.percent(progress.percent) : copy.notStarted
                }`,
              }))}
            />
          </Field>

          <nav
            aria-label={copy.stationsLabel}
            className="hidden w-80 shrink-0 rounded-2xl border border-gray-200 bg-surface p-3 lg:block"
          >
            <ol>
              {views.map(({ station, progress, unpublished }) => {
                const selected = station.code === current?.station.code;
                return (
                  <li key={station.code} className="group relative">
                    <span
                      aria-hidden
                      className="absolute top-0 bottom-0 left-5.5 w-0.5 bg-primary-200 group-first:top-1/2 group-last:bottom-1/2"
                    />
                    <Link
                      href={routes.admin.progressFor(station.code)}
                      scroll={false}
                      aria-current={selected ? 'true' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg py-2 pr-3 pl-4 transition-colors duration-(--duration-fast) hover:bg-primary-50',
                        selected && 'bg-primary-50',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'size-3 shrink-0 rounded-full border-2 border-primary-600',
                          selected ? 'bg-primary-600' : 'bg-surface',
                        )}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="flex items-center gap-1.5 type-body-s text-gray-900">
                          <span className="rounded-sm bg-primary-600 px-1.5 py-0.5 type-body-xs-semibold text-static-white">
                            {station.code}
                          </span>
                          <span className={cn('truncate', selected && 'type-body-s-semibold')}>
                            {station.name}
                          </span>
                        </span>
                        {unpublished.length > 0 ? (
                          <span className="type-body-xs text-gray-500">
                            {copy.unpublished(unpublished.length)}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 type-body-xs-semibold text-primary-700">
                        {progress ? copy.percent(progress.percent) : copy.notStarted}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          {current ? (
            <section
              aria-labelledby="station-heading"
              className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-gray-200 bg-surface p-5 md:px-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="station-heading" className="type-heading-3xs text-gray-900">
                  {current.station.code} {current.station.name}
                </h2>
                <Link
                  href={routes.project.station(current.station.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hit-area type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
                >
                  {copy.publicPage}
                  <span className="sr-only"> {uiCopy.opensInNewTab}</span>
                </Link>
              </div>

              <StationProgressSummary progress={current.progress} stages={current.stages} />

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="type-body-m-semibold text-gray-900">{copy.timeline}</h3>
                  <p className="type-body-xs text-gray-500">{copy.timelineHint}</p>
                </div>
                {current.unpublished.length + current.updates.length > 0 ? (
                  <ol aria-label={copy.timeline} className="flex flex-col">
                    {[...current.unpublished, ...current.updates].map((update) => (
                      <ProgressEntry
                        key={update.id}
                        update={update}
                        first={update.id === current.updates[0]?.id}
                        href={routes.admin.progressEditor(update.id)}
                        dateText={dateTextOf(update)}
                        badge={
                          <>
                            <Tag kind={update.state} />
                            <span className="type-body-xs text-gray-500">
                              {copy.by(update.author)}
                            </span>
                          </>
                        }
                        action={
                          <RowMenu
                            title={update.title}
                            editHref={routes.admin.progressEditor(update.id)}
                            onDelete={() => setToDelete(update)}
                          />
                        }
                      />
                    ))}
                  </ol>
                ) : (
                  <p className="type-body-s text-gray-600">{copy.empty}</p>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title={adminCopy.content.confirmDelete.title(toDelete?.title ?? '')}
        body={adminCopy.content.confirmDelete.body}
        confirm={adminCopy.content.confirmDelete.confirm}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) progressStore.remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </DeveloperOnly>
  );
}
