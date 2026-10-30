import { cn } from '@/lib/cn';

/** Text for screen readers only. Use for context the layout shows another way. */
export function VisuallyHidden({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('sr-only', className)} {...props} />;
}
