'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';

export type DocsAsideItem = { id: string; label: string };

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

/** "On this page" list with scroll-spy (Figma 1:332). One link per section heading. */
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
  const ids = items.map((item) => item.id);
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

  return (
    <nav aria-label={commonCopy.landmarks.onThisPage} className={className}>
      <p className="mb-3 type-body-xs-semibold text-gray-900">{commonCopy.landmarks.onThisPage}</p>
      <ul className="flex flex-col border-l-2 border-gray-200">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  clickedRef.current = item.id;
                  setClicked(item.id);
                  document.getElementById(item.id)?.focus({ preventScroll: true });
                }}
                className={cn(
                  '-ml-0.5 block border-l-2 py-1.5 pl-3.5 type-body-s transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                  active
                    ? 'border-primary-600 type-body-s-medium text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900',
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
