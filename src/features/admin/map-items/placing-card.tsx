'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { adminCopy } from '@/content/admin';
import type { MapItemKind } from '@/data/models/staff-content';
import type { AddressLookupStatus } from '@/lib/geo/use-reverse-geocode';

const copy = adminCopy.mapItems;

type PlacingCardProps = {
  kind: MapItemKind;
  kindChoices: readonly SegmentedOption<MapItemKind>[];
  /** Whether the pin has been placed. */
  placed: boolean;
  road: string;
  lookup: AddressLookupStatus;
  onKindChange: (kind: MapItemKind) => void;
  onContinue: () => void;
  onCancel: () => void;
};

/** The card beside the map while a new map item is being placed: type, road and the next step. */
export function PlacingCard({
  kind,
  kindChoices,
  placed,
  road,
  lookup,
  onKindChange,
  onContinue,
  onCancel,
}: PlacingCardProps) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  const roadText = !placed
    ? copy.placing.noPin
    : lookup === 'loading'
      ? copy.placing.finding
      : road || (lookup === 'failed' ? copy.placing.lookupFailed : copy.placing.finding);

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-gray-200 bg-surface p-5 shadow-panel lg:w-85">
      <h2 ref={heading} tabIndex={-1} className="type-heading-3xs text-gray-900 outline-none">
        {copy.placing.title}
      </h2>
      <p className="type-body-s text-gray-600">{copy.placing.body}</p>
      <div className="flex flex-col gap-1.5">
        <p aria-hidden className="type-body-s-medium text-gray-900">
          {copy.edit.type}
        </p>
        <SegmentedControl
          legend={copy.edit.type}
          options={kindChoices}
          value={kind}
          fullWidth
          onValueChange={onKindChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="type-body-s-medium text-gray-900">{copy.placing.road}</p>
        <p role="status" className="type-body-s text-gray-700">
          {roadText}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onContinue} disabled={!placed}>
          {copy.placing.continue}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {copy.placing.cancel}
        </Button>
      </div>
    </div>
  );
}
