'use client';

import { CircleAlert } from 'lucide-react';
import { createContext, use, useId } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type FieldTone = 'default' | 'onNavy';

type FieldContextValue = {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  tone: FieldTone;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/** Props a control (input, textarea, select) must carry to be wired to its Field. */
export function useFieldControl(): {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  tone: FieldTone;
} {
  const field = use(FieldContext);
  if (!field) return { tone: 'default' };
  return {
    id: field.controlId,
    'aria-describedby': field.describedBy,
    'aria-invalid': field.invalid ? true : undefined,
    tone: field.tone,
  };
}

type FieldProps = {
  label: string;
  hint?: string;
  /** Adds the "(optional)" note after the label. */
  optional?: boolean;
  /** Error message. Present means invalid. */
  error?: string;
  /** Keeps the label for screen readers only (footer newsletter, select beside an input). */
  hideLabel?: boolean;
  tone?: FieldTone;
  className?: string;
  children: React.ReactNode;
};

/** Label, hint, control and error message, wired together with ids. */
export function Field({
  label,
  hint,
  optional = false,
  error,
  hideLabel = false,
  tone = 'default',
  className,
  children,
}: FieldProps) {
  const baseId = useId();
  const controlId = `${baseId}-control`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const onNavy = tone === 'onNavy';

  return (
    <FieldContext value={{ controlId, describedBy, invalid: Boolean(error), tone }}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label
          htmlFor={controlId}
          className={cn(
            'type-body-s-medium',
            onNavy ? 'text-static-white' : 'text-gray-900',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {optional ? (
            <span className={cn('ml-1', onNavy ? 'text-static-on-navy-200' : 'text-gray-500')}>
              {uiCopy.form.optional}
            </span>
          ) : null}
        </label>
        {hint ? (
          <p
            id={hintId}
            className={cn('type-body-xs', onNavy ? 'text-static-on-navy-200' : 'text-gray-500')}
          >
            {hint}
          </p>
        ) : null}
        {children}
        {error ? (
          <p
            id={errorId}
            className={cn(
              'flex items-start gap-1.5 type-body-s',
              onNavy ? 'text-static-amber' : 'text-danger-700',
            )}
          >
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext>
  );
}
