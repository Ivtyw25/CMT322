'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import { useId } from 'react';
import { cn } from '@/lib/cn';

type SwitchProps = Omit<SwitchPrimitive.SwitchProps, 'className' | 'children'> & {
  label: string;
  className?: string;
};

/** Labelled on/off setting (Figma 91:2963 / 91:2965). Space toggles; the label is clickable. */
export function Switch({ label, className, id, ...props }: SwitchProps) {
  const generated = useId();
  const switchId = id ?? generated;
  return (
    <div className={cn('flex min-h-11 items-center gap-3 md:min-h-0', className)}>
      <SwitchPrimitive.Root
        id={switchId}
        className={cn(
          'hit-area relative h-6 w-10 shrink-0 cursor-pointer rounded-full bg-gray-300',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'data-[state=checked]:bg-primary-600',
          'disabled:cursor-not-allowed disabled:bg-gray-200 data-[disabled]:bg-gray-200',
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block size-5 translate-x-0.5 rounded-full bg-static-white shadow-knob',
            'transition-transform duration-(--duration-fast) ease-(--ease-standard)',
            'data-[state=checked]:translate-x-4.5',
            'data-[disabled]:bg-gray-100 data-[disabled]:shadow-none',
          )}
        />
      </SwitchPrimitive.Root>
      <label htmlFor={switchId} className="cursor-pointer type-body-s-medium text-gray-900">
        {label}
      </label>
    </div>
  );
}
