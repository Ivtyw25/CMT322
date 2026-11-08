'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ErrorSummary } from '@/components/patterns/error-summary';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Callout } from '@/components/ui/callout';
import { Checkbox } from '@/components/ui/checkbox';
import { RequiredMark } from '@/components/ui/field';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import type { ReportCategory } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { formatShortDateTime } from '@/lib/format/date-time';
import { useFieldValidation } from '@/lib/forms/use-field-validation';
import { useReverseGeocode } from '@/lib/geo/use-reverse-geocode';
import { useSession } from '@/lib/session';
import { useTickets } from '@/lib/tickets';
import { ReportContactSection } from './report-contact-section';
import { ReportDetailsSection, ReportTypeSection } from './report-details-section';
import { ReportFilesSection } from './report-files-section';
import { ReportLocationSection, type MapView } from './report-location-section';
import { ReportStationQuery } from './report-station-query';
import {
  emptyReportValues,
  nearestStation,
  reportFieldId,
  reportFieldOrder,
  reportRules,
  type ReportPoint,
  type ReportStation,
  type ReportValues,
} from './report-values';
import { useCurrentLocation } from './use-current-location';
import { useReportDraft, type RestoredDraft } from './use-report-draft';

const { actions, consent, draft, errorSummary, errors, header, location } = reportTrackCopy.report;

const ANNOUNCE_DELAY_MS = 500;
const PIN_ZOOM = 16;
const DEFAULT_ZOOM = 12;

type Notice = { savedAt: string; hadFiles: boolean };

type ReportFormProps = {
  categories: readonly ReportCategory[];
  stations: readonly ReportStation[];
};

function lineCentre(stations: readonly ReportStation[]): ReportPoint {
  const total = stations.reduce(
    (sum, station) => ({ lat: sum.lat + station.lat, lng: sum.lng + station.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: total.lat / stations.length, lng: total.lng / stations.length };
}

/** The report form: one page, validated on blur and on submit, with a draft kept in this browser. */
export function ReportForm({ categories, stations }: ReportFormProps) {
  const router = useRouter();
  const announce = useAnnounce();
  const { user } = useSession();
  const { submitTicket } = useTickets();
  const [values, setValues] = useState<ReportValues>(() => ({
    ...emptyReportValues,
    name: user?.name ?? '',
    email: user?.email ?? '',
  }));
  const [view, setView] = useState<MapView>(() => ({
    center: lineCentre(stations),
    zoom: DEFAULT_ZOOM,
  }));
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [failedKey, setFailedKey] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const stationFromQuery = useRef(false);
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const rules = reportRules(values, uploading);
  const validation = useFieldValidation(rules, reportFieldOrder);

  const update = useCallback(
    (patch: Partial<ReportValues>) => setValues((current) => ({ ...current, ...patch })),
    [],
  );

  const say = useCallback(
    (message: string) => {
      clearTimeout(announceTimer.current);
      announceTimer.current = setTimeout(() => announce(message), ANNOUNCE_DELAY_MS);
    },
    [announce],
  );

  useEffect(() => () => clearTimeout(announceTimer.current), []);

  const restore = useCallback(
    (restored: RestoredDraft) => {
      const known = categories.some((entry) => entry.id === restored.values.categoryId);
      setValues((current) => ({
        ...current,
        ...restored.values,
        categoryId: known ? restored.values.categoryId : '',
        ...(stationFromQuery.current
          ? { address: current.address, pin: current.pin, stationCode: current.stationCode }
          : {}),
      }));
      if (restored.values.pin && !stationFromQuery.current) {
        setView({ center: restored.values.pin, zoom: PIN_ZOOM });
      }
      setNotice({ savedAt: restored.savedAt, hadFiles: restored.hadFiles });
    },
    [categories],
  );

  const { clear: clearDraft } = useReportDraft({
    values,
    fileCount: files.length,
    onRestore: restore,
  });

  const addressLookup = useReverseGeocode(
    useCallback((address: string) => update({ address }), [update]),
  );
  const { cancel: cancelLookup } = addressLookup;

  const applyStation = useCallback(
    (station: ReportStation) => {
      cancelLookup();
      stationFromQuery.current = true;
      const point = { lat: station.lat, lng: station.lng };
      setValues((current) => ({
        ...current,
        stationCode: station.code,
        address: location.map.addressAtStation(station.name),
        pin: point,
      }));
      setView({ center: point, zoom: PIN_ZOOM });
    },
    [cancelLookup],
  );

  function placePin(point: ReportPoint, message?: string) {
    const station = nearestStation(stations, point);
    update({ pin: point, stationCode: station?.code ?? null });
    addressLookup.lookup(point);
    if (message) say(message);
    else if (station) say(location.map.pinSetNear(station.name));
  }

  const locator = useCurrentLocation((point) => {
    setView({ center: point, zoom: PIN_ZOOM });
    placePin(point, location.map.pinSetCurrent);
  });

  /** The visitor placed, dragged or nudged the pin: a location problem no longer applies. */
  function handlePinChange(point: ReportPoint) {
    locator.clearError();
    placePin(point);
  }

  function focusField(fieldId: string) {
    const target = document
      .getElementById(fieldId)
      ?.querySelector<HTMLElement>('input, textarea, select, button');
    target?.focus();
  }

  function startOver() {
    clearDraft();
    validation.reset();
    setSummaryOpen(false);
    setNotice(null);
    cancelLookup();
    setValues({ ...emptyReportValues, name: values.name, email: values.email });
    setView({ center: lineCentre(stations), zoom: DEFAULT_ZOOM });
    document.getElementById('type')?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const found = validation.validateAll();
    setSubmitCount((count) => count + 1);
    setSummaryOpen(found.length > 0);
    if (found.length > 0 || !values.pin) return;
    setPending(true);
    announce(actions.sending);
    try {
      const nearest = nearestStation(stations, values.pin);
      const ticket = await submitTicket(
        {
          type: values.type,
          categoryId: values.categoryId as ReportCategory['id'],
          subject: values.subject.trim(),
          description: values.description.trim(),
          location: values.address.trim(),
          coordinates: values.pin,
          stationCode: values.stationCode,
          areaLabel: nearest?.area ?? '',
          reporterId: user?.id ?? null,
          reporter: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          },
        },
        files,
      );
      clearDraft();
      router.push(routes.reportTrack.submitted(ticket.id));
    } catch {
      setPending(false);
      setFailedKey((key) => key + 1);
    }
  }

  const summaryItems = summaryOpen
    ? validation.visibleErrors().map(({ name, message }) => ({
        fieldId: reportFieldId(name),
        message,
      }))
    : [];
  const sectionProps = {
    values,
    update,
    errorOf: validation.errorOf,
    onBlur: validation.onBlur,
  };

  return (
    <form
      noValidate
      aria-label={header.title}
      onSubmit={handleSubmit}
      className="flex flex-col gap-10"
    >
      <Suspense fallback={null}>
        <ReportStationQuery stations={stations} onStation={applyStation} />
      </Suspense>

      {summaryItems.length > 0 ? (
        <ErrorSummary
          title={errorSummary.title}
          intro={errorSummary.intro}
          items={summaryItems}
          focusKey={submitCount}
          onItemClick={focusField}
        />
      ) : null}
      {failedKey > 0 && !pending ? (
        <ErrorSummary
          title={errors.submitFailedTitle}
          intro={errors.submitFailed}
          items={[]}
          focusKey={failedKey}
        />
      ) : null}
      {notice ? (
        <Callout tone="info">
          <p>{draft.restored(formatShortDateTime(notice.savedAt))}</p>
          {notice.hadFiles ? <p>{draft.photosNote}</p> : null}
          <button
            type="button"
            onClick={startOver}
            className="mt-1 cursor-pointer type-body-s-semibold text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {draft.startOver}
          </button>
        </Callout>
      ) : null}

      <div inert={pending} className="flex flex-col gap-8 md:gap-10">
        <ReportTypeSection {...sectionProps} categories={categories} />
        <ReportDetailsSection {...sectionProps} />
        <ReportLocationSection
          {...sectionProps}
          stations={stations}
          view={view}
          onPinChange={handlePinChange}
          onRemoveStation={() => update({ stationCode: null })}
          onAddressTyped={(address) => {
            cancelLookup();
            update({ address });
          }}
          addressLookup={addressLookup.status}
          locate={
            locator.supported ? { status: locator.status, onLocate: locator.locate } : undefined
          }
        />
        <ReportFilesSection
          error={validation.errorOf('files')}
          onFilesChange={setFiles}
          onBusyChange={setUploading}
        />
        <ReportContactSection {...sectionProps} />
        <div id={reportFieldId('consent')} className="scroll-mt-35 border-t border-gray-200 pt-10">
          <Checkbox
            name="consent"
            required
            label={
              <span>
                {consent.label}
                <RequiredMark />
              </span>
            }
            checked={values.consent}
            error={validation.errorOf('consent') ?? undefined}
            onChange={(event) => {
              update({ consent: event.target.checked });
              if (!event.target.checked) validation.activate('consent');
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={pending}>
          {pending ? actions.submitting : actions.submit}
        </Button>
        <ButtonLink variant="secondary" href={routes.reportTrack.overview}>
          {actions.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
