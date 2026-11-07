'use client';

import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { Button } from './button';

type InputProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'type' | 'className' | 'placeholder' | 'ref' | 'aria-label'
>;

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** Enter or the Search button. */
  onSubmit: () => void;
  /** Accessible name of the field and the search landmark. */
  label: string;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** Decorative icon before the text, hidden when the bar is narrow, like the home hero search. */
  icon?: React.ReactNode;
  /**
   * Extra input attributes, e.g. combobox roles. An `onKeyDown` here runs first; call
   * `preventDefault()` to stop the built-in Escape-to-clear.
   */
  inputProps?: InputProps;
  /** Shown under the bar and positioned against it, e.g. a suggestion list. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * The page search bar in the shape of the home hero search: a pill with a Search button that
 * turns into a round icon button when the bar is narrower than 480 px (a container query, so it
 * also fits a sidebar). Escape clears the text; so does the clear button.
 */
export function SearchBar({
  value,
  onValueChange,
  onSubmit,
  label,
  placeholder,
  inputRef,
  icon,
  inputProps,
  children,
  className,
}: SearchBarProps) {
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? ownRef;
  return (
    <div className={cn('@container relative', className)}>
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
        )}
      >
        {icon ? (
          <span
            aria-hidden
            className="hidden shrink-0 text-gray-500 @min-[30rem]:flex [&_svg]:size-5"
          >
            {icon}
          </span>
        ) : null}
        <input
          enterKeyHint="search"
          spellCheck={false}
          autoComplete="off"
          {...inputProps}
          ref={ref}
          type="search"
          value={value}
          aria-label={label}
          placeholder={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            inputProps?.onKeyDown?.(event);
            if (!event.defaultPrevented && event.key === 'Escape' && value) {
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
              ref.current?.focus();
            }}
            className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
        <Button type="submit" className="shrink-0 @max-[30rem]:size-10 @max-[30rem]:p-0">
          <Search aria-hidden className="size-5 @min-[30rem]:hidden" />
          <span className="@max-[30rem]:sr-only">{uiCopy.actions.search}</span>
        </Button>
      </form>
      {children}
    </div>
  );
}
