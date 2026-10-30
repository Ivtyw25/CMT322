import { Check, CircleAlert } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type' | 'className' | 'children'> & {
  label: string;
  /** Error message shown under the box; sets `aria-invalid`. */
  error?: string;
  className?: string;
};

/** Native checkbox, styled. The whole row is the click target (44 px tall on phones). */
export function Checkbox({ label, error, className, id, disabled, ...props }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const errorId = `${inputId}-error`;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'flex min-h-11 items-center gap-2.5 type-body-s text-gray-800 md:min-h-0',
          disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer',
        )}
      >
        <span className="relative flex size-4 shrink-0">
          <input
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'peer size-4 appearance-none rounded-sm border bg-surface',
              'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
              error ? 'border-danger-600' : 'border-gray-400 hover:border-gray-500',
              'checked:border-primary-600 checked:bg-primary-600',
              'disabled:border-gray-200 disabled:bg-gray-100 disabled:checked:bg-gray-300',
            )}
            {...props}
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute inset-0 m-auto size-3 text-static-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        {label}
      </label>
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 type-body-s text-danger-700">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
