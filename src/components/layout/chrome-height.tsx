'use client';

import { useEffect } from 'react';

/**
 * Writes `--chrome-h` on the shell: the height of everything above `<main>` (header and site
 * notice). It follows the header changing at 1024 px and the notice being closed.
 */
export function ChromeHeight() {
  useEffect(() => {
    const main = document.getElementById('main');
    const shell = main?.parentElement;
    if (!main || !shell) return;
    const update = () => shell.style.setProperty('--chrome-h', `${main.offsetTop}px`);
    const resize = new ResizeObserver(update);
    const watchSiblings = () => {
      for (const child of shell.children) {
        if (child !== main) resize.observe(child);
      }
      update();
    };
    const mutation = new MutationObserver(watchSiblings);
    watchSiblings();
    mutation.observe(shell, { childList: true });
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-notice'],
    });
    return () => {
      resize.disconnect();
      mutation.disconnect();
      shell.style.removeProperty('--chrome-h');
    };
  }, []);
  return null;
}
