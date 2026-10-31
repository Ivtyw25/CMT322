'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ChipSelectOption = { value: string; label: string };

type ChipSelectProps = Omit<React.ComponentProps<'select'>, 'className' | 'children'> & {
  /** Name for screen readers (there is no visible label). */
  label: string;
  options: readonly ChipSelectOption[];
  className?: string;
};

/** A native select styled as a filter chip, to sit beside FilterChips. */
export function ChipSelect({ label, options, className, ...props }: ChipSelectProps) {
  return (
    <div className={cn('relative inline-flex', className)}>
      <select
        aria-label={label}
        {...props}
        className={cn(
          'hit-area cursor-pointer appearance-none rounded-full border border-gray-200 bg-surface py-1.5 pr-9 pl-3.5',
          'type-body-s-medium text-gray-900 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface text-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}
