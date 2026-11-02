'use client';

import { CircleAlert, LocateFixed, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { LocationMap, type MapPoint } from '@/components/patterns/map/location-map';
import { reportTrackCopy } from '@/content/report-track';
import { DocsSectionHeading } from '@/features/project/docs-section';
import type { ReportSectionProps } from './report-section-props';
import type { LocationStatus } from './use-current-location';
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
  update,
  errorOf,
  onBlur,
  stations,
  view,
  onPinChange,
  onRemoveStation,
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
        <DocsSectionHeading id="location" title={location.title} />
        <p className="type-body-s text-gray-600">{location.lede}</p>
      </div>
      <div id={reportFieldId('address')} className="flex scroll-mt-35 flex-col gap-2">
        <Field label={location.address.label} error={errorOf('address') ?? undefined}>
          <TextInput
            name="address"
            autoComplete="street-address"
            leadingIcon={<MapPin className="size-4" />}
            value={values.address}
            placeholder={location.address.placeholder}
            onChange={(event) => update({ address: event.target.value })}
            onBlur={() => onBlur('address')}
          />
        </Field>
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
      <div className="flex flex-col gap-2">
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
                  className="px-3 py-2 whitespace-nowrap shadow-control"
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
          className="h-50 rounded-xl md:h-55"
        />
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
