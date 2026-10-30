'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

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
  /** Stretch the segments over the full width (drawer). */
  fullWidth?: boolean;
  className?: string;
};

/** One choice of two or three. A native radio group: arrow keys move and select, Tab leaves it. */
export function SegmentedControl<Value extends string>({
  legend,
  options,
  value,
  onValueChange,
  fullWidth = false,
  className,
}: SegmentedControlProps<Value>) {
  const name = useId();
  return (
    <fieldset
      className={cn(
        'flex gap-0.75 rounded-xl bg-gray-100 p-0.75',
        fullWidth ? 'w-full' : 'w-fit',
        className,
      )}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'hit-area relative flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2',
            'type-body-s-medium text-gray-700 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
            'hover:text-gray-900 has-checked:bg-surface has-checked:text-primary-700 has-checked:shadow-control',
            'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600',
            fullWidth && 'flex-1',
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
}
