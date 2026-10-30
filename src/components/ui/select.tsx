'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { controlVariants } from './control-styles';
import { useFieldControl } from './field';

export type SelectOption = { value: string; label: string };

type SelectProps = Omit<React.ComponentProps<'select'>, 'className' | 'children'> & {
  options: readonly SelectOption[];
  className?: string;
};

/** Native select with explicit surface and text colours so dark mode never inverts it. */
export function Select({ options, className, ...props }: SelectProps) {
  const { tone, ...fieldProps } = useFieldControl();
  return (
    <div className={cn('relative', className)}>
      <select
        {...fieldProps}
        {...props}
        className={cn(controlVariants({ tone }), 'cursor-pointer appearance-none pr-10')}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface text-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}
