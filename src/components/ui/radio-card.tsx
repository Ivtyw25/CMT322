import { cn } from '@/lib/cn';

type RadioCardProps = Omit<React.ComponentProps<'input'>, 'type' | 'className' | 'children'> & {
  label: string;
  description?: string;
  className?: string;
};

/**
 * Selectable card on a native radio. Cards that share a `name` form one group, so the arrow
 * keys move the selection. Wrap the group in a fieldset with a legend.
 */
export function RadioCard({ label, description, className, ...props }: RadioCardProps) {
  return (
    <label
      className={cn(
        'relative flex min-h-11 cursor-pointer flex-col gap-1 rounded-xl border border-gray-300 bg-surface p-4',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:border-gray-400',
        'has-checked:border-primary-600 has-checked:bg-primary-50',
        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600',
        'has-disabled:cursor-not-allowed has-disabled:border-gray-200 has-disabled:bg-gray-100',
        className,
      )}
    >
      <input type="radio" className="sr-only" {...props} />
      <span className="type-body-s-semibold text-gray-900">{label}</span>
      {description ? <span className="type-body-s text-gray-600">{description}</span> : null}
    </label>
  );
}
