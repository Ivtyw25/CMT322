import { useId } from 'react';
import { segmentedItemClass, segmentedTrackClass } from '@/components/ui/segmented-styles';
import { trafficCopy } from '@/content/traffic';
import { cn } from '@/lib/cn';
import { timeWindows, type TimeWindow } from './traffic-filters';

type TimeFilterProps = {
  /** `null`: no window chosen, every road change that has not ended is shown. */
  value: TimeWindow | null;
  onChange: (value: TimeWindow | null) => void;
};

/**
 * "Active / Upcoming" (Figma 67:2449, owner decision 2026-11-09): a native radio group, so the arrow keys
 * move and select. Choosing the selected window again goes back to showing everything.
 */
export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const name = useId();
  const copy = trafficCopy.map.filters;
  return (
    <fieldset className={cn(segmentedTrackClass, 'w-full')}>
      <legend className="sr-only">{copy.timeGroupLabel}</legend>
      {timeWindows.map((window) => (
        <label
          key={window}
          className={cn(
            segmentedItemClass,
            'flex-1 px-1 py-1.5 text-center type-body-xs-medium whitespace-nowrap',
            'has-checked:bg-surface has-checked:text-gray-900 has-checked:shadow-control',
            'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600',
          )}
        >
          <input
            type="radio"
            name={name}
            value={window}
            checked={value === window}
            onChange={() => onChange(window)}
            onClick={() => {
              if (value === window) onChange(null);
            }}
            className="sr-only"
          />
          {copy.time[window]}
        </label>
      ))}
    </fieldset>
  );
}
