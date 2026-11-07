import { siteInfo } from '@/data/mock/site-info';

/**
 * The only external destinations the site may link to (docs/BRIEFING.md §8 and §9).
 * Add a URL here only when the owner has confirmed it.
 */
export const allowedExternalLinks: readonly string[] = [
  siteInfo.careline.tel,
  siteInfo.email.href,
  'https://www.openstreetmap.org/copyright',
];
