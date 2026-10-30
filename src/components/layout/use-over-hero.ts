'use client';

import { usePathname } from 'next/navigation';
import { routes } from '@/config/routes';
import { useScrolled } from '@/lib/dom/use-scrolled';

/** Home scroll distance (px) after which the transparent header turns solid. */
const SOLID_AFTER_SCROLL = 8;

/**
 * Home is the only page with a hero behind the header. `isHome` pins the header and notice over
 * the photo; `overHero` is true until the visitor scrolls, when the header must turn solid.
 */
export function useOverHero(): { isHome: boolean; overHero: boolean } {
  const isHome = usePathname() === routes.home;
  const scrolled = useScrolled(SOLID_AFTER_SCROLL);
  return { isHome, overHero: isHome && !scrolled };
}
