'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 * Menus in the header open a fixed gap below the header, not below their own button. Radix
 * positions from the button, so this measures how far the button's bottom is above the header's
 * bottom and adds that to the gap. Call `measure` just before the menu opens; a menu that starts
 * open (gallery preview) passes `open` so it is measured on mount.
 */
export function useHeaderMenuOffset(gap: number, open?: boolean) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [sideOffset, setSideOffset] = useState(gap);

  const measure = useCallback(() => {
    const trigger = triggerRef.current;
    const header = trigger?.closest('header');
    if (!trigger || !header) return;
    const below = header.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom;
    setSideOffset(Math.round(below) + gap);
  }, [gap]);

  useLayoutEffect(() => {
    if (open) measure();
  }, [open, measure]);

  return { triggerRef, sideOffset, measure };
}
