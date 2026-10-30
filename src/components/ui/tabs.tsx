'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

/**
 * Underline tabs on Radix Tabs: arrow keys move and select (automatic activation), Home and
 * End jump. The row wraps on narrow screens; it never scrolls sideways.
 */
export function Tabs({ className, ...props }: TabsPrimitive.TabsProps) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn('flex flex-wrap gap-x-5 border-b border-gray-200', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'hit-area -mb-px cursor-pointer border-b-2 border-transparent py-2.5 type-body-s-medium text-gray-600',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:text-gray-900',
        'data-[state=active]:border-primary-600 data-[state=active]:text-primary-700',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return <TabsPrimitive.Content className={cn(className)} {...props} />;
}
