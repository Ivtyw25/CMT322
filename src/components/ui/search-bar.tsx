'use client';

import { Search, X } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { Button } from './button';

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** Enter or the Search button. */
  onSubmit: () => void;
  /** Accessible name of the field and the search landmark. */
  label: string;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Decorative icon before the text, hidden below 640 px like the home hero search. */
  icon?: React.ReactNode;
  className?: string;
};

/**
 * The page search bar in the shape of the home hero search: a pill with a Search button that
 * turns into a round icon button below 640 px. Escape clears the text; so does the clear button.
 */
export function SearchBar({
  value,
  onValueChange,
  onSubmit,
  label,
  placeholder,
  inputRef,
  icon,
  className,
}: SearchBarProps) {
  return (
    <form
      role="search"
      aria-label={label}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn(
        'flex items-center gap-2.5 rounded-full border border-gray-300 bg-surface py-1.5 pr-1.5 pl-5',
        'transition-colors duration-(--duration-fast) hover:border-gray-400',
        'focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600',
        className,
      )}
    >
      {icon ? (
        <span aria-hidden className="hidden shrink-0 text-gray-500 sm:flex [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <input
        ref={inputRef}
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        enterKeyHint="search"
        spellCheck={false}
        autoComplete="off"
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault();
            onValueChange('');
          }
        }}
        className="min-h-10 min-w-0 flex-1 bg-transparent type-body-m text-gray-900 caret-primary-600 outline-none placeholder:text-ellipsis placeholder:text-gray-400 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          aria-label={uiCopy.actions.clearSearch}
          onClick={() => {
            onValueChange('');
            inputRef.current?.focus();
          }}
          className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-primary-600"
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : null}
      <Button type="submit" className="shrink-0 max-sm:size-10 max-sm:p-0">
        <Search aria-hidden className="size-5 sm:hidden" />
        <span className="max-sm:sr-only">{uiCopy.actions.search}</span>
      </Button>
    </form>
  );
}
