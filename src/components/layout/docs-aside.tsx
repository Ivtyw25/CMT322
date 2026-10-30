'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';

export type DocsAsideLink = { id: string; label: string };
/** A section heading, with the headings nested under it (one level). */
export type DocsAsideItem = DocsAsideLink & { children?: readonly DocsAsideLink[] };

/** The scroll-spy line: a section is "current" once its heading is above this many px from the top. */
const SPY_LINE_PX = 140;
const BOTTOM_SLACK_PX = 2;

function activeIdFromPage(ids: readonly string[]): string {
  const first = ids[0] ?? '';
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_SLACK_PX;
  if (atBottom && window.scrollY > 0) return ids[ids.length - 1] ?? first;
  let active = first;
  for (const id of ids) {
    const heading = document.getElementById(id);
    if (heading && heading.getBoundingClientRect().top <= SPY_LINE_PX) active = id;
  }
  return active;
}

function flattenIds(items: readonly DocsAsideItem[]): string[] {
  return items.flatMap((item) => [item.id, ...(item.children ?? []).map((child) => child.id)]);
}

type AsideLinkProps = {
  link: DocsAsideLink;
  active: boolean;
  nested?: boolean;
  onSelect: (id: string) => void;
};

function AsideLink({ link, active, nested = false, onSelect }: AsideLinkProps) {
  return (
    <a
      href={`#${link.id}`}
      aria-current={active ? 'true' : undefined}
      onClick={() => onSelect(link.id)}
      className={cn(
        '-ml-0.5 block border-l-2 py-1.5 transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        nested ? 'pl-7' : 'pl-3.5',
        nested
          ? active
            ? 'type-body-xs-semibold'
            : 'type-body-xs'
          : active
            ? 'type-body-s-medium'
            : 'type-body-s',
        active
          ? 'border-primary-600 text-primary-700'
          : 'border-transparent text-gray-600 hover:text-gray-900',
      )}
    >
      {link.label}
    </a>
  );
}

/**
 * "On this page" list with scroll-spy (Figma 1:332). One link per section heading, with optional
 * nested headings (one level). The items may change after mount (filters): the spy follows.
 */
export function DocsAside({
  items,
  className,
  previewActiveId,
}: {
  items: readonly DocsAsideItem[];
  className?: string;
  /** Gallery only: pin the active item. */
  previewActiveId?: string;
}) {
  const ids = flattenIds(items);
  const idKey = ids.join('|');
  const [clicked, setClicked] = useState<string | null>(null);
  const clickedRef = useRef<string | null>(null);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const sectionIds = idKey ? idKey.split('|') : [];
      const onScroll = () => {
        // The clicked item stays current until the page has scrolled to its section.
        if (clickedRef.current && activeIdFromPage(sectionIds) === clickedRef.current) {
          clickedRef.current = null;
          setClicked(null);
        }
        onChange();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onChange);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onChange);
      };
    },
    [idKey],
  );
  const fromPage = useSyncExternalStore(
    subscribe,
    () => activeIdFromPage(idKey ? idKey.split('|') : []),
    () => idKey.split('|')[0] ?? '',
  );
  const activeId = previewActiveId ?? clicked ?? fromPage;

  function select(id: string) {
    clickedRef.current = id;
    setClicked(id);
    document.getElementById(id)?.focus({ preventScroll: true });
  }

  return (
    <nav aria-label={commonCopy.landmarks.onThisPage} className={className}>
      <p className="mb-3 type-body-xs-semibold text-gray-900">{commonCopy.landmarks.onThisPage}</p>
      <ul className="flex flex-col border-l-2 border-gray-200">
        {items.map((item) => (
          <li key={item.id}>
            <AsideLink link={item} active={item.id === activeId} onSelect={select} />
            {item.children?.length ? (
              <ul>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <AsideLink
                      link={child}
                      active={child.id === activeId}
                      onSelect={select}
                      nested
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
