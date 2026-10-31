'use client';

import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { uiCopy } from '@/content/ui';
import { TextInput, type TextInputProps } from './text-input';

type SearchInputProps = Omit<TextInputProps, 'type' | 'leadingIcon' | 'trailing' | 'value'> & {
  /** The search is controlled: the clear button appears when this is not empty. */
  value: string;
  /** Called by the clear button. Focus returns to the field. */
  onClear: () => void;
};

/** Search field: a search icon, and a "Clear search" button once there is text. */
export function SearchInput({ value, onClear, ...props }: SearchInputProps) {
  const field = useRef<HTMLInputElement | null>(null);
  return (
    <TextInput
      autoComplete="off"
      {...props}
      ref={field}
      type="search"
      value={value}
      leadingIcon={<Search className="size-4.5" />}
      trailing={
        value === '' ? undefined : (
          <button
            type="button"
            aria-label={uiCopy.form.search.clear}
            onClick={() => {
              onClear();
              field.current?.focus();
            }}
            className="hit-area flex size-9 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors duration-(--duration-fast) hover:text-gray-900"
          >
            <X aria-hidden className="size-4" />
          </button>
        )
      }
    />
  );
}
