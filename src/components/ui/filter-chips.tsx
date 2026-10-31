'use client';

import { cn } from '@/lib/cn';

export type FilterChipOption<Value extends string> = { value: Value; label: string };

type FilterChipsProps<Value extends string> = {
  /** Name of the group, e.g. "Area". */
  label: string;
  options: readonly FilterChipOption<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  /** `compact` is the 32 px chip of the Construction progress filters. */
  density?: 'default' | 'compact';
  className?: string;
};

/** Single-select filters as toggle buttons: exactly one is pressed at a time. */
export function FilterChips<Value extends string>({
  label,
  options,
  value,
  onValueChange,
  density = 'default',
  className,
}: FilterChipsProps<Value>) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'hit-area cursor-pointer rounded-full border type-body-s-medium',
              density === 'compact' ? 'px-3 py-1.25' : 'px-4 py-2',
              'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
              pressed
                ? 'border-gray-900 bg-gray-900 text-surface'
                : 'border-gray-300 bg-surface text-gray-700 hover:border-gray-400',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
