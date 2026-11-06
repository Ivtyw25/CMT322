'use client';

import { useState, useSyncExternalStore } from 'react';
import { SectionBar } from '@/components/layout/section-bar';
import { routes } from '@/config/routes';
import { accountCopy } from '@/content/account';

type Section = { id: string; label: string };

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

export function AccountSectionBar({ items }: { items: readonly Section[] }) {
  const first = items[0]?.id ?? '';
  const [clicked, setClicked] = useState<{ id: string; scroll: number } | null>(null);
  const active = useSyncExternalStore(
    subscribe,
    () => {
      if (clicked && Math.abs(window.scrollY - clicked.scroll) < 2) return clicked.id;
      let current = first;
      const pageOffset =
        Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading) {
          const sectionOffset = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
          if (heading.getBoundingClientRect().top <= pageOffset + sectionOffset + 2)
            current = item.id;
        }
      }
      return current;
    },
    () => first,
  );
  const selected = items.find((item) => item.id === active) ?? items[0];

  return (
    <SectionBar
      groupLabel={accountCopy.account.nav.label}
      pageLabel={selected?.label ?? accountCopy.account.nav.items.details}
      currentHref={routes.withHash(routes.account.profile, active)}
      items={items.map((item) => ({
        label: item.label,
        href: routes.withHash(routes.account.profile, item.id),
      }))}
      onSelect={(href, event) => {
        event.preventDefault();
        const id = href.split('#')[1] ?? first;
        const heading = document.getElementById(id);
        heading?.scrollIntoView({ block: 'start' });
        heading?.focus({ preventScroll: true });
        window.history.pushState(window.history.state, '', href);
        setClicked({ id, scroll: window.scrollY });
      }}
      className="-mx-5 mb-6 md:-mx-8"
    />
  );
}
