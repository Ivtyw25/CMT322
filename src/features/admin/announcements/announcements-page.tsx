'use client';

import { ArrowDownUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { ChipSelect } from '@/components/ui/chip-select';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, type TagKind } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { AnnouncementType } from '@/data/models/announcement';
import type { StaffAnnouncement, StaffAnnouncementStatus } from '@/data/models/staff-content';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { useQueryParams } from '@/lib/url/use-query-params';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { AdminPageHead } from '@/features/admin/page-head';
import { RowMenu } from '@/features/admin/row-menu';
import { announcementStore } from './announcement-store';

const copy = adminCopy.announcements;
const PAGE_SIZE = 7;

const tabs = ['all', 'active', 'scheduled', 'ended', 'drafts'] as const;
type Tab = (typeof tabs)[number];
const sorts = ['newest', 'oldest'] as const;
type Sort = (typeof sorts)[number];
const types = ['closure', 'construction', 'hazard'] as const satisfies readonly AnnouncementType[];

const tabOf: Record<StaffAnnouncementStatus, Exclude<Tab, 'all'>> = {
  draft: 'drafts',
  active: 'active',
  upcoming: 'scheduled',
  ended: 'ended',
};

const tagOf: Record<StaffAnnouncementStatus, TagKind> = {
  draft: 'draft',
  active: 'active',
  upcoming: 'scheduled',
  ended: 'ended',
};

const isTab = (value: string | null): value is Tab => tabs.some((tab) => tab === value);
const isSort = (value: string | null): value is Sort => sorts.some((sort) => sort === value);
const isType = (value: string | null): value is AnnouncementType =>
  types.some((type) => type === value);

const queryDefaults = { status: 'all', type: 'all', area: 'all', sort: 'newest' };
const cell = 'px-4 py-3 align-middle type-body-s text-gray-700';

type AnnouncementsPageProps = {
  base: readonly StaffAnnouncement[];
  areas: readonly { id: string; label: string }[];
};

function dateText(value: string): string {
  return value ? formatDate(value) : adminCopy.content.noDate;
}

/** Traffic announcements (Figma 116:4985): tabs, filters, the list and the banner switches. */
export function AnnouncementsPage({ base, areas }: AnnouncementsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useQueryParams(queryDefaults);
  const records = useStaffRecords(announcementStore, base);
  const [toDelete, setToDelete] = useState<StaffAnnouncement | null>(null);

  const rawStatus = searchParams.get('status');
  const rawSort = searchParams.get('sort');
  const rawType = searchParams.get('type');
  const status: Tab = isTab(rawStatus) ? rawStatus : 'all';
  const sort: Sort = isSort(rawSort) ? rawSort : 'newest';
  const type = isType(rawType) ? rawType : 'all';
  const area = searchParams.get('area') ?? 'all';
  const query = searchParams.get('q') ?? '';

  const withoutStatus = useMemo(() => {
    const text = query.trim().toLowerCase();
    return records.filter(
      (item) =>
        (text === '' ||
          `${item.title} ${item.location} ${item.road}`.toLowerCase().includes(text)) &&
        (type === 'all' || item.type === type) &&
        (area === 'all' || item.areaIds.some((id) => id === area)),
    );
  }, [records, query, type, area]);

  const counts: Record<Tab, number> = {
    all: withoutStatus.length,
    active: 0,
    scheduled: 0,
    ended: 0,
    drafts: 0,
  };
  for (const item of withoutStatus) counts[tabOf[item.status]] += 1;

  const matching = withoutStatus
    .filter((item) => status === 'all' || tabOf[item.status] === status)
    .toSorted((a, b) => {
      // Drafts have no start date yet: they sit first, then the dated announcements.
      const aDated = a.startDate !== '';
      const bDated = b.startDate !== '';
      if (aDated !== bDated) return aDated ? 1 : -1;
      if (!aDated) return 0;
      return sort === 'newest'
        ? b.startDate.localeCompare(a.startDate)
        : a.startDate.localeCompare(b.startDate);
    });

  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const requested = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Math.min(pageCount, Math.max(1, Number.isNaN(requested) ? 1 : requested));
  const first = (page - 1) * PAGE_SIZE;
  const pageItems = matching.slice(first, first + PAGE_SIZE);
  const filtered = query !== '' || type !== 'all' || area !== 'all' || status !== 'all';

  function change(partial: Parameters<typeof params.set>[0]) {
    params.set({ ...partial, page: null });
  }

  function hrefFor(target: number): string {
    const next = new URLSearchParams(searchParams.toString());
    if (target <= 1) next.delete('page');
    else next.set('page', String(target));
    const text = next.toString();
    return `${pathname}${text ? `?${text}` : ''}`;
  }

  const bannerSwitch = (item: StaffAnnouncement) => (
    <Switch
      label={copy.table.banner(item.title)}
      hideLabel
      checked={item.showBanner}
      disabled={item.status === 'draft'}
      onCheckedChange={(checked) => announcementStore.upsert({ ...item, showBanner: checked })}
      className="relative z-10 min-h-0"
    />
  );

  const menu = (item: StaffAnnouncement) => (
    <RowMenu
      title={item.title}
      editHref={routes.admin.announcementEdit(item.id)}
      onDelete={() => setToDelete(item)}
    />
  );

  return (
    <DeveloperOnly>
      <div className="flex flex-col gap-6">
        <AdminPageHead
          title={copy.title}
          intro={copy.intro}
          action={
            <ButtonLink href={routes.admin.announcementNew}>{copy.newAnnouncement}</ButtonLink>
          }
        />

        <Tabs
          value={status}
          onValueChange={(value) => {
            if (isTab(value)) change({ status: value });
          }}
        >
          <TabsList aria-label={copy.tabsLabel}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} count={counts[tab]}>
                {copy.tabs[tab]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            role="group"
            aria-label={copy.toolbarLabel}
            className="flex flex-wrap items-center gap-2.5"
          >
            <SearchInput
              aria-label={copy.searchLabel}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => change({ q: event.target.value })}
              onClear={() => change({ q: null })}
              className="w-full md:w-80"
            />
            <ChipSelect
              label={copy.filters.type.name}
              prefix={copy.filters.type.name}
              value={type}
              onValueChange={(value) => change({ type: value })}
              options={[
                { value: 'all', label: copy.filters.type.all },
                ...types.map((value) => ({ value, label: copy.types[value] })),
              ]}
            />
            <ChipSelect
              label={copy.filters.area.name}
              prefix={copy.filters.area.name}
              value={area}
              onValueChange={(value) => change({ area: value })}
              options={[
                { value: 'all', label: copy.filters.area.all },
                ...areas.map((entry) => ({ value: entry.id, label: entry.label })),
              ]}
            />
            <div className="hidden flex-1 md:block" />
            <ChipSelect
              label={copy.filters.sort.name}
              icon={<ArrowDownUp className="size-4" />}
              value={sort}
              onValueChange={(value) => change({ sort: value })}
              options={sorts.map((value) => ({ value, label: copy.filters.sort.options[value] }))}
            />
          </div>

          <TabsContent value={status}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
              {pageItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                  <p className="type-heading-3xs text-gray-900">{copy.empty.title}</p>
                  <p className="max-w-md type-body-s text-gray-600">{copy.empty.body}</p>
                  {filtered ? (
                    <Button variant="secondary" onClick={() => router.replace(pathname)}>
                      {copy.empty.clear}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <>
                  <table className="hidden w-full xl:table">
                    <caption className="sr-only">{copy.table.label}</caption>
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        {(
                          ['announcement', 'start', 'end', 'duration', 'status', 'banner'] as const
                        ).map((column) => (
                          <th
                            key={column}
                            scope="col"
                            className="px-4 py-2.5 text-left type-body-xs-semibold text-gray-600"
                          >
                            {copy.table.columns[column]}
                          </th>
                        ))}
                        <th scope="col" className="w-14">
                          <span className="sr-only">{adminCopy.content.rowMenu.edit}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((item) => (
                        <tr
                          key={item.id}
                          className="relative border-b border-gray-200 transition-colors duration-(--duration-fast) hover:bg-primary-50"
                        >
                          <td className="px-4 py-3 align-middle">
                            <Link
                              href={routes.admin.announcementEdit(item.id)}
                              className="type-body-s-medium text-gray-900 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                            >
                              {item.title}
                            </Link>
                            <p className="type-body-xs text-gray-500">{item.location}</p>
                          </td>
                          <td className={cn(cell, 'whitespace-nowrap')}>
                            {dateText(item.startDate)}
                          </td>
                          <td className={cn(cell, 'whitespace-nowrap')}>
                            {dateText(item.endDate)}
                          </td>
                          <td className={cn(cell, 'whitespace-nowrap')}>
                            {item.duration || adminCopy.content.noDate}
                          </td>
                          <td className={cell}>
                            <Tag kind={tagOf[item.status]} />
                          </td>
                          <td className={cell}>{bannerSwitch(item)}</td>
                          <td className="pr-4">{menu(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ul aria-label={copy.table.label} className="flex flex-col xl:hidden">
                    {pageItems.map((item) => (
                      <li
                        key={item.id}
                        className="relative flex flex-col gap-3 border-b border-gray-200 p-4 transition-colors duration-(--duration-fast) hover:bg-primary-50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <Link
                              href={routes.admin.announcementEdit(item.id)}
                              className="type-body-s-medium text-gray-900 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                            >
                              {item.title}
                            </Link>
                            <p className="type-body-xs text-gray-500">{item.location}</p>
                          </div>
                          <Tag kind={tagOf[item.status]} />
                          {menu(item)}
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
                          <div className="flex flex-col gap-0.5">
                            <dt className="type-body-xs text-gray-500">
                              {copy.table.columns.start}
                            </dt>
                            <dd className="type-body-s text-gray-700">
                              {dateText(item.startDate)}
                            </dd>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <dt className="type-body-xs text-gray-500">{copy.table.columns.end}</dt>
                            <dd className="type-body-s text-gray-700">{dateText(item.endDate)}</dd>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <dt className="type-body-xs text-gray-500">
                              {copy.table.columns.duration}
                            </dt>
                            <dd className="type-body-s text-gray-700">
                              {item.duration || adminCopy.content.noDate}
                            </dd>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <dt className="type-body-xs text-gray-500">
                              {copy.table.columns.banner}
                            </dt>
                            <dd>{bannerSwitch(item)}</dd>
                          </div>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {matching.length > 0 ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                  <p className="min-w-0 flex-1 basis-60 type-body-s text-gray-600">
                    {copy.showing(first + 1, first + pageItems.length, matching.length)}{' '}
                    {copy.endedNote}
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
          if (toDelete) announcementStore.remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </DeveloperOnly>
  );
}
