'use client';

import { useId, useState } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { controlVariants } from './control-styles';
import { useFieldControl } from './field';

type TextareaProps = Omit<React.ComponentProps<'textarea'>, 'className' | 'maxLength'> & {
  /** Soft limit: the counter warns above it, but typing is never blocked. */
  maxCharacters: number;
  className?: string;
};

/** Counts "{n} of {max} characters". Screen readers hear it only at 90 % and 100 %. */
export function Textarea({
  maxCharacters,
  className,
  onChange,
  value,
  defaultValue,
  rows = 5,
  ...props
}: TextareaProps) {
  const { tone, ...fieldProps } = useFieldControl();
  const counterId = useId();
  const initial = String(value ?? defaultValue ?? '').length;
  const [typed, setTyped] = useState(initial);
  const [spoken, setSpoken] = useState('');
  const count = value === undefined ? typed : String(value).length;
  const over = count > maxCharacters;
  const text = uiCopy.form.characterCount(count, maxCharacters);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = event.target.value.length;
    setTyped(next);
    const level = next >= maxCharacters ? 2 : next >= maxCharacters * 0.9 ? 1 : 0;
    const previousLevel = typed >= maxCharacters ? 2 : typed >= maxCharacters * 0.9 ? 1 : 0;
    if (level !== previousLevel) {
      setSpoken(level === 0 ? '' : uiCopy.form.characterCount(next, maxCharacters));
    }
    onChange?.(event);
  }

  const describedBy = [fieldProps['aria-describedby'], counterId].filter(Boolean).join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <textarea
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...fieldProps}
        aria-describedby={describedBy}
        {...props}
        className={cn(controlVariants({ tone }), 'resize-y')}
      />
      <p
        id={counterId}
        className={cn('text-right type-body-xs', over ? 'text-danger-700' : 'text-gray-500')}
      >
        {text}
      </p>
      <p aria-live="polite" className="sr-only">
        {spoken}
      </p>
    </div>
  );
}
