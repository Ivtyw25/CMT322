'use client';

import { ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';
import { controlVariants } from './control-styles';
import { useFieldControl } from './field';
import type { SelectOption } from './select';

type MenuSelectProps = {
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  disabled?: boolean;
  className?: string;
};

/**
 * A select whose list is drawn by the site (same look as the appearance menu), not by the
 * browser. Keyboard and screen-reader behaviour come from Radix Select; `name` posts the value
 * with the form. Use inside `Field` for the label. Give it a fixed width: a long choice is cut
 * with an ellipsis instead of resizing the field.
 */
export function MenuSelect({
  name,
  value,
  onValueChange,
  options,
  disabled,
  className,
}: MenuSelectProps) {
  const { tone, ...fieldProps } = useFieldControl();
  return (
    <SelectPrimitive.Root
      name={name}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        {...fieldProps}
        className={cn(
          controlVariants({ tone }),
          'group flex cursor-pointer items-center justify-between gap-2 text-left',
          className,
        )}
      >
        <span className="min-w-0 flex-1 truncate">
          <SelectPrimitive.Value />
        </span>
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
                disabled={option.disabled}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.25 outline-none select-none md:min-h-0',
                  'type-body-s-medium text-gray-800 transition-colors duration-(--duration-fast)',
                  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
                  'data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:text-gray-400',
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
