'use client';

import { useEffect } from 'react';

/**
 * Gallery previews keep a menu open, and Radix moves focus into an open menu. This hands focus
 * back to the page so a preview never steals it. A no-op unless `enabled`.
 */
export function useReleaseFocus(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest('[role="menu"]')) active.blur();
    }, 50);
    return () => clearTimeout(timer);
  }, [enabled]);
}
