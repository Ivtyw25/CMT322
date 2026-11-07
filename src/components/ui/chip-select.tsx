'use client';

import { ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type ChipSelectOption = { value: string; label: string };

type ChipSelectProps = {
  /** Name for screen readers (there is no visible label). */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly ChipSelectOption[];
  /** `compact` is the 32 px chip of the Construction progress filters. */
  density?: 'default' | 'compact';
  className?: string;
};

/**
 * A filter chip that opens the site's own menu (same look as MenuSelect and the appearance
 * menu), to sit beside FilterChips. Keyboard and screen-reader behaviour come from Radix Select.
 */
export function ChipSelect({
  label,
  value,
  onValueChange,
  options,
  density = 'default',
  className,
}: ChipSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          'group hit-area inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-surface whitespace-nowrap',
          density === 'compact' ? 'py-1.25 pr-2.5 pl-3' : 'py-1.5 pr-3 pl-3.5',
          'type-body-s-medium text-gray-900 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
          'data-[state=open]:border-gray-400',
          className,
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-gray-500 transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            'z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-2xl border border-gray-200 bg-surface p-2 shadow-menu',
            'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
          )}
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.25 outline-none select-none md:min-h-0',
                  'type-body-s-medium text-gray-800 transition-colors duration-(--duration-fast)',
                  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
                  'data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700',
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
