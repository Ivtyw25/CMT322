'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { segmentedItemClass, segmentedTrackClass } from './segmented-styles';

export type SegmentedOption<Value extends string> = {
  value: Value;
  label: string;
  /** Decorative icon before the label. */
  icon?: React.ReactNode;
};

type SegmentedControlProps<Value extends string> = {
  /** Name of the group for screen readers (visually hidden legend). */
  legend: string;
  options: readonly SegmentedOption<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  /** Stretch the segments over the full width (drawer). Ignored when vertical. */
  fullWidth?: boolean;
  /**
   * `vertical` stacks full-width options, 44 px each. `adaptive` is vertical until the space it
   * sits in is 660 px wide, then a row (the FAQ audience switch).
   */
  orientation?: 'horizontal' | 'vertical' | 'adaptive';
  className?: string;
};

/**
 * One choice of two to four. A native radio group: arrow keys move and select (Up and Down as
 * well as Left and Right), Tab leaves it.
 */
export function SegmentedControl<Value extends string>({
  legend,
  options,
  value,
  onValueChange,
  fullWidth = false,
  orientation = 'horizontal',
  className,
}: SegmentedControlProps<Value>) {
  const name = useId();
  const adaptive = orientation === 'adaptive';
  const control = (
    <fieldset
      className={cn(
        segmentedTrackClass,
        orientation === 'horizontal' && (fullWidth ? 'w-full' : 'w-fit'),
        orientation === 'vertical' && 'w-full flex-col',
        adaptive && 'w-full flex-col @min-[41.25rem]:w-fit @min-[41.25rem]:flex-row',
        !adaptive && className,
      )}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            segmentedItemClass,
            'has-checked:bg-surface has-checked:text-primary-700 has-checked:shadow-control',
            'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600',
            fullWidth && orientation === 'horizontal' && 'flex-1',
            orientation === 'vertical' && 'min-h-11',
            adaptive && 'min-h-11 @min-[41.25rem]:min-h-0',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onValueChange(option.value)}
            className="sr-only"
          />
          {option.icon ? (
            <span aria-hidden className="flex shrink-0">
              {option.icon}
            </span>
          ) : null}
          {option.label}
        </label>
      ))}
    </fieldset>
  );
  return adaptive ? <div className={cn('@container', className)}>{control}</div> : control;
}
