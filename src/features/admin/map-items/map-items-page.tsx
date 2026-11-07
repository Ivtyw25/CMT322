'use client';

import {
  Ban,
  MapPin,
  MousePointer2,
  Plus,
  Trash2,
  TrafficCone,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { LocationMap, type MapMarker } from '@/components/patterns/map/location-map';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { Switch } from '@/components/ui/switch';
import { Tag } from '@/components/ui/tag';
import { TextInput } from '@/components/ui/text-input';
import { adminCopy } from '@/content/admin';
import type { MapItemKind, StaffMapItem } from '@/data/models/staff-content';
import { statusFromDates } from '@/features/admin/announcements/announcement-store';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { mapItemStore } from './map-item-store';

const copy = adminCopy.mapItems;
const NO_LINK = 'none';
const kinds = ['closure', 'worksite', 'hazard'] as const satisfies readonly MapItemKind[];
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
  base: readonly StaffMapItem[];
  announcements: readonly { id: string; title: string }[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
  center: { lat: number; lng: number };
};

type Tool = 'select' | 'pin';

/** The map items editor (Figma 117:5034): the list, the traffic map and the edit card. */
export function MapItemsPage({ base, announcements, today, center }: MapItemsPageProps) {
  const items = useStaffRecords(mapItemStore, base);
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [form, setForm] = useState<StaffMapItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [tool, setTool] = useState<Tool>('select');
  const [focusKey, setFocusKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; range?: string }>({});
  const [message, setMessage] = useState('');

  const counts = {
    all: items.length,
    closure: items.filter((item) => item.kind === 'closure').length,
    worksite: items.filter((item) => item.kind === 'worksite').length,
    hazard: items.filter((item) => item.kind === 'hazard').length,
  };

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (kindFilter === 'all' || item.kind === kindFilter) &&
        (text === '' || item.name.toLowerCase().includes(text)),
    );
  }, [items, kindFilter, query]);

  const markers: MapMarker[] = [
    ...shown.filter((item) => item.id !== form?.id),
    ...(form ? [form] : []),
  ].map((item) => ({
    id: item.id,
    lat: item.lat,
    lng: item.lng,
    label: item.name || copy.newName,
    variant: variantOf[item.kind],
  }));
  const fitPoints = useMemo(() => items.map((item) => ({ lat: item.lat, lng: item.lng })), [items]);

  function select(item: StaffMapItem) {
    setForm(item);
    setIsNewItem(false);
    setErrors({});
    setMessage('');
    setFocusKey((key) => key + 1);
  }

  function startNew() {
    setForm({
      id: `map-item-${Date.now()}`,
      kind: 'closure',
      name: '',
      status: 'upcoming',
      lat: center.lat,
      lng: center.lng,
      from: today,
      to: '',
      announcementId: null,
      visible: false,
    });
    setIsNewItem(true);
    setErrors({});
    setMessage('');
    setTool('pin');
  }

  function close() {
    setForm(null);
    setTool('select');
    setErrors({});
  }

  function update(partial: Partial<StaffMapItem>) {
    setForm((current) => (current ? { ...current, ...partial } : current));
    setMessage('');
  }

  function save() {
    if (!form) return;
    const found: typeof errors = {};
    if (form.name.trim() === '') found.name = copy.edit.errors.name;
    if (form.from && form.to && form.to < form.from) found.range = copy.edit.errors.range;
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const status = form.from
      ? statusFromDates(form.from, form.to || '9999-12-31', today)
      : 'active';
    mapItemStore.upsert({ ...form, name: form.name.trim(), status });
    setIsNewItem(false);
    setMessage(copy.edit.saved);
  }

  const selected = form !== null;
  const editCard = form ? (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-gray-200 bg-surface p-5 shadow-panel lg:w-85">
      <div className="flex items-center gap-2">
        <h2 className="min-w-0 flex-1 type-heading-3xs text-gray-900">
          {isNewItem ? copy.edit.newTitle : copy.edit.title}
        </h2>
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
          value={form.kind}
          fullWidth
          onValueChange={(kind) => update({ kind })}
        />
      </div>
      <Field label={copy.edit.name} error={errors.name}>
        <TextInput value={form.name} onChange={(event) => update({ name: event.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label={copy.edit.from}>
          <TextInput
            type="date"
            value={form.from}
            onChange={(event) => update({ from: event.target.value })}
          />
        </Field>
        <Field label={copy.edit.to} hint={copy.edit.toHint} error={errors.range}>
          <TextInput
            type="date"
            value={form.to}
            onChange={(event) => update({ to: event.target.value })}
          />
        </Field>
      </div>
      <Field label={copy.edit.linked}>
        <MenuSelect
          value={form.announcementId ?? NO_LINK}
          onValueChange={(value) => update({ announcementId: value === NO_LINK ? null : value })}
          options={[
            { value: NO_LINK, label: copy.edit.noLinked },
            ...announcements.map((entry) => ({ value: entry.id, label: entry.title })),
          ]}
        />
      </Field>
      <Switch
        label={copy.edit.visible}
        description={
          form.from ? copy.edit.visibleFrom(formatDate(form.from)) : copy.edit.visibleNoDate
        }
        checked={form.visible}
        onCheckedChange={(visible) => update({ visible })}
      />
      <div className="flex items-center gap-2.5">
        {isNewItem ? null : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="hit-area flex cursor-pointer items-center gap-1.5 type-body-s-medium text-danger-700 transition-colors duration-(--duration-fast) hover:text-danger-600"
          >
            <Trash2 aria-hidden className="size-4" />
            {copy.edit.delete}
          </button>
        )}
        <div className="flex-1" />
        <Button onClick={save}>{isNewItem ? copy.edit.create : copy.edit.save}</Button>
      </div>
      <p role="status" className="type-body-s text-success-700 empty:hidden">
        {message}
      </p>
    </div>
  ) : null;

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
              <Button icon={<Plus aria-hidden className="size-4" />} onClick={startNew}>
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
                const Icon = iconOf[item.kind];
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
                      <Icon aria-hidden className={cn('size-4.5 shrink-0', iconTone[item.kind])} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="type-body-s-medium text-gray-900">{item.name}</span>
                        <span className="type-body-xs text-gray-500">
                          {copy.itemMeta(
                            copy.kinds[item.kind],
                            item.kind === 'hazard' && item.to === '',
                          )}
                        </span>
                      </span>
                      <Tag
                        kind={
                          item.status === 'upcoming'
                            ? 'scheduled'
                            : item.status === 'ended'
                              ? 'ended'
                              : 'active'
                        }
                      />
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
                tool === 'pin' && form
                  ? {
                      point: { lat: form.lat, lng: form.lng },
                      onChange: (point) => update(point),
                      label: () => copy.map.pinLabel(form.name || copy.newName),
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
              {toolButton(
                'remove',
                copy.tools.remove,
                Trash2,
                false,
                () => setConfirmDelete(true),
                !selected || isNewItem,
              )}
            </div>
            <p className="pointer-events-none absolute top-4 left-18 z-10 hidden max-w-[calc(100%-5rem)] rounded-lg bg-gray-900 px-3 py-2 type-body-xs-medium text-static-white md:block">
              {tool === 'pin' ? copy.tools.pinHint : copy.tools.selectHint}
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
          {editCard ? (
            <div className="lg:absolute lg:top-4 lg:right-4 lg:z-20 lg:max-h-[calc(100%-2rem)] lg:overflow-y-auto">
              {editCard}
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={adminCopy.content.confirmDelete.title(form?.name || copy.newName)}
        body={adminCopy.content.confirmDelete.body}
        confirm={adminCopy.content.confirmDelete.confirm}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (form && !isNewItem) mapItemStore.remove(form.id);
          setConfirmDelete(false);
          close();
        }}
      />
    </DeveloperOnly>
  );
}
