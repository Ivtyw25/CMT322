'use client';

import { Search } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { projectCopy } from '@/content/project';

type FaqSearchBarProps = {
  query: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
  /** Enter: the visitor wants the results. */
  onSubmit: () => void;
};

const { search } = projectCopy.faq;

/**
 * The search field and the popular terms under it, one swipeable row below 768 px. Chips fill the
 * field; they are not toggles.
 */
export function FaqSearchBar({ query, inputRef, onQueryChange, onSubmit }: FaqSearchBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        inputRef={inputRef}
        value={query}
        onValueChange={onQueryChange}
        onSubmit={onSubmit}
        label={search.label}
        placeholder={search.placeholder}
        icon={<Search />}
      />
      <div className="flex flex-wrap items-center gap-2 max-md:-my-1.5 max-md:scrollbar-none max-md:flex-nowrap max-md:overflow-x-auto max-md:py-1.5">
        <span className="shrink-0 type-body-s whitespace-nowrap text-gray-600">
          {search.popularLabel}
        </span>
        {search.popular.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onQueryChange(term)}
            className="hit-area h-7.5 shrink-0 cursor-pointer rounded-full border border-gray-300 bg-surface px-3.5 type-body-s whitespace-nowrap text-gray-700 transition-colors duration-(--duration-fast) hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
