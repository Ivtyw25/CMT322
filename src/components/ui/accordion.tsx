'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type AccordionEntry = {
  /** Also the URL hash that opens the item (#id). */
  id: string;
  title: string;
  /** Small label above the title (the FAQ topic). */
  eyebrow?: string;
  /** Open on first render, and when the item first appears in a changing list. */
  defaultOpen?: boolean;
  content: React.ReactNode;
};

type AccordionProps = {
  items: readonly AccordionEntry[];
  /** Ids open on first render. An item's own `defaultOpen` does the same. */
  defaultOpenIds?: readonly string[];
  /**
   * Open this item from code: it opens, scrolls into view and takes focus, like a `#id` link.
   * Changing the value opens another; `null` does nothing.
   */
  openId?: string | null;
  /** Heading level of the item titles. */
  headingAs?: 'h2' | 'h3' | 'h4';
  /** `large` is the FAQ page's question size. */
  size?: 'default' | 'large';
  className?: string;
};

function initiallyOpen(items: readonly AccordionEntry[], ids: readonly string[]): Set<string> {
  return new Set([...ids, ...items.filter((item) => item.defaultOpen).map((item) => item.id)]);
}

/**
 * Disclosure list: any number of items open at once. Closed content stays in the page
 * (`hidden="until-found"`) so find-in-page opens it. `#id` links and `openId` open an item,
 * scroll to it and focus its button. Unknown ids are ignored.
 */
export function Accordion({
  items,
  defaultOpenIds = [],
  openId = null,
  headingAs: Heading = 'h3',
  size = 'default',
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() =>
    initiallyOpen(items, defaultOpenIds),
  );
  const seenIds = useRef<ReadonlySet<string>>(new Set(items.map((item) => item.id)));

  const open = useCallback((id: string) => {
    setOpenIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }, []);

  const focusItem = useCallback((id: string) => {
    requestAnimationFrame(() => {
      const entry = document.getElementById(id);
      entry?.scrollIntoView();
      entry?.querySelector('button')?.focus({ preventScroll: true });
    });
  }, []);

  const reveal = useCallback(
    (id: string) => {
      if (!items.some((item) => item.id === id)) return;
      open(id);
      focusItem(id);
    },
    [items, open, focusItem],
  );

  // Items that join the list later (a filter changed) honour their own `defaultOpen`.
  useEffect(() => {
    const joined = items.filter((item) => !seenIds.current.has(item.id));
    if (joined.length === 0) return;
    seenIds.current = new Set(items.map((item) => item.id));
    const toOpen = joined.filter((item) => item.defaultOpen);
    if (toOpen.length === 0) return;
    setOpenIds((current) => new Set([...current, ...toOpen.map((item) => item.id)]));
  }, [items]);

  useEffect(() => {
    function revealFromHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) reveal(id);
    }
    revealFromHash();
    window.addEventListener('hashchange', revealFromHash);
    return () => window.removeEventListener('hashchange', revealFromHash);
  }, [reveal]);

  // A new `openId` opens its item while rendering (no extra pass), then scrolls and focuses.
  const [requestedId, setRequestedId] = useState<string | null>(null);
  if (openId !== requestedId) {
    setRequestedId(openId);
    if (openId && items.some((item) => item.id === openId)) {
      setOpenIds((current) => new Set(current).add(openId));
    }
  }
  useEffect(() => {
    if (openId) focusItem(openId);
  }, [openId, focusItem]);

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={cn('divide-y divide-gray-200 border-y border-gray-200', className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          entry={item}
          heading={Heading}
          size={size}
          expanded={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
          onFound={() => open(item.id)}
        />
      ))}
    </div>
  );
}

type AccordionItemProps = {
  entry: AccordionEntry;
  heading: 'h2' | 'h3' | 'h4';
  size: 'default' | 'large';
  expanded: boolean;
  onToggle: () => void;
  onFound: () => void;
};

function AccordionItem({
  entry,
  heading: Heading,
  size,
  expanded,
  onToggle,
  onFound,
}: AccordionItemProps) {
  const regionId = useId();
  const regionRef = useRef<HTMLDivElement>(null);

  // Find-in-page fires `beforematch` on a hidden="until-found" element before revealing it.
  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    region.addEventListener('beforematch', onFound);
    return () => region.removeEventListener('beforematch', onFound);
  }, [onFound]);

  // Closed content stays findable: hidden="until-found" (React's types do not know the value yet).
  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    if (expanded) region.removeAttribute('hidden');
    else region.setAttribute('hidden', 'until-found');
  }, [expanded]);

  return (
    <div id={entry.id}>
      <Heading>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={onToggle}
          className={cn(
            'flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left',
            'text-gray-900 transition-colors duration-(--duration-fast) hover:text-primary-700',
            size === 'large'
              ? 'py-4.5 type-body-m-semibold md:type-body-l md:font-semibold'
              : 'py-4 type-body-m-semibold',
          )}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            {entry.eyebrow ? (
              <span className="type-body-xs font-normal text-gray-500">{entry.eyebrow}</span>
            ) : null}
            {entry.title}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              'size-5 shrink-0 text-gray-500 transition-transform duration-(--duration-fast) ease-(--ease-standard)',
              expanded && 'rotate-180',
            )}
          />
        </button>
      </Heading>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-standard)',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div ref={regionRef} id={regionId} className="overflow-hidden">
          <div className="pb-4 type-body-m text-gray-700">{entry.content}</div>
        </div>
      </div>
    </div>
  );
}
