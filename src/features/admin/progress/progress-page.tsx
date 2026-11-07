'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, type TagKind } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { ProgressState, StaffProgressUpdate } from '@/data/models/staff-content';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { AdminPageHead } from '@/features/admin/page-head';
import { RowMenu } from '@/features/admin/row-menu';
import { formatDate } from '@/lib/format/dates';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { useQueryParams } from '@/lib/url/use-query-params';
import { progressStore, type ProgressStation } from './progress-store';

const copy = adminCopy.progress;
const PAGE_SIZE = 10;

const tabs = ['all', 'published', 'scheduled', 'drafts'] as const;
type Tab = (typeof tabs)[number];

const tabOf: Record<ProgressState, Exclude<Tab, 'all'>> = {
  published: 'published',
  scheduled: 'scheduled',
  draft: 'drafts',
};
const tagOf: Record<ProgressState, TagKind> = {
  published: 'published',
  scheduled: 'scheduled',
  draft: 'draft',
};

const isTab = (value: string | null): value is Tab => tabs.some((tab) => tab === value);
const rowGrid = 'lg:grid-cols-[4.5rem_1fr_11.875rem_6.875rem_6rem_2rem]';

type ProgressPageProps = {
  base: readonly StaffProgressUpdate[];
  stations: readonly ProgressStation[];
};

/** Progress updates (Figma 117:5417): status tabs and the list of updates. */
export function ProgressPage({ base, stations }: ProgressPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useQueryParams({ status: 'all' });
  const records = useStaffRecords(progressStore, base);
  const [toDelete, setToDelete] = useState<StaffProgressUpdate | null>(null);

  const names = useMemo(
    () => new Map(stations.map((station) => [station.code, station.name])),
    [stations],
  );
  const nameOf = (code: string) => names.get(code) ?? code;
  const rawStatus = searchParams.get('status');
  const status: Tab = isTab(rawStatus) ? rawStatus : 'all';
  const query = searchParams.get('q') ?? '';

  const bySearch = useMemo(() => {
    const text = query.trim().toLowerCase();
    return records.filter(
      (item) =>
        text === '' ||
        `${item.title} ${item.stationCode} ${names.get(item.stationCode) ?? ''}`
          .toLowerCase()
          .includes(text),
    );
  }, [records, query, names]);

  const counts: Record<Tab, number> = {
    all: bySearch.length,
    published: 0,
    scheduled: 0,
    drafts: 0,
  };
  for (const item of bySearch) counts[tabOf[item.state]] += 1;

  const matching = bySearch.filter((item) => status === 'all' || tabOf[item.state] === status);
  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const requested = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Math.min(pageCount, Math.max(1, Number.isNaN(requested) ? 1 : requested));
  const first = (page - 1) * PAGE_SIZE;
  const pageItems = matching.slice(first, first + PAGE_SIZE);

  function hrefFor(target: number): string {
    const next = new URLSearchParams(searchParams.toString());
    if (target <= 1) next.delete('page');
    else next.set('page', String(target));
    const text = next.toString();
    return `${pathname}${text ? `?${text}` : ''}`;
  }

  return (
    <DeveloperOnly>
      <div className="flex flex-col gap-6">
        <AdminPageHead
          title={copy.title}
          intro={copy.intro}
          action={<ButtonLink href={routes.admin.progressNew}>{copy.newUpdate}</ButtonLink>}
        />

        <Tabs
          value={status}
          onValueChange={(value) => {
            if (isTab(value)) params.set({ status: value, page: null });
          }}
        >
          <TabsList aria-label={copy.tabsLabel}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} count={counts[tab]}>
                {copy.tabs[tab]}
              </TabsTrigger>
            ))}
          </TabsList>

          <SearchInput
            aria-label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => params.set({ q: event.target.value, page: null })}
            onClear={() => params.set({ q: null, page: null })}
            className="w-full md:w-80"
          />

          <TabsContent value={status}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
              {pageItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                  <p className="type-heading-3xs text-gray-900">{copy.empty.title}</p>
                  <p className="max-w-md type-body-s text-gray-600">{copy.empty.body}</p>
                  {query !== '' || status !== 'all' ? (
                    <Button variant="secondary" onClick={() => router.replace(pathname)}>
                      {copy.empty.clear}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <ul aria-label={copy.table.label}>
                  {pageItems.map((item) => (
                    <li
                      key={item.id}
                      className={`relative grid grid-cols-[4.5rem_1fr_2rem] items-center gap-x-4 gap-y-2 border-b border-gray-200 px-4 py-3 transition-colors duration-(--duration-fast) hover:bg-primary-50 ${rowGrid}`}
                    >
                      <ImagePlaceholder decorative className="h-12 rounded-md" />
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <Link
                          href={routes.admin.progressEditor(item.id)}
                          className="type-body-s-medium text-gray-900 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                        >
                          {item.title}
                        </Link>
                        <p className="type-body-xs text-gray-500">{copy.table.by(item.author)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 type-body-s text-gray-700 max-lg:order-3 max-lg:col-start-2 max-lg:col-end-4">
                        <span className="rounded-sm bg-primary-600 px-1.5 py-0.5 type-body-xs-semibold text-static-white">
                          {item.stationCode}
                        </span>
                        {nameOf(item.stationCode)}
                      </div>
                      <p className="type-body-s text-gray-700 max-lg:order-4 max-lg:col-start-2 max-lg:col-end-4">
                        <span className="sr-only">{copy.table.date}: </span>
                        {item.date ? formatDate(item.date) : adminCopy.content.noDate}
                      </p>
                      <div className="max-lg:order-5 max-lg:col-start-2 max-lg:col-end-4">
                        <Tag kind={tagOf[item.state]} />
                      </div>
                      <div className="max-lg:order-2">
                        <RowMenu
                          title={item.title}
                          editHref={routes.admin.progressEditor(item.id)}
                          onDelete={() => setToDelete(item)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {matching.length > 0 ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                  <p className="min-w-0 flex-1 basis-60 type-body-s text-gray-600">
                    {copy.showing(first + 1, first + pageItems.length, matching.length)}
                  </p>
                  <Pagination
                    page={page}
                    pageCount={pageCount}
                    label={copy.paginationLabel}
                    hrefFor={hrefFor}
                    onNavigate={(target) =>
                      params.set({ page: target <= 1 ? null : String(target) }, { mode: 'push' })
                    }
                  />
                </div>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
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
