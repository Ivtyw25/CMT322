'use client';

import { LocateFixed, Minus, Plus } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type MapControlsProps = {
  /** `full` maps get the 40 px controls of the traffic map; snippets keep the 28 px ones. */
  large: boolean;
  zoomInDisabled: boolean;
  zoomOutDisabled: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  centreLabel?: string;
  onCentre: () => void;
};

const controlClass = cn(
  'hit-area flex cursor-pointer items-center justify-center border border-gray-300',
  'bg-surface text-gray-700 shadow-control transition-colors duration-(--duration-fast)',
  'hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400',
);

/** Zoom in, zoom out and the optional reset button, top right. */
export function MapControls({
  large,
  zoomInDisabled,
  zoomOutDisabled,
  onZoomIn,
  onZoomOut,
  centreLabel,
  onCentre,
}: MapControlsProps) {
  const size = large ? 'size-10 rounded-lg' : 'size-7 rounded-md';
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
      <button
        type="button"
        aria-label={uiCopy.map.zoomIn}
        disabled={zoomInDisabled}
        onClick={onZoomIn}
        className={cn(controlClass, size)}
      >
        <Plus aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        aria-label={uiCopy.map.zoomOut}
        disabled={zoomOutDisabled}
        onClick={onZoomOut}
        className={cn(controlClass, size)}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      {centreLabel ? (
        <button
          type="button"
          aria-label={centreLabel}
          title={centreLabel}
          onClick={onCentre}
          className={cn(controlClass, size)}
        >
          <LocateFixed aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
