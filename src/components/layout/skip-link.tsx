import { commonCopy } from '@/content/common';

/** First focusable element on every page. Hidden until focused; jumps to <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-lg bg-primary-600 type-body-s-semibold text-static-white shadow-button focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2.5"
    >
      {commonCopy.skipToContent}
    </a>
  );
}
