/** Ids of the "Works in your area" section and its heading: search and the Try chips point at them. */
export const WORKS_SECTION_ID = 'works';
export const WORKS_HEADING_ID = 'works-heading';

/** Smooth scrolling unless the visitor asked for less motion. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/** Brings the Works section into view and moves focus to its heading (no visible ring). */
export function revealWorks(): void {
  document.getElementById(WORKS_SECTION_ID)?.scrollIntoView({ behavior: scrollBehavior() });
  document.getElementById(WORKS_HEADING_ID)?.focus({ preventScroll: true });
}
