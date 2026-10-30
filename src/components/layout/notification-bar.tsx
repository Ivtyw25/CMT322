'use client';

import { TriangleAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { routes } from '@/config/routes';
import { commonCopy } from '@/content/common';
import { notificationCopy } from '@/content/notifications';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/cn';
import { readStorage, removeStorage, writeStorage } from '@/lib/dom/safe-storage';
import { NOTICE_DISMISSED_KEY } from '@/lib/theme/theme-script';
import { useOverHero } from './use-over-hero';

export type NoticeView = { id: string; title: string; message: string };

type NotificationBarProps = {
  notice: NoticeView;
  /** Gallery only: force the look and skip the Home placement. */
  preview?: 'solid' | 'hero';
};

const FADE_MS = 150;

const listeners = new Set<() => void>();
const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};
const notifyAll = () => listeners.forEach((notify) => notify());

/** Remembers a dismissal for this page view when sessionStorage is blocked. */
let dismissedInMemory: string | null = null;

const readDismissedId = () => readStorage('session', NOTICE_DISMISSED_KEY) ?? dismissedInMemory;
const readDismissedOnServer = (): string | null => null;

/** True once a notice has been dismissed in this session. The gallery uses it to enable its reset. */
export function useNoticeDismissed(): boolean {
  return useSyncExternalStore(subscribe, readDismissedId, readDismissedOnServer) !== null;
}

/** Lets the gallery show a dismissed notice again. */
export function resetNoticeDismissal(): void {
  dismissedInMemory = null;
  removeStorage('session', NOTICE_DISMISSED_KEY);
  delete document.documentElement.dataset.notice;
  notifyAll();
}

/**
 * The single site notice under the header (Figma 4:750 / 127:5800). Closing it hides it for
 * this browser session; a notice with a different id shows again. The head script hides a
 * dismissed notice before first paint, so it never flashes back.
 */
export function NotificationBar({ notice, preview }: NotificationBarProps) {
  const { isHome } = useOverHero();
  const savedId = useSyncExternalStore(subscribe, readDismissedId, readDismissedOnServer);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!preview && savedId === notice.id) return null;

  const overHero = preview ? preview === 'hero' : isHome;

  function dismiss() {
    setFading(true);
    document.getElementById('main')?.focus();
    timer.current = setTimeout(() => {
      dismissedInMemory = notice.id;
      writeStorage('session', NOTICE_DISMISSED_KEY, notice.id);
      setFading(false);
      notifyAll();
    }, FADE_MS);
  }

  return (
    <section
      aria-label={commonCopy.landmarks.siteNotice}
      data-notice-bar=""
      data-notice-id={notice.id}
      data-shell-inert=""
      className={cn(
        '@container border-b',
        overHero
          ? 'border-static-white/15 bg-static-scrim-bar backdrop-blur-bar'
          : 'border-warning-100 bg-warning-50',
        !preview && isHome && 'absolute inset-x-0 top-header-mobile z-30 mt-px lg:top-header',
        fading && 'animate-fade-out',
      )}
    >
      <div className="ps-4 pe-2 md:ps-8 md:pe-6 @min-[64rem]:px-10">
        <div className="mx-auto flex max-w-content items-start gap-2.5 py-2.5 @min-[64rem]:gap-3 @min-[64rem]:py-3">
          <span className="flex h-7.5 shrink-0 items-start pt-1 @min-[64rem]:items-center @min-[64rem]:pt-0">
            <TriangleAlert
              aria-hidden
              className={cn('size-4.5', overHero ? 'text-static-white' : 'text-warning-700')}
            />
          </span>
          <div className="flex min-h-7.5 min-w-0 flex-1 flex-col items-start justify-center gap-0.5 type-body-s @min-[64rem]:block">
            <span
              className={cn(
                'type-body-s-semibold @min-[64rem]:hidden',
                overHero ? 'text-static-amber' : 'text-warning-700',
              )}
            >
              {notice.title}
            </span>
            <span
              className={cn(
                'mr-1.5 hidden type-body-s-semibold @min-[64rem]:inline',
                overHero ? 'text-static-amber' : 'text-warning-700',
              )}
            >
              {notificationCopy.titleInline(notice.title)}
            </span>
            <span
              className={cn(
                '@min-[64rem]:mr-1.5',
                overHero ? 'text-static-white' : 'text-gray-800',
              )}
            >
              {notice.message}
            </span>
            <Link
              href={routes.traffic.announcements}
              className={cn(
                'hit-area type-body-s-semibold underline decoration-1 underline-offset-2 hover:decoration-2',
                overHero
                  ? 'text-static-amber focus-visible:outline-static-white'
                  : 'text-warning-700',
              )}
            >
              {notificationCopy.viewDetails}
              <VisuallyHidden>{notificationCopy.viewDetailsContext(notice.title)}</VisuallyHidden>
            </Link>
          </div>
          <button
            type="button"
            aria-label={notificationCopy.dismiss}
            onClick={dismiss}
            className={cn(
              'hit-area flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-md',
              'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
              overHero
                ? 'text-static-white hover:bg-static-glass focus-visible:outline-static-white'
                : 'text-gray-600 hover:bg-warning-100',
            )}
          >
            <X aria-hidden className="size-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
