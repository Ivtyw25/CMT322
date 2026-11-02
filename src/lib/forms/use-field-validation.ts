'use client';

import { useCallback, useState } from 'react';

/** A rule returns the error message, or `null` when the value is fine. */
export type FieldRules<Name extends string> = Record<Name, () => string | null>;

/**
 * Per-field validation. A field is checked when it loses focus (never while the first character is
 * typed) and every field is checked on submit. Once a field has shown an error it stays active:
 * the message is derived from the current value, so it goes away the moment the value is fixed.
 * `rules` are read on every render and may close over the current form values.
 */
export function useFieldValidation<Name extends string>(
  rules: FieldRules<Name>,
  order: readonly Name[],
) {
  const [active, setActive] = useState<ReadonlySet<Name>>(new Set());

  const errorOf = (name: Name): string | null => (active.has(name) ? rules[name]() : null);

  /** Call from `onBlur`. */
  const onBlur = useCallback(
    (name: Name) => {
      if (rules[name]() !== null) setActive((current) => new Set(current).add(name));
    },
    [rules],
  );

  /** Starts checking a field right away (a checkbox that is switched off again). */
  const activate = useCallback((name: Name) => {
    setActive((current) => new Set(current).add(name));
  }, []);

  /** Activates every failing field and returns the errors in page order. */
  const validateAll = useCallback((): { name: Name; message: string }[] => {
    const found: { name: Name; message: string }[] = [];
    for (const name of order) {
      const message = rules[name]();
      if (message) found.push({ name, message });
    }
    setActive((current) => new Set([...current, ...found.map((entry) => entry.name)]));
    return found;
  }, [order, rules]);

  /** Every error that is showing now, in page order. */
  const visibleErrors = (): { name: Name; message: string }[] =>
    order.flatMap((name) => {
      const message = errorOf(name);
      return message ? [{ name, message }] : [];
    });

  const reset = useCallback(() => setActive(new Set()), []);

  return { errorOf, onBlur, activate, validateAll, visibleErrors, reset };
}
