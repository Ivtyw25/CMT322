import { cn } from '@/lib/cn';

/** Short 48 × 4 px bar above a section heading. Decorative. */
export function AccentBar({ className }: { className?: string }) {
  return <div aria-hidden className={cn('h-1 w-12 rounded-full bg-primary-600', className)} />;
}
