'use client';

import { useState } from 'react';
import { LocationMap } from '@/components/patterns/map/location-map';
import { Button } from '@/components/ui/button';
import { devCopy } from '@/content/dev';

const copy = devCopy.traffic;
const FOCUS_ID = 'sample-hazard';

/** The map with every traffic prop, driven by its own state, for the gallery. */
export function DemoTrafficMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const titles: Record<string, string> = {
    ...Object.fromEntries(copy.mapMarkers.map((marker) => [marker.id, marker.label])),
    [copy.mapZone.id]: copy.zoneTitle,
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedId(FOCUS_ID);
            setFocusKey((key) => key + 1);
          }}
        >
          {copy.mapFocusButton}
        </Button>
        <Button variant="ghost" onClick={() => setSelectedId(null)}>
          {copy.mapClearButton}
        </Button>
        <p role="status" className="type-body-s text-gray-700">
          {selectedId ? copy.mapSelected(selectedId) : copy.mapNone}
        </p>
      </div>
      <LocationMap
        center={copy.mapCenter}
        zoom={copy.mapZoom}
        label={copy.mapLabel}
        centreLabel={copy.mapCentreLabel}
        interaction="full"
        className="h-120 rounded-2xl"
        markers={copy.mapMarkers}
        zones={[{ ...copy.mapZone, selected: selectedId === copy.mapZone.id }]}
        lines={[{ id: 'sample-line', variant: 'line', points: copy.mapLine }]}
        labels={[copy.mapTag]}
        resetBounds={copy.mapLine}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDeselect={() => setSelectedId(null)}
        renderPopup={(id) => (
          <p className="type-body-s-semibold text-gray-900">{titles[id] ?? id}</p>
        )}
        focusId={selectedId}
        focusKey={focusKey}
      />
    </div>
  );
}
