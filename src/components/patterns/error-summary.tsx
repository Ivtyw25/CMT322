'use client';

import { useEffect, useRef } from 'react';
import { Callout } from '@/components/ui/callout';

export type ErrorSummaryItem = { fieldId: string; message: string };

type ErrorSummaryProps = {
  title: string;
  intro?: string;
  items: readonly ErrorSummaryItem[];
  /** Focus moves to the summary each time this number changes (the submit count). */
  focusKey: number;
  onItemClick?: (fieldId: string) => void;
};

/**
 * "Fix these before you send" list at the top of a form. Focus moves to it when `focusKey`
 * changes, so a screen reader reads the whole list; each link focuses its field.
 */
export function ErrorSummary({ title, intro, items, focusKey, onItemClick }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusKey > 0) ref.current?.focus();
  }, [focusKey]);

  return (
    <Callout ref={ref} tabIndex={-1} tone="danger" title={title} titleAs="h2">
      {intro ? <p>{intro}</p> : null}
      <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
        {items.map((item) => (
          <li key={item.fieldId}>
            <a
              href={`#${item.fieldId}`}
              onClick={(event) => {
                event.preventDefault();
                onItemClick?.(item.fieldId);
              }}
              className="text-danger-700 underline underline-offset-2 hover:text-gray-900"
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </Callout>
  );
}
