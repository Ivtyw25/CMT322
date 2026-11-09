'use client';

import { CircleAlert, LoaderCircle, LocateFixed, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, RequiredMark } from '@/components/ui/field';
import type { AddressLookupStatus } from '@/lib/geo/use-reverse-geocode';
import { TextInput } from '@/components/ui/text-input';
import { LocationMap, type MapPoint } from '@/components/patterns/map/location-map';
import { reportTrackCopy } from '@/content/report-track';
import { DocsSectionHeading } from '@/components/patterns/docs-section';
import type { ReportSectionProps } from './report-section-props';
import type { LocationStatus } from '@/lib/geo/use-current-location';
import {
  formatCoordinate,
  formatPoint,
  reportFieldId,
  type ReportPoint,
  type ReportStation,
} from './report-values';

const { location } = reportTrackCopy.report;

export type MapView = { center: MapPoint; zoom: number };

type LocationSectionProps = ReportSectionProps & {
  stations: readonly ReportStation[];
  view: MapView;
  onPinChange: (point: ReportPoint) => void;
  onRemoveStation: () => void;
  /** The visitor typed in the address field. */
  onAddressTyped: (address: string) => void;
  /** Where the address from the pin stands. */
  addressLookup: AddressLookupStatus;
  /** Geolocation: undefined when the browser has none (the button is not shown). */
  locate?: { status: LocationStatus; onLocate: () => void };
};

const locationError = {
  denied: location.map.errorDenied,
  unavailable: location.map.errorUnavailable,
} as const;

/** "Location": address, station chip, and the map where the pin is placed. */
export function ReportLocationSection({
  values,
  errorOf,
  onBlur,
  stations,
  view,
  onPinChange,
  onRemoveStation,
  onAddressTyped,
  addressLookup,
  locate,
}: LocationSectionProps) {
  const station = stations.find((entry) => entry.code === values.stationCode);
  const locating = locate?.status === 'loading';
  const problem =
    locate?.status === 'denied' || locate?.status === 'unavailable'
      ? locationError[locate.status]
      : null;
  return (
    <section
      aria-labelledby="location"
      className="flex flex-col gap-5 border-t border-gray-200 pt-10"
    >
      <div className="flex flex-col gap-1.5">
        <DocsSectionHeading compact id="location" title={location.title} />
        <p className="type-body-s text-gray-600">{location.lede}</p>
      </div>
      <div id={reportFieldId('address')} className="flex scroll-mt-35 flex-col gap-2">
        <Field label={location.address.label} required error={errorOf('address') ?? undefined}>
          <TextInput
            name="address"
            autoComplete="street-address"
            leadingIcon={<MapPin className="size-4" />}
            value={values.address}
            placeholder={location.address.placeholder}
            onChange={(event) => onAddressTyped(event.target.value)}
            onBlur={() => onBlur('address')}
          />
        </Field>
        {addressLookup === 'loading' ? (
          <p role="status" className="flex items-center gap-1.5 type-body-xs text-gray-600">
            <LoaderCircle aria-hidden className="size-3.5 shrink-0 animate-spin" />
            {location.address.finding}
          </p>
        ) : null}
        {addressLookup === 'failed' ? (
          <p role="status" className="flex items-start gap-1.5 type-body-s text-warning-700">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {location.address.lookupFailed}
          </p>
        ) : null}
        {station ? (
          <p className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-50 py-1 pr-1 pl-3 type-body-xs-medium text-primary-700">
            {location.map.stationChip(station.code, station.name)}
            <button
              type="button"
              aria-label={location.map.removeStation}
              onClick={onRemoveStation}
              className="hit-area flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </p>
        ) : null}
      </div>
      <div id={reportFieldId('pin')} className="flex scroll-mt-35 flex-col gap-2">
        <p className="type-body-s-medium text-gray-900">
          {location.map.pinLegend}
          <RequiredMark />
        </p>
        <LocationMap
          center={view.center}
          zoom={view.zoom}
          label={location.map.label}
          panEnabled={false}
          pin={{
            point: values.pin,
            onChange: onPinChange,
            label: (point) =>
              location.map.pinLabel(formatCoordinate(point.lat), formatCoordinate(point.lng)),
            dropLabel: location.map.dropPin,
          }}
          overlay={
            <>
              {locate ? (
                <Button
                  variant="secondary"
                  loading={locating}
                  onClick={locate.onLocate}
                  icon={<LocateFixed aria-hidden className="size-4" />}
                  className="min-h-11 px-3 py-2 whitespace-nowrap shadow-control lg:min-h-0"
                >
                  {locating ? location.map.locating : location.map.useMyLocation}
                </Button>
              ) : (
                <span />
              )}
              {values.pin ? (
                <p className="rounded-md bg-surface px-2 py-0.5 type-body-xs text-gray-700 max-sm:sr-only">
                  {formatPoint(values.pin)}
                </p>
              ) : null}
            </>
          }
          className="h-75 rounded-xl md:h-95"
        />
        {errorOf('pin') ? (
          <p className="flex items-start gap-1.5 type-body-s text-danger-700">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {errorOf('pin')}
          </p>
        ) : null}
        {problem ? (
          <p className="flex items-start gap-1.5 type-body-s text-danger-700">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {problem}
          </p>
        ) : null}
      </div>
    </section>
  );
}
