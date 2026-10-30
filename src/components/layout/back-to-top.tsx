'use client';

import { ChevronUp } from 'lucide-react';
import { footerCopy } from '@/content/footer';
import { cn } from '@/lib/cn';

/** Scrolls to the top, then moves focus to the visible header logo so keyboard users start there. */
export function BackToTop({ className }: { className?: string }) {
  function goToTop() {
    window.scrollTo({ top: 0 });
    const logo = Array.from(document.querySelectorAll<HTMLElement>('[data-logo]')).find(
      (candidate) => candidate.getClientRects().length > 0,
    );
    logo?.focus({ preventScroll: true });
  }
  return (
    <button
      type="button"
      onClick={goToTop}
      className={cn(
        'hit-area flex cursor-pointer items-center gap-2 rounded-lg border border-static-white-30 px-3.5 py-2',
        'type-body-s-medium text-static-white transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        'hover:bg-static-glass focus-visible:outline-static-white',
        className,
      )}
    >
      {footerCopy.backToTop}
      <ChevronUp aria-hidden className="size-4" />
    </button>
  );
}
