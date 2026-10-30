'use client';

import { Search, X } from 'lucide-react';
import { controlVariants } from '@/components/ui/control-styles';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type FaqSearchBarProps = {
  query: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
  /** Enter: the visitor wants the results. */
  onSubmit: () => void;
};

const { search } = projectCopy.faq;

/** The search field and the popular terms under it. Chips fill the field; they are not toggles. */
export function FaqSearchBar({ query, inputRef, onQueryChange, onSubmit }: FaqSearchBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div role="search" className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-gray-500"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          aria-label={search.label}
          placeholder={search.placeholder}
          enterKeyHint="search"
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmit();
            }
            if (event.key === 'Escape' && query) {
              event.preventDefault();
              onQueryChange('');
            }
          }}
          className={cn(
            controlVariants({ tone: 'default' }),
            'h-12.5 rounded-xl pr-12 pl-10',
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label={uiCopy.actions.clearSearch}
            onClick={() => {
              onQueryChange('');
              inputRef.current?.focus();
            }}
            className="hit-area absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-body-s text-gray-600">{search.popularLabel}</span>
        {search.popular.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onQueryChange(term)}
            className="hit-area h-7.5 cursor-pointer rounded-full border border-gray-300 bg-surface px-3.5 type-body-s text-gray-700 transition-colors duration-(--duration-fast) hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
