'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { navCopy } from '@/content/nav';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/lib/dom/use-media-query';

export type SectionBarItem = { label: string; href: string };

type SectionBarProps = {
  /** The group the page belongs to, e.g. "Project". */
  groupLabel: string;
  /** The page the visitor is on, e.g. "About the line". */
  pageLabel: string;
  /** The pages of this group only; the drawer offers the other groups. */
  items: readonly SectionBarItem[];
  /** Route of the current page, for the highlighted row. */
  currentHref: string;
  /** Gallery only: open or closed, and no sticky position. */
  preview?: { open: boolean };
  className?: string;
};

/** Mobile docs navigation (Figma 129:6117): replaces the sidebar below 1024 px. */
export function SectionBar({
  groupLabel,
  pageLabel,
  items,
  currentHref,
  preview,
  className,
}: SectionBarProps) {
  const pathname = usePathname();
  const wide = useMediaQuery('(min-width: 64rem)');
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = preview ? preview.open : !wide && openedOn === pathname;

  useEffect(() => {
    if (preview || !open) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpenedOn(null);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [preview, open]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpenedOn(null);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      ref={rootRef}
      data-section-bar={preview ? undefined : ''}
      data-shell-inert={preview ? undefined : ''}
      onKeyDown={onKeyDown}
      className={cn('z-30', preview ? 'relative' : 'sticky top-15.25 lg:hidden', className)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpenedOn(open ? null : pathname)}
        className={cn(
          'flex min-h-11 w-full cursor-pointer items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-5 py-3 text-left @min-[48rem]:px-8',
          'type-body-s transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-gray-100',
        )}
      >
        <span className="sr-only">{navCopy.sectionBarPrefix} </span>
        <span className="shrink-0 text-gray-500">{groupLabel}</span>
        <span aria-hidden className="shrink-0 text-gray-400">
          /
        </span>
        <span className="min-w-0 flex-1 truncate type-body-s-semibold text-gray-900">
          {pageLabel}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-4.5 shrink-0 text-gray-500 transition-transform duration-(--duration-fast) ease-(--ease-standard)',
            open && 'rotate-180',
          )}
        />
      </button>
      {open ? (
        <nav
          id={panelId}
          aria-label={groupLabel}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-6.5625rem)] animate-panel-in overflow-y-auto overscroll-contain border-b border-gray-200 bg-surface px-5 py-2 shadow-drawer @min-[48rem]:px-8"
        >
          <ul>
            {items.map((item) => {
              const current = item.href === currentHref;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpenedOn(null)}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      '-mx-2 flex min-h-11 items-center gap-2 rounded-lg px-2 py-2.5 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2',
                      current
                        ? 'type-body-m-semibold text-primary-700'
                        : 'type-body-m-medium text-gray-900',
                    )}
                  >
                    <span className="min-w-0 flex-1">{item.label}</span>
                    <ChevronRight
                      aria-hidden
                      className={cn(
                        'mt-0.75 size-4.5 shrink-0 self-start',
                        current ? 'text-primary-700' : 'text-gray-400',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
