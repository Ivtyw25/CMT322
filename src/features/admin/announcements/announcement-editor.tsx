'use client';

import { ChevronLeft, FileText, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { LocationMap } from '@/components/patterns/map/location-map';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TextInput } from '@/components/ui/text-input';
import { announcementPlaceParams, routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { AnnouncementType } from '@/data/models/announcement';
import type { AreaId } from '@/data/models/area';
import type { StationCode } from '@/data/models/station';
import type { StaffAnnouncement, StaffHistoryEntry } from '@/data/models/staff-content';
import { AdminPanel } from '@/features/admin/panel';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { historyText } from '@/features/admin/history-text';
import { AdminPageHead } from '@/features/admin/page-head';
import { formatDate } from '@/lib/format/dates';
import { formatFullDateTime } from '@/lib/format/date-time';
import { slugify } from '@/lib/format/slug';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { useStaffSession } from '@/lib/staff-session';
import {
  announcementStore,
  durationLabel,
  fullEndDate,
  isNightly,
  kindOfType,
  NIGHT_HOURS,
  statusFromDates,
} from './announcement-store';

const copy = adminCopy.announcementEditor;
const NEW_ID = 'new';
const BYTES_PER_KB = 1024;

type AreaOption = { id: AreaId; label: string };
type StationOption = { code: StationCode; name: string; areaId: AreaId };

type AnnouncementEditorProps = {
  /** The route's ID, or "new". */
  id: string;
  base: readonly StaffAnnouncement[];
  areas: readonly AreaOption[];
  stations: readonly StationOption[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
  /** The mock "now" as an ISO date-time. */
  now: string;
  /** Where a new announcement's pin starts. */
  center: { lat: number; lng: number };
};

type Errors = Partial<Record<'title' | 'summary' | 'start' | 'end' | 'road', string>>;
type SaveMode = 'draft' | 'publish';

const typeOptions = (['closure', 'construction', 'hazard'] as const).map((type) => ({
  value: type,
  label: copy.typeOptions[type],
}));

function isAnnouncementType(value: string): value is AnnouncementType {
  return value === 'closure' || value === 'construction' || value === 'hazard';
}

type Place = { type: AnnouncementType; lat: number; lng: number; road: string };

/** The starting place a new announcement gets from the Map items page, read from the query. */
function placeOf(params: URLSearchParams): Place | null {
  const type = params.get(announcementPlaceParams.type) ?? '';
  const lat = Number(params.get(announcementPlaceParams.lat));
  const lng = Number(params.get(announcementPlaceParams.lng));
  if (!isAnnouncementType(type) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { type, lat, lng, road: params.get(announcementPlaceParams.road) ?? '' };
}

function blankAnnouncement(
  areas: readonly AreaOption[],
  center: { lat: number; lng: number },
  place: Place | null,
): StaffAnnouncement {
  return {
    id: NEW_ID,
    type: place?.type ?? 'closure',
    status: 'draft',
    title: '',
    summary: '',
    brief: '',
    location: place?.road ?? '',
    road: '',
    lat: place?.lat ?? center.lat,
    lng: place?.lng ?? center.lng,
    areaIds: areas[0] ? [areas[0].id] : [],
    stationCodes: [],
    startDate: '',
    endDate: '',
    dailyHours: null,
    duration: '',
    detour: [],
    publishedAt: '',
    showBanner: false,
    emailFollowers: false,
    mapName: '',
    showOnMap: false,
    notice: null,
    history: [],
  };
}

/** The first few words of the summary, for small cards that show a short line. */
function briefOf(summary: string): string {
  return summary.trim().split(/\s+/).slice(0, 6).join(' ');
}

/** Announcement editor (Figma 116:5269): details, dates, place, notice and publishing. */
export function AnnouncementEditor({
  id,
  base,
  areas,
  stations,
  today,
  now,
  center,
}: AnnouncementEditorProps) {
  const router = useRouter();
  const { staff } = useStaffSession();
  const records = useStaffRecords(announcementStore, base);
  const params = useSearchParams();
  const existing = records.find((record) => record.id === id) ?? null;
  const isNew = id === NEW_ID;

  return (
    <DeveloperOnly>
      {isNew || existing ? (
        <EditorForm
          key={id}
          record={existing ?? blankAnnouncement(areas, center, placeOf(params))}
          isNew={isNew}
          areas={areas}
          stations={stations}
          today={today}
          now={now}
          staffName={staff?.name ?? ''}
          onSaved={(savedId) => {
            if (isNew) router.replace(routes.admin.announcementEdit(savedId));
          }}
        />
      ) : (
        <div className="max-w-xl flex flex-col items-start gap-3">
          <h1 className="type-heading-s text-gray-900">{adminCopy.content.notFound.title}</h1>
          <p className="type-body-s text-gray-600">{adminCopy.content.notFound.body}</p>
          <ButtonLink href={routes.admin.announcements}>{copy.back}</ButtonLink>
        </div>
      )}
    </DeveloperOnly>
  );
}

type EditorFormProps = {
  record: StaffAnnouncement;
  isNew: boolean;
  areas: readonly AreaOption[];
  stations: readonly StationOption[];
  today: string;
  now: string;
  staffName: string;
  onSaved: (id: string) => void;
};

function EditorForm({
  record,
  isNew,
  areas,
  stations,
  today,
  now,
  staffName,
  onSaved,
}: EditorFormProps) {
  const [draft, setDraft] = useState<StaffAnnouncement>(record);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const [noticeError, setNoticeError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const areaId = draft.areaIds[0] ?? areas[0]?.id ?? '';
  const nightly = isNightly(draft);
  const duration = durationLabel(draft.startDate, draft.endDate, nightly);
  const nearby = stations.filter((station) => station.areaId === areaId);
  const nearbyNames = nearby
    .slice(0, 2)
    .map((station) => `${station.code} ${station.name}`)
    .join(copy.publishing.email.and);

  function change<K extends keyof StaffAnnouncement>(key: K, value: StaffAnnouncement[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setMessage('');
  }

  function validate(mode: SaveMode): Errors {
    const found: Errors = {};
    if (draft.title.trim() === '') found.title = copy.errors.title;
    if (mode === 'draft') return found;
    if (draft.summary.trim() === '') found.summary = copy.errors.summary;
    if (draft.location.trim() === '') found.road = copy.errors.road;
    if (draft.startDate === '') found.start = copy.errors.start;
    if (draft.endDate === '') {
      if (draft.type !== 'hazard') found.end = copy.errors.end;
    } else if (draft.startDate && fullEndDate(draft.endDate) < draft.startDate) {
      found.end = copy.errors.endBeforeStart;
    }
    return found;
  }

  function save(mode: SaveMode) {
    const found = validate(mode);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage(copy.messages.invalid);
      return;
    }
    const savedId = isNew
      ? `${slugify(draft.title) || 'announcement'}-${Date.parse(now)}`
      : draft.id;
    const status =
      mode === 'draft' ? 'draft' : statusFromDates(draft.startDate, draft.endDate, today);
    const action: StaffHistoryEntry['action'] =
      mode === 'draft'
        ? isNew
          ? 'created'
          : 'draft-saved'
        : status === 'upcoming'
          ? 'scheduled'
          : record.status === 'draft'
            ? 'published'
            : 'updated';
    const noticeAdded = draft.notice !== null && draft.notice.fileName !== record.notice?.fileName;
    const entries = [
      ...(noticeAdded
        ? [
            {
              id: `h${draft.history.length + 1}`,
              at: now,
              action: 'notice-uploaded' as const,
              by: staffName,
            },
          ]
        : []),
      {
        id: `h${draft.history.length + 1 + (noticeAdded ? 1 : 0)}`,
        at: now,
        action,
        by: staffName,
      },
    ];
    const road = draft.location.split(',')[0]?.trim() ?? draft.location;
    announcementStore.upsert({
      ...draft,
      id: savedId,
      status,
      road: road || draft.location,
      mapName: draft.mapName.trim() || draft.title.trim(),
      stationCodes: nearby.map((station) => station.code),
      duration:
        mode === 'draft' ? draft.duration : durationLabel(draft.startDate, draft.endDate, nightly),
      brief: draft.brief || briefOf(draft.summary),
      publishedAt: mode === 'draft' ? draft.publishedAt : today,
      showOnMap: mode === 'draft' ? false : draft.showOnMap,
      history: [...draft.history, ...entries],
    });
    setDraft((current) => ({
      ...current,
      id: savedId,
      status,
      history: [...current.history, ...entries],
    }));
    onSaved(savedId);
    setMessage(
      mode === 'draft'
        ? copy.messages.saved
        : status === 'upcoming'
          ? copy.messages.scheduled
          : record.status === 'draft'
            ? copy.messages.published
            : copy.messages.updated,
    );
  }

  function chooseNotice(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setNoticeError(copy.notice.wrongType);
      return;
    }
    if (file.size > copy.notice.maxMegabytes * BYTES_PER_KB * BYTES_PER_KB) {
      setNoticeError(copy.notice.tooBig);
      return;
    }
    setNoticeError('');
    change('notice', {
      fileName: file.name,
      sizeKb: Math.max(1, Math.ceil(file.size / BYTES_PER_KB)),
      uploadedOn: today,
    });
  }

  const saved = record.history.at(-1)?.at;
  const statusLine =
    draft.status === 'draft'
      ? copy.status.draft(saved ? formatFullDateTime(saved) : '')
      : draft.status === 'upcoming'
        ? copy.status.upcoming(formatDate(draft.startDate))
        : copy.status[draft.status];
  const willSchedule = Boolean(draft.startDate) && draft.startDate > today;
  const publishLabel = willSchedule ? copy.schedule : copy.publish;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={routes.admin.announcements}
        className="hit-area flex w-fit items-center gap-1.5 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
      >
        <ChevronLeft aria-hidden className="size-4" />
        {copy.back}
      </Link>

      <AdminPageHead
        title={draft.title.trim() || copy.newTitle}
        intro={statusLine}
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => save('draft')}>
              {copy.saveDraft}
            </Button>
            <Button onClick={() => save('publish')}>{publishLabel}</Button>
          </div>
        }
      />
      <p role="status" className="-mt-4 type-body-s text-gray-700 empty:hidden">
        {message}
      </p>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-1">
          <AdminPanel
            headingId="details-heading"
            title={copy.sections.details}
            className="gap-4 px-6 py-5"
          >
            <Field label={copy.fields.title} error={errors.title}>
              <TextInput
                value={draft.title}
                onChange={(event) => change('title', event.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={copy.fields.type}>
                <MenuSelect
                  value={draft.type}
                  onValueChange={(value) => {
                    if (isAnnouncementType(value)) change('type', value);
                  }}
                  options={typeOptions}
                />
              </Field>
              <Field label={copy.fields.area}>
                <MenuSelect
                  value={areaId}
                  onValueChange={(value) => {
                    const picked = areas.find((area) => area.id === value);
                    if (picked) change('areaIds', [picked.id]);
                  }}
                  options={areas.map((area) => ({ value: area.id, label: area.label }))}
                />
              </Field>
            </div>
            <Field label={copy.fields.summary} error={errors.summary}>
              <Textarea
                rows={4}
                maxCharacters={copy.summaryMax}
                value={draft.summary}
                onChange={(event) => change('summary', event.target.value)}
              />
            </Field>
          </AdminPanel>

          <AdminPanel
            headingId="when-heading"
            title={copy.sections.when}
            className="gap-4 px-6 py-5"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={copy.fields.start} error={errors.start}>
                <TextInput
                  type="date"
                  value={draft.startDate}
                  onChange={(event) => change('startDate', event.target.value)}
                />
              </Field>
              <Field
                label={copy.fields.end}
                hint={draft.type === 'hazard' ? copy.fields.endHint : undefined}
                error={errors.end}
              >
                <TextInput
                  type="date"
                  value={draft.endDate ? fullEndDate(draft.endDate) : ''}
                  onChange={(event) => change('endDate', event.target.value)}
                />
              </Field>
              <div className="flex flex-col gap-1.5">
                <p className="type-body-s-medium text-gray-900">
                  {copy.fields.duration}{' '}
                  <span className="text-gray-500">{copy.fields.calculated}</span>
                </p>
                <p
                  aria-live="polite"
                  className="flex min-h-11 items-center rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 type-body-s text-gray-600 md:min-h-0"
                >
                  {duration}
                </p>
              </div>
            </div>
            <Checkbox
              checked={nightly}
              onChange={(event) =>
                change('dailyHours', event.target.checked ? { ...NIGHT_HOURS } : null)
              }
              label={copy.fields.nightly}
            />
          </AdminPanel>

          <AdminPanel
            headingId="where-heading"
            title={copy.sections.where}
            className="gap-4 px-6 py-5"
          >
            <Field label={copy.fields.road} error={errors.road}>
              <TextInput
                value={draft.location}
                onChange={(event) => change('location', event.target.value)}
                leadingIcon={<MapPin className="size-4" />}
              />
            </Field>
            <Field
              label={copy.fields.mapName}
              hint={copy.fields.mapNameHint(adminCopy.mapItems.kinds[kindOfType[draft.type]])}
            >
              <TextInput
                value={draft.mapName}
                onChange={(event) => change('mapName', event.target.value)}
              />
            </Field>
            <LocationMap
              center={{ lat: draft.lat, lng: draft.lng }}
              zoom={15}
              label={copy.map.label}
              interaction="snippet"
              className="h-72 rounded-xl md:h-100"
              markers={[]}
              pin={{
                point: { lat: draft.lat, lng: draft.lng },
                onChange: (point) => setDraft((current) => ({ ...current, ...point })),
                label: () => copy.map.pinLabel,
                dropLabel: copy.map.dropLabel,
              }}
            />
          </AdminPanel>

          <AdminPanel
            headingId="notice-heading"
            title={copy.sections.notice}
            className="gap-4 px-6 py-5"
          >
            {draft.notice ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3.5 py-3">
                <FileText aria-hidden className="size-5 shrink-0 text-danger-600" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="type-body-s-medium break-all text-gray-900">
                    {draft.notice.fileName}
                  </p>
                  <p className="type-body-xs text-gray-500">
                    {copy.notice.uploaded(draft.notice.sizeKb, formatDate(draft.notice.uploadedOn))}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={copy.notice.remove(draft.notice.fileName)}
                  onClick={() => change('notice', null)}
                  className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors duration-(--duration-fast) hover:text-gray-900"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <Button variant="secondary" onClick={() => fileInput.current?.click()}>
                  {copy.notice.choose}
                </Button>
                <p className="type-body-xs text-gray-500">{copy.notice.rules}</p>
              </div>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={chooseNotice}
            />
            {noticeError ? (
              <p role="alert" className="type-body-s text-danger-700">
                {noticeError}
              </p>
            ) : null}
          </AdminPanel>
        </div>

        <div className="flex flex-col gap-5 xl:w-95 xl:shrink-0">
          <AdminPanel
            headingId="publishing-heading"
            title={copy.publishing.title}
            className="gap-3.5 p-5"
          >
            <Switch
              label={copy.publishing.banner.label}
              description={copy.publishing.banner.hint}
              checked={draft.showBanner}
              onCheckedChange={(checked) => change('showBanner', checked)}
            />
            <Switch
              label={copy.publishing.email.label}
              description={
                nearbyNames ? copy.publishing.email.hint(nearbyNames) : copy.publishing.email.none
              }
              checked={draft.emailFollowers}
              onCheckedChange={(checked) => change('emailFollowers', checked)}
            />
            <Switch
              label={copy.publishing.map.label}
              description={copy.publishing.map.hint}
              checked={draft.showOnMap}
              onCheckedChange={(checked) => change('showOnMap', checked)}
            />
          </AdminPanel>

          <AdminPanel headingId="history-heading" title={copy.history.title} className="gap-2 p-5">
            {draft.history.length === 0 ? (
              <p className="type-body-xs text-gray-600">{copy.history.empty}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {draft.history.toReversed().map((entry) => (
                  <li key={entry.id} className="type-body-xs text-gray-600">
                    {historyText(entry)}
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
