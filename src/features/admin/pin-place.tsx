'use client';

import { CircleAlert, LocateFixed, TrainFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminCopy } from '@/content/admin';
import type { GeoPoint } from '@/lib/geo/reverse-geocode';
import { useCurrentLocation } from '@/lib/geo/use-current-location';
import type { PinStation } from './pin-station';

const copy = adminCopy.pinPlace;

/** "Nearest station" with the station the pin is closest to. */
export function NearestStation({
  station,
  hint = false,
}: {
  station: PinStation | null;
  /** Explain what the station is used for. */
  hint?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="type-body-s-medium text-gray-900">{copy.nearestStation}</p>
      <p role="status" className="flex items-center gap-1.5 type-body-s text-gray-700">
        <TrainFront aria-hidden className="size-4 shrink-0 text-primary-600" />
        {station ? copy.station(station.code, station.name, station.area) : copy.noPin}
      </p>
      {hint ? <p className="type-body-xs text-gray-500">{copy.stationHint}</p> : null}
    </div>
  );
}

/** "Use my current location": puts the pin where the staff member is standing. */
export function LocateButton({ onFound }: { onFound: (point: GeoPoint) => void }) {
  const { status, supported, locate } = useCurrentLocation(onFound);
  if (!supported) return null;
  const problem =
    status === 'denied' ? copy.errorDenied : status === 'unavailable' ? copy.errorUnavailable : '';
  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant="secondary"
        loading={status === 'loading'}
        onClick={locate}
        icon={<LocateFixed aria-hidden className="size-4" />}
        className="w-fit whitespace-nowrap"
      >
        {status === 'loading' ? copy.locating : copy.useMyLocation}
      </Button>
      {problem ? (
        <p className="flex items-start gap-1.5 type-body-s text-danger-700">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {problem}
        </p>
      ) : null}
    </div>
  );
}
