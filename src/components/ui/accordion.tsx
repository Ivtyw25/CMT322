'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type AccordionEntry = {
  /** Also the URL hash that opens the item (#id). */
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: readonly AccordionEntry[];
  /** Ids open on first render. */
  defaultOpenIds?: readonly string[];
  /** Heading level of the item titles. */
  headingAs?: 'h2' | 'h3' | 'h4';
  className?: string;
};

/**
 * Disclosure list: any number of items open at once. Closed content stays in the page
 * (`hidden="until-found"`) so find-in-page opens it, and `#id` links open and scroll to it.
 */
export function Accordion({
  items,
  defaultOpenIds = [],
  headingAs: Heading = 'h3',
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(defaultOpenIds));

  const open = useCallback((id: string) => {
    setOpenIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }, []);

  useEffect(() => {
    function openFromHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !items.some((item) => item.id === id)) return;
      open(id);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [items, open]);

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
  expanded: boolean;
  onToggle: () => void;
  onFound: () => void;
};

function AccordionItem({
  entry,
  heading: Heading,
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
            'flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left',
            'type-body-m-semibold text-gray-900 transition-colors duration-(--duration-fast) hover:text-primary-700',
          )}
        >
          {entry.title}
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
