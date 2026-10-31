import { cva } from 'class-variance-authority';
import { Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

/**
 * The line-rail motif: stops on a vertical line, like stations on the Mutiara Line.
 * `panel` is the lighter 3 px rail in the nav panels; `page` is the 4 px rail on pages.
 */
export type LineRailVariant = 'panel' | 'page';

const railVariants = cva('relative flex flex-col gap-0.5', {
  variants: { variant: { panel: '', page: '' } },
});

const rowVariants = cva(
  [
    'relative z-10 flex items-start rounded-xl px-3 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
  ],
  {
    variants: {
      variant: { panel: 'gap-3.5 py-2.5', page: 'gap-3 py-3' },
      interactive: { true: 'hover:bg-gray-50', false: '' },
      selected: { true: 'bg-primary-50 hover:bg-primary-50', false: '' },
    },
  },
);

/** The connector from this stop down to the next one, drawn on the list item. */
const connectorVariants = cva('relative after:absolute after:z-0 last:after:hidden', {
  variants: {
    variant: {
      panel: 'after:top-5 after:-bottom-5.5 after:left-[20.5px] after:w-[3px] after:bg-primary-200',
      page: 'after:top-6 after:-bottom-6.5 after:left-[22px] after:w-1 after:bg-primary-600',
    },
  },
});

type LineRailProps = {
  variant?: LineRailVariant;
  /** Accessible name of the list, e.g. the group. */
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export function LineRail({ variant = 'panel', label, children, className }: LineRailProps) {
  return (
    <ol
      aria-label={label}
      className={cn(railVariants({ variant }), className)}
      data-variant={variant}
    >
      {children}
    </ol>
  );
}

type LineRailStopProps = {
  variant?: LineRailVariant;
  title: string;
  description?: string;
  /** Station code chip, e.g. "S20". */
  code?: string;
  /** Makes the whole row a link. */
  href?: string;
  /** The first stop of a nav panel is filled; the rest are hollow. */
  filled?: boolean;
  /** Shows the bell for a station the visitor follows. */
  following?: boolean;
  /** The stop picked on the page (About, Route view). */
  selected?: boolean;
  /** The page the visitor is on. */
  current?: boolean;
  onNavigate?: () => void;
  /** Makes the whole row a toggle button (`aria-pressed` follows `selected`). Ignored with `href`. */
  onSelect?: () => void;
  /** Decorative symbols before the chevron (road changes near the stop). */
  glyphs?: React.ReactNode;
  /** Visually hidden text after the title, e.g. "2 road changes nearby". */
  srNote?: string;
};

export function LineRailStop({
  variant = 'panel',
  title,
  description,
  code,
  href,
  filled = false,
  following = false,
  selected = false,
  current = false,
  onNavigate,
  onSelect,
  glyphs,
  srNote,
}: LineRailStopProps) {
  const highlighted = selected || current;
  const body = (
    <>
      <span
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center',
          variant === 'panel' ? 'size-5' : 'size-6',
        )}
      >
        <span
          className={cn(
            'size-3 rounded-full border-2 border-primary-600',
            filled ? 'bg-primary-600' : 'bg-surface',
          )}
        />
      </span>
      {code ? (
        <span className="flex h-6 w-11 shrink-0 items-center justify-center rounded-md bg-primary-600 type-body-xs-semibold text-static-white">
          {code}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            'type-body-m-semibold',
            highlighted ? 'text-primary-700' : 'text-gray-900',
            (href || onSelect) && 'group-hover/stop:text-primary-700',
          )}
        >
          {title}
          {srNote ? <span className="sr-only">{srNote}</span> : null}
        </span>
        {description ? <span className="type-body-s text-gray-600">{description}</span> : null}
      </span>
      {following ? (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Bell aria-hidden className="size-3.5" />
          <span className="sr-only">{uiCopy.station.followingSr}</span>
        </span>
      ) : null}
      {glyphs ? (
        <span aria-hidden className="flex shrink-0 items-center gap-1 self-center">
          {glyphs}
        </span>
      ) : null}
      {(href || onSelect) && variant === 'page' ? (
        <ChevronRight aria-hidden className="mt-0.5 size-4.5 shrink-0 self-center text-gray-400" />
      ) : null}
    </>
  );

  return (
    <li className={connectorVariants({ variant })}>
      {href ? (
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={current ? 'page' : selected ? 'true' : undefined}
          className={cn(
            'group/stop focus-visible:-outline-offset-2',
            rowVariants({ variant, interactive: true, selected: highlighted }),
          )}
        >
          {body}
        </Link>
      ) : onSelect ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={onSelect}
          className={cn(
            'group/stop w-full cursor-pointer text-left focus-visible:-outline-offset-2',
            rowVariants({ variant, interactive: true, selected }),
          )}
        >
          {body}
        </button>
      ) : (
        <div
          aria-current={selected ? 'true' : undefined}
          className={rowVariants({ variant, interactive: false, selected })}
        >
          {body}
        </div>
      )}
    </li>
  );
}
