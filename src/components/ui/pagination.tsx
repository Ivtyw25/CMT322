'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type PaginationProps = {
  /** The current page, counted from 1. */
  page: number;
  pageCount: number;
  /** The address of a page, e.g. `(n) => '/traffic/announcements?page=' + n`. */
  hrefFor: (page: number) => string;
  /**
   * Called instead of following the link on a plain click, so the page can update in place
   * (scroll, focus). Modified clicks still open the link.
   */
  onNavigate?: (page: number) => void;
  /** Name of the navigation landmark. Default: "Pagination". */
  label?: string;
  className?: string;
};

type Entry = { kind: 'page'; page: number } | { kind: 'gap'; key: string };

/** Seven pages or fewer: all of them. More: first, last, the current page and its neighbours. */
export function pageEntries(page: number, pageCount: number): Entry[] {
  const shown =
    pageCount <= 7
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [...new Set([1, page - 1, page, page + 1, pageCount])]
          .filter((value) => value >= 1 && value <= pageCount)
          .toSorted((a, b) => a - b);
  const entries: Entry[] = [];
  shown.forEach((value, index) => {
    const before = shown[index - 1];
    if (before !== undefined && value - before > 1) {
      entries.push({ kind: 'gap', key: `gap-${value}` });
    }
    entries.push({ kind: 'page', page: value });
  });
  return entries;
}

const itemClass = cn(
  'hit-area flex size-9 items-center justify-center rounded-lg border border-gray-300 md:after:hidden',
  'type-body-s-medium text-gray-700 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
);

const idleClass = 'hover:bg-gray-50 hover:text-gray-900';
const currentClass = 'border-primary-600 bg-primary-600 text-static-white';
const disabledClass = 'border-gray-100 bg-gray-100 text-gray-400';

type NavigateHandler = (event: React.MouseEvent<HTMLAnchorElement>, page: number) => void;

function StepLink({
  href,
  label,
  page,
  onNavigate,
  children,
}: {
  href: string | null;
  label: string;
  page: number;
  onNavigate: NavigateHandler;
  children: React.ReactNode;
}) {
  return (
    <li>
      {href ? (
        <Link
          href={href}
          aria-label={label}
          onClick={(event) => onNavigate(event, page)}
          className={cn(itemClass, idleClass)}
        >
          {children}
        </Link>
      ) : (
        <span role="img" aria-label={label} className={cn(itemClass, disabledClass)}>
          {children}
        </span>
      )}
    </li>
  );
}

/**
 * Page links under a list: previous, numbers, next. Every page is a real link, so it works
 * without script and the address can be shared.
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  onNavigate,
  label = uiCopy.pagination.label,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const handleClick: NavigateHandler = (event, target) => {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (!onNavigate || modified || event.button !== 0) return;
    event.preventDefault();
    onNavigate(target);
  };
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <StepLink
          href={page > 1 ? hrefFor(page - 1) : null}
          page={page - 1}
          onNavigate={handleClick}
          label={uiCopy.pagination.previous}
        >
          <ChevronLeft aria-hidden className="size-4" />
        </StepLink>
        {pageEntries(page, pageCount).map((entry) =>
          entry.kind === 'gap' ? (
            <li
              key={entry.key}
              aria-hidden
              className="flex size-9 items-center justify-center text-gray-500"
            >
              {uiCopy.pagination.ellipsis}
            </li>
          ) : (
            <li key={entry.page}>
              <Link
                href={hrefFor(entry.page)}
                aria-label={uiCopy.pagination.page(entry.page)}
                aria-current={entry.page === page ? 'page' : undefined}
                onClick={(event) => handleClick(event, entry.page)}
                className={cn(itemClass, entry.page === page ? currentClass : idleClass)}
              >
                {entry.page}
              </Link>
            </li>
          ),
        )}
        <StepLink
          href={page < pageCount ? hrefFor(page + 1) : null}
          page={page + 1}
          onNavigate={handleClick}
          label={uiCopy.pagination.next}
        >
          <ChevronRight aria-hidden className="size-4" />
        </StepLink>
      </ol>
    </nav>
  );
}
