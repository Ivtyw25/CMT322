'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TextInput } from '@/components/ui/text-input';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import { uiCopy } from '@/content/ui';
import type { ConstructionPhase } from '@/data/models/construction-update';
import type { StaffProgressUpdate } from '@/data/models/staff-content';
import type { StationCode } from '@/data/models/station';
import { DeveloperOnly } from '@/features/admin/developer-only';
import { AdminPageHead } from '@/features/admin/page-head';
import { AdminPanel } from '@/features/admin/panel';
import { formatDate } from '@/lib/format/dates';
import { formatFullDateTime } from '@/lib/format/date-time';
import { slugify } from '@/lib/format/slug';
import { useStaffRecords } from '@/lib/staff-records/use-staff-records';
import { useStaffSession } from '@/lib/staff-session';
import { PhotoList } from './photo-list';
import { progressStore, type ProgressStation } from './progress-store';

const copy = adminCopy.progressEditor;
const NEW_ID = 'new';

const phases = [
  'utility-relocation',
  'piling',
  'viaduct',
  'stations',
] as const satisfies readonly ConstructionPhase[];
const phaseOptions = phases.map((phase) => ({
  value: phase,
  label: uiCopy.constructionPhases[phase],
}));
type PublishMode = 'now' | 'later';
const modeOptions = [
  { value: 'now', label: copy.publishModes.now },
  { value: 'later', label: copy.publishModes.later },
] as const;

type Errors = Partial<Record<'title' | 'body' | 'date', string>>;

type ProgressEditorProps = {
  /** The route's ID, or "new". */
  id: string;
  base: readonly StaffProgressUpdate[];
  stations: readonly (ProgressStation & { code: StationCode })[];
  /** Today as "YYYY-MM-DD", the mock day. */
  today: string;
  /** The mock "now" as an ISO date-time. */
  now: string;
};

function isPhase(value: string): value is ConstructionPhase {
  return phases.some((phase) => phase === value);
}

function isMode(value: string): value is PublishMode {
  return value === 'now' || value === 'later';
}

/** Progress update editor (Figma 117:5669): the update, its photos, publishing and the preview. */
export function ProgressEditor({ id, base, stations, today, now }: ProgressEditorProps) {
  const router = useRouter();
  const { staff } = useStaffSession();
  const records = useStaffRecords(progressStore, base);
  const existing = records.find((record) => record.id === id) ?? null;
  const isNew = id === NEW_ID;
  const firstStation = stations[0];

  if (!isNew && !existing) {
    return (
      <DeveloperOnly>
        <div className="max-w-xl flex flex-col items-start gap-3">
          <h1 className="type-heading-s text-gray-900">{adminCopy.content.notFound.title}</h1>
          <p className="type-body-s text-gray-600">{adminCopy.content.notFound.body}</p>
          <ButtonLink href={routes.admin.progress}>{copy.back}</ButtonLink>
        </div>
      </DeveloperOnly>
    );
  }

  const blank: StaffProgressUpdate = {
    id: NEW_ID,
    title: '',
    stationCode: firstStation?.code ?? 'S20',
    phase: 'viaduct',
    body: '',
    state: 'draft',
    author: staff?.name ?? '',
    date: '',
    photos: [],
    stationProgress: null,
    emailFollowers: false,
    showOnHome: true,
    savedAt: '',
  };

  return (
    <DeveloperOnly>
      <EditorForm
        key={id}
        record={existing ?? blank}
        isNew={isNew}
        stations={stations}
        today={today}
        now={now}
        staffName={staff?.name ?? ''}
        onSaved={(savedId) => {
          if (isNew) router.replace(routes.admin.progressEditor(savedId));
        }}
      />
    </DeveloperOnly>
  );
}

type EditorFormProps = {
  record: StaffProgressUpdate;
  isNew: boolean;
  stations: ProgressEditorProps['stations'];
  today: string;
  now: string;
  staffName: string;
  onSaved: (id: string) => void;
};

function EditorForm({ record, isNew, stations, today, now, staffName, onSaved }: EditorFormProps) {
  const [draft, setDraft] = useState<StaffProgressUpdate>(record);
  const [mode, setMode] = useState<PublishMode>(record.state === 'scheduled' ? 'later' : 'now');
  const [errors, setErrors] = useState<Errors>({});
  const [showAltErrors, setShowAltErrors] = useState(false);
  const [message, setMessage] = useState('');

  const station = stations.find((entry) => entry.code === draft.stationCode);
  const stationLabel = station ? `${station.code} ${station.name}` : draft.stationCode;
  const from = draft.stationProgress?.from ?? station?.percent ?? 0;
  const to = draft.stationProgress?.to ?? from;
  const missingAlt = draft.photos.some((photo) => photo.alt.trim() === '');
  const wasPublished = record.state === 'published';

  function change(partial: Partial<StaffProgressUpdate>) {
    setDraft((current) => ({ ...current, ...partial }));
    setMessage('');
  }

  function save(target: 'draft' | 'publish') {
    const found: Errors = {};
    if (draft.title.trim() === '') found.title = copy.errors.title;
    if (target === 'publish') {
      if (draft.body.trim() === '') found.body = copy.errors.body;
      if (mode === 'later' && (draft.date === '' || draft.date <= today)) {
        found.date = copy.errors.date;
      }
    }
    const altProblem = target === 'publish' && missingAlt;
    setErrors(found);
    setShowAltErrors(altProblem);
    if (Object.keys(found).length > 0 || altProblem) {
      setMessage(copy.messages.invalid);
      return;
    }
    const savedId = isNew ? `${slugify(draft.title) || 'update'}-${Date.parse(now)}` : draft.id;
    const state = target === 'draft' ? 'draft' : mode === 'later' ? 'scheduled' : 'published';
    const date =
      state === 'draft'
        ? ''
        : state === 'scheduled'
          ? draft.date
          : wasPublished
            ? record.date
            : today;
    setDraft((current) => ({ ...current, id: savedId, state, date, savedAt: now }));
    progressStore.upsert({
      ...draft,
      id: savedId,
      state,
      date,
      author: draft.author || staffName,
      stationProgress: to === from ? null : { from, to },
      savedAt: now,
    });
    onSaved(savedId);
    setMessage(
      state === 'draft'
        ? copy.messages.saved
        : state === 'scheduled'
          ? copy.messages.scheduled
          : wasPublished
            ? copy.messages.updated
            : copy.messages.published,
    );
  }

  const statusLine =
    record.state === 'published'
      ? copy.status.published(formatDate(record.date))
      : record.state === 'scheduled'
        ? copy.status.scheduled(formatDate(record.date))
        : copy.status.draft(record.savedAt ? formatFullDateTime(record.savedAt) : '');
  const primaryLabel = wasPublished ? copy.update : mode === 'later' ? copy.schedule : copy.publish;
  const previewDate =
    mode === 'later' && draft.date
      ? formatDate(draft.date)
      : wasPublished
        ? formatDate(record.date)
        : formatDate(today);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={routes.admin.progress}
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
            <Button onClick={() => save('publish')}>{primaryLabel}</Button>
          </div>
        }
      />
      <p role="status" className="-mt-4 type-body-s text-gray-700 empty:hidden">
        {message}
      </p>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-1">
          <AdminPanel
            headingId="update-heading"
            title={copy.sections.update}
            className="gap-4 px-6 py-5"
          >
            <Field label={copy.fields.title} error={errors.title}>
              <TextInput
                value={draft.title}
                onChange={(event) => change({ title: event.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={copy.fields.station}>
                <MenuSelect
                  value={draft.stationCode}
                  onValueChange={(code) => {
                    const picked = stations.find((entry) => entry.code === code);
                    if (picked) change({ stationCode: picked.code, stationProgress: null });
                  }}
                  options={stations.map((entry) => ({
                    value: entry.code,
                    label: `${entry.code} ${entry.name}`,
                  }))}
                />
              </Field>
              <Field label={copy.fields.stage}>
                <MenuSelect
                  value={draft.phase}
                  onValueChange={(value) => {
                    if (isPhase(value)) change({ phase: value });
                  }}
                  options={phaseOptions}
                />
              </Field>
            </div>
            <Field label={copy.fields.body} error={errors.body}>
              <Textarea
                rows={4}
                maxCharacters={copy.bodyMax}
                value={draft.body}
                onChange={(event) => change({ body: event.target.value })}
              />
            </Field>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="station-progress" className="type-body-s-medium text-gray-900">
                  {copy.fields.progress}
                </label>
                <output
                  htmlFor="station-progress"
                  className="type-body-s-semibold text-primary-700"
                >
                  {copy.fields.progressValue(from, to)}
                </output>
              </div>
              <input
                id="station-progress"
                type="range"
                min={from}
                max={100}
                value={to}
                aria-describedby="station-progress-hint"
                onChange={(event) =>
                  change({ stationProgress: { from, to: Number(event.target.value) } })
                }
                className="h-2 w-full cursor-pointer accent-primary-600"
              />
              <p id="station-progress-hint" className="type-body-xs text-gray-500">
                {copy.fields.progressHint(station?.name ?? draft.stationCode)}
              </p>
            </div>
          </AdminPanel>

          <AdminPanel
            headingId="photos-heading"
            title={copy.sections.photos}
            className="gap-4 px-6 py-5"
          >
            <PhotoList
              photos={draft.photos}
              showAltErrors={showAltErrors}
              onChange={(photos) => change({ photos })}
            />
          </AdminPanel>
        </div>

        <div className="flex flex-col gap-5 xl:w-95 xl:shrink-0">
          <AdminPanel
            headingId="publishing-heading"
            title={copy.sections.publishing}
            className="gap-3.5 p-5"
          >
            <Field label={copy.fields.publish}>
              <MenuSelect
                value={mode}
                onValueChange={(value) => {
                  if (isMode(value)) {
                    setMode(value);
                    setMessage('');
                  }
                }}
                options={modeOptions}
              />
            </Field>
            {mode === 'later' ? (
              <Field label={copy.fields.scheduleDate} error={errors.date}>
                <TextInput
                  type="date"
                  value={draft.date}
                  min={today}
                  onChange={(event) => change({ date: event.target.value })}
                />
              </Field>
            ) : null}
            <Switch
              label={copy.email.label(stationLabel)}
              description={copy.email.hint}
              checked={draft.emailFollowers}
              onCheckedChange={(checked) => change({ emailFollowers: checked })}
            />
            <Switch
              label={copy.home.label}
              description={copy.home.hint}
              checked={draft.showOnHome}
              onCheckedChange={(checked) => change({ showOnHome: checked })}
            />
          </AdminPanel>

          <AdminPanel
            headingId="preview-heading"
            title={copy.sections.preview}
            className="gap-3 p-5"
          >
            <div className="flex items-start gap-3">
              <ImagePlaceholder decorative className="h-16 w-24 shrink-0 rounded-md" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="type-body-xs text-gray-600">{previewDate}</p>
                <p className="type-body-s-medium text-gray-900">
                  {draft.title.trim() || copy.preview.untitled}
                </p>
              </div>
            </div>
            <p className="type-body-xs text-gray-500">
              {copy.preview.note(station?.name ?? draft.stationCode)}
            </p>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
