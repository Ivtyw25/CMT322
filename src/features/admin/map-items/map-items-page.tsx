'use client';

import {
  Ban,
  MapPin,
  MousePointer2,
  Plus,
  TrafficCone,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { LocationMap, type MapMarker, type MapPoint } from '@/components/patterns/map/location-map';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { Switch } from '@/components/ui/switch';
import { Tag } from '@/components/ui/tag';
import { TextInput } from '@/components/ui/text-input';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { MapItemKind, StaffAnnouncement } from '@/data/models/staff-content';
import {
  announcementStore,
  durationLabel,
  fullEndDate,
  isNightly,
  kindOfType,
  statusFromDates,
  typeOfKind,
} from '@/features/admin/announcements/announcement-store';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { useReverseGeocode } from '@/lib/geo/use-reverse-geocode';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { useStaffSession } from '@/lib/staff-session';
import { PlacingCard } from './placing-card';

const copy = adminCopy.mapItems;
const kinds = ['closure', 'worksite', 'hazard'] as const satisfies readonly MapItemKind[];
const tagOf = { draft: 'draft', upcoming: 'scheduled', ended: 'ended', active: 'active' } as const;
type KindFilter = 'all' | MapItemKind;

const iconOf: Record<MapItemKind, LucideIcon> = {
  closure: Ban,
  worksite: TrafficCone,
  hazard: TriangleAlert,
};
const iconTone: Record<MapItemKind, string> = {
  closure: 'text-danger-600',
  worksite: 'text-warning-600',
  hazard: 'text-warning-600',
};
const variantOf = { closure: 'closure', worksite: 'zone', hazard: 'hazard' } as const;

const kindChoices: readonly SegmentedOption<MapItemKind>[] = kinds.map((kind) => ({
  value: kind,
  label: copy.kinds[kind],
}));

type MapItemsPageProps = {
  /** Every announcement: each one owns a map item. */
  base: readonly StaffAnnouncement[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
  /** The mock "now" as an ISO date-time. */
  now: string;
  center: { lat: number; lng: number };
};

type Tool = 'select' | 'pin';

/** A new map item being placed: its type, the pin (null until placed) and the road found for it. */
type Placing = { kind: MapItemKind; point: MapPoint | null; road: string };

const nameOf = (item: StaffAnnouncement) => item.mapName || item.title;

/**
 * The map items editor (Figma 117:5034): the list, the traffic map and the edit card. A map item is
 * part of its announcement, so every change here is saved onto the announcement.
 */
export function MapItemsPage({ base, today, now, center }: MapItemsPageProps) {
  const router = useRouter();
  const { staff } = useStaffSession();
  const items = useStaffRecords(announcementStore, base);
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [form, setForm] = useState<StaffAnnouncement | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [focusKey, setFocusKey] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    start?: string;
    end?: string;
    range?: string;
  }>({});
  const [message, setMessage] = useState('');
  const [placing, setPlacing] = useState<Placing | null>(null);
  const roadLookup = useReverseGeocode(
    useCallback(
      (road: string) => setPlacing((current) => (current ? { ...current, road } : current)),
      [],
    ),
  );
  const { lookup: findRoad, cancel: cancelRoadLookup } = roadLookup;

  const counts = {
    all: items.length,
    closure: items.filter((item) => item.type === 'closure').length,
    worksite: items.filter((item) => item.type === 'construction').length,
    hazard: items.filter((item) => item.type === 'hazard').length,
  };

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (kindFilter === 'all' || kindOfType[item.type] === kindFilter) &&
        (text === '' || `${nameOf(item)} ${item.road}`.toLowerCase().includes(text)),
    );
  }, [items, kindFilter, query]);

  const markers: MapMarker[] = [
    ...shown.filter((item) => item.id !== form?.id),
    ...(form ? [form] : []),
  ].map((item) => ({
    id: item.id,
    lat: item.lat,
    lng: item.lng,
    label: nameOf(item),
    variant: variantOf[kindOfType[item.type]],
  }));
  const fitPoints = useMemo(() => items.map((item) => ({ lat: item.lat, lng: item.lng })), [items]);

  function startPlacing() {
    close();
    setMessage('');
    setPlacing({ kind: 'closure', point: null, road: '' });
  }

  function stopPlacing() {
    cancelRoadLookup();
    setPlacing(null);
  }

  function placePin(point: MapPoint) {
    setPlacing((current) => (current ? { ...current, point, road: '' } : current));
    findRoad(point);
  }

  function continueToAnnouncement() {
    if (!placing?.point) return;
    router.push(
      routes.admin.announcementNewAt({
        type: typeOfKind[placing.kind],
        lat: placing.point.lat,
        lng: placing.point.lng,
        road: placing.road,
      }),
    );
  }

  function select(item: StaffAnnouncement) {
    stopPlacing();
    setForm({ ...item, mapName: nameOf(item) });
    setErrors({});
    setMessage('');
    setFocusKey((key) => key + 1);
  }

  function close() {
    setForm(null);
    setTool('select');
    setErrors({});
  }

  function update(partial: Partial<StaffAnnouncement>) {
    setForm((current) => (current ? { ...current, ...partial } : current));
    setMessage('');
  }

  function save() {
    if (!form) return;
    const isDraft = form.status === 'draft';
    const found: typeof errors = {};
    if (nameOf(form).trim() === '') found.name = copy.edit.errors.name;
    if (!isDraft && form.startDate === '') found.start = adminCopy.announcementEditor.errors.start;
    if (!isDraft && form.type !== 'hazard' && form.endDate === '') {
      found.end = adminCopy.announcementEditor.errors.end;
    }
    if (form.startDate && form.endDate && fullEndDate(form.endDate) < form.startDate) {
      found.range = copy.edit.errors.range;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const status = isDraft ? 'draft' : statusFromDates(form.startDate, form.endDate, today);
    const saved: StaffAnnouncement = {
      ...form,
      mapName: form.mapName.trim(),
      status,
      showOnMap: isDraft ? false : form.showOnMap,
      duration: isDraft
        ? form.duration
        : durationLabel(form.startDate, form.endDate, isNightly(form)),
      history: [
        ...form.history,
        { id: `h${form.history.length + 1}`, at: now, action: 'updated', by: staff?.name ?? '' },
      ],
    };
    announcementStore.upsert(saved);
    setForm(saved);
    setMessage(copy.edit.saved);
  }

  const selected = form !== null;
  const placingCard = placing ? (
    <PlacingCard
      kind={placing.kind}
      kindChoices={kindChoices}
      placed={placing.point !== null}
      road={placing.road}
      lookup={roadLookup.status}
      onKindChange={(kind) => setPlacing((current) => (current ? { ...current, kind } : current))}
      onContinue={continueToAnnouncement}
      onCancel={stopPlacing}
    />
  ) : null;
  const editCard = form ? (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-gray-200 bg-surface p-5 shadow-panel lg:w-85">
      <div className="flex items-center gap-2">
        <h2 className="min-w-0 flex-1 type-heading-3xs text-gray-900">{copy.edit.title}</h2>
        <button
          type="button"
          onClick={close}
          aria-label={copy.edit.close}
          className="hit-area flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors duration-(--duration-fast) hover:text-gray-900"
        >
          <X aria-hidden className="size-4.5" />
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        <p aria-hidden className="type-body-s-medium text-gray-900">
          {copy.edit.type}
        </p>
        <SegmentedControl
          legend={copy.edit.type}
          options={kindChoices}
          value={kindOfType[form.type]}
          fullWidth
          onValueChange={(kind) => update({ type: typeOfKind[kind] })}
        />
      </div>
      <Field label={copy.edit.name} error={errors.name}>
        <TextInput
          value={form.mapName}
          onChange={(event) => update({ mapName: event.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label={copy.edit.from} error={errors.start}>
          <TextInput
            type="date"
            value={form.startDate}
            onChange={(event) => update({ startDate: event.target.value })}
          />
        </Field>
        <Field
          label={copy.edit.to}
          hint={form.type === 'hazard' ? copy.edit.toHint : undefined}
          error={errors.end ?? errors.range}
        >
          <TextInput
            type="date"
            value={fullEndDate(form.endDate)}
            onChange={(event) => update({ endDate: event.target.value })}
          />
        </Field>
      </div>
      <div className="flex flex-col gap-1">
        <p className="type-body-s-medium text-gray-900">{copy.edit.announcement}</p>
        <Link
          href={routes.admin.announcementEdit(form.id)}
          className="hit-area type-body-s text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
        >
          {form.title}
        </Link>
      </div>
      <Switch
        label={copy.edit.visible}
        description={
          form.status === 'draft'
            ? copy.edit.visibleDraft
            : form.startDate
              ? copy.edit.visibleFrom(formatDate(form.startDate))
              : copy.edit.visibleNoDate
        }
        disabled={form.status === 'draft'}
        checked={form.showOnMap}
        onCheckedChange={(showOnMap) => update({ showOnMap })}
      />
      <p className="type-body-xs text-gray-500">{copy.edit.deleteNote}</p>
      <Button onClick={save}>{copy.edit.save}</Button>
      <p role="status" className="type-body-s text-success-700 empty:hidden">
        {message}
      </p>
    </div>
  ) : null;

  const sideCard = placingCard ?? editCard;

  const toolButton = (
    id: string,
    label: string,
    Icon: LucideIcon,
    active: boolean,
    onClick: () => void,
    disabled = false,
  ) => (
    <button
      key={id}
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'hit-area flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors duration-(--duration-fast)',
        'disabled:cursor-not-allowed disabled:text-gray-400',
        active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon aria-hidden className="size-4.5" />
    </button>
  );

  return (
    <DeveloperOnly>
      <div className="-mx-5 -my-6 flex flex-col bg-gray-50 md:-mx-8 md:-my-7 lg:h-[calc(100dvh-4rem)] lg:flex-row">
        <section
          aria-labelledby="map-items-heading"
          className="flex min-h-0 flex-col border-b border-gray-200 bg-surface lg:w-85 lg:shrink-0 lg:border-r lg:border-b-0"
        >
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <h1 id="map-items-heading" className="min-w-0 flex-1 type-heading-xs text-gray-900">
                {copy.title}
              </h1>
              <Button
                onClick={startPlacing}
                disabled={placing !== null}
                icon={<Plus aria-hidden className="size-4" />}
              >
                {copy.add}
              </Button>
            </div>
            <p className="type-body-s text-gray-600">{copy.intro}</p>
            <SearchInput
              aria-label={copy.searchLabel}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery('')}
            />
            <div role="group" aria-label={copy.filterLabel} className="flex flex-wrap gap-1.5">
              {(['all', ...kinds] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={kindFilter === value}
                  onClick={() => setKindFilter(value)}
                  className={cn(
                    'hit-area cursor-pointer rounded-full border px-2.5 py-1 type-body-xs-medium transition-colors duration-(--duration-fast)',
                    kindFilter === value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-surface text-gray-700 hover:border-gray-400',
                  )}
                >
                  {copy.filters[value](counts[value])}
                </button>
              ))}
            </div>
          </div>
          {shown.length === 0 ? (
            <p className="border-t border-gray-200 px-5 py-6 type-body-s text-gray-600">
              {copy.empty}
            </p>
          ) : (
            <ul
              aria-label={copy.listLabel}
              className="max-h-96 overflow-y-auto lg:max-h-none lg:flex-1"
            >
              {shown.map((item) => {
                const kind = kindOfType[item.type];
                const Icon = iconOf[kind];
                const current = form?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={current}
                      onClick={() => select(item)}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-3 border-t border-l-3 border-gray-200 px-5 py-3 text-left transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2',
                        current ? 'border-l-primary-600 bg-primary-50' : 'border-l-transparent',
                      )}
                    >
                      <Icon aria-hidden className={cn('size-4.5 shrink-0', iconTone[kind])} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="type-body-s-medium text-gray-900">{nameOf(item)}</span>
                        <span className="type-body-xs text-gray-500">
                          {copy.itemMeta(
                            copy.kinds[kind],
                            item.type === 'hazard' && item.endDate === '',
                          )}
                        </span>
                      </span>
                      <Tag kind={tagOf[item.status]} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="relative flex min-h-0 flex-1 flex-col gap-4 p-5 lg:block lg:p-0">
          <div className="relative h-96 lg:h-full">
            <LocationMap
              className="size-full rounded-2xl lg:rounded-none lg:border-0"
              center={center}
              zoom={11}
              label={copy.map.label}
              centreLabel={copy.map.centreLabel}
              interaction="full"
              markers={markers}
              selectedId={form?.id ?? null}
              focusId={form?.id ?? null}
              focusKey={focusKey}
              onSelect={(id) => {
                const picked = items.find((item) => item.id === id);
                if (picked) select(picked);
              }}
              fitPoints={fitPoints}
              fitKey={1}
              resetBounds={fitPoints}
              pin={
                placing
                  ? {
                      point: placing.point,
                      onChange: placePin,
                      label: () => copy.placing.pinLabel(copy.kinds[placing.kind]),
                      dropLabel: copy.map.dropLabel,
                    }
                  : tool === 'pin' && form
                    ? {
                        point: { lat: form.lat, lng: form.lng },
                        onChange: (point) => update(point),
                        label: () => copy.map.pinLabel(nameOf(form)),
                        dropLabel: copy.map.dropLabel,
                      }
                    : undefined
              }
            />
            <div
              role="toolbar"
              aria-label={copy.tools.label}
              className="absolute top-4 left-4 z-10 flex flex-col gap-1 rounded-xl border border-gray-200 bg-surface p-1.5 shadow-panel"
            >
              {toolButton('select', copy.tools.select, MousePointer2, tool === 'select', () =>
                setTool('select'),
              )}
              {toolButton(
                'pin',
                copy.tools.pin,
                MapPin,
                tool === 'pin',
                () => setTool('pin'),
                !selected,
              )}
            </div>
            <p className="pointer-events-none absolute top-4 left-18 z-10 hidden max-w-[calc(100%-5rem)] rounded-lg bg-gray-900 px-3 py-2 type-body-xs-medium text-static-white md:block">
              {placing
                ? copy.placing.hint
                : tool === 'pin'
                  ? copy.tools.pinHint
                  : copy.tools.selectHint}
            </p>
            <ul
              aria-label={copy.legend.label}
              className="absolute bottom-6 left-4 z-10 flex flex-wrap gap-3.5 rounded-lg border border-gray-200 bg-surface px-3 py-2"
            >
              {kinds.map((kind) => (
                <li
                  key={kind}
                  className="flex items-center gap-1.5 type-body-xs-medium text-gray-700"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-2.5 rounded-full',
                      kind === 'closure' ? 'bg-danger-600' : 'bg-warning-600',
                    )}
                  />
                  {copy.legend[kind]}
                </li>
              ))}
            </ul>
          </div>
          {sideCard ? (
            <div className="lg:absolute lg:top-4 lg:right-4 lg:z-20 lg:max-h-[calc(100%-2rem)] lg:overflow-y-auto">
              {sideCard}
            </div>
          ) : null}
        </div>
      </div>
    </DeveloperOnly>
  );
}
