'use client';

import { Bell, Folder, LockKeyhole, MapPin, Shield, UserRound } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { accountCopy } from '@/content/account';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';

type Section = { id: string; label: string };
const icons = [UserRound, Folder, MapPin, Bell, LockKeyhole, Shield];

function subscribe(notify: () => void) {
  window.addEventListener('scroll', notify, { passive: true });
  window.addEventListener('resize', notify);
  window.addEventListener('hashchange', notify);
  return () => {
    window.removeEventListener('scroll', notify);
    window.removeEventListener('resize', notify);
    window.removeEventListener('hashchange', notify);
  };
}

export function AccountSidebar({ items }: { items: readonly Section[] }) {
  const first = items[0]?.id ?? '';
  const [clicked, setClicked] = useState<{ id: string; scroll: number } | null>(null);
  const active = useSyncExternalStore(
    subscribe,
    () => {
      if (clicked && Math.abs(window.scrollY - clicked.scroll) < 2) return clicked.id;
      let current = first;
      if (
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      )
        return items.at(-1)?.id ?? first;
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading) continue;
        const pageOffset =
          Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const sectionOffset = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
        if (heading.getBoundingClientRect().top <= pageOffset + sectionOffset + 2)
          current = item.id;
      }
      return current;
    },
    () => first,
  );

  return (
    <nav aria-label={accountCopy.account.nav.label}>
      <p className="mb-2 px-3 type-body-xs-semibold text-gray-500">
        {accountCopy.account.nav.label}
      </p>
      <ul className="flex flex-col">
        {items.map((item, index) => {
          const Icon = icons[index] ?? UserRound;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === active ? 'true' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 type-body-s',
                  item.id === active
                    ? 'bg-primary-50 type-body-s-semibold text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
                onClick={(event) => {
                  if (
                    event.button !== 0 ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  const heading = document.getElementById(item.id);
                  heading?.scrollIntoView({ block: 'start' });
                  heading?.focus({ preventScroll: true });
                  window.history.pushState(
                    null,
                    '',
                    routes.withHash(routes.account.profile, item.id),
                  );
                  setClicked({ id: item.id, scroll: window.scrollY });
                }}
              >
                <Icon aria-hidden className="size-4 shrink-0" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
