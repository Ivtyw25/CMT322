import { usePathname, useSearchParams } from 'next/navigation';

/** A change to the query string: a value sets a param, `null` or `undefined` removes it. */
export type QueryParamUpdate = Readonly<Record<string, string | null | undefined>>;

export type QueryParamWriteOptions = {
  /** `replace` (default) keeps Back leaving the page; `push` adds a history entry. */
  mode?: 'replace' | 'push';
};

/**
 * Reads and writes the query string of the current page, for filters that must be shareable.
 * `defaults` lists the value each param has when it is absent: writing the default (or an empty
 * string) removes the param, so addresses stay short. The hash is kept and the page does not scroll.
 * `get` reads the address as rendered; `read` reads it right now, for code that writes twice in a row.
 *
 * Reads the address with `useSearchParams`, so the component using it must sit under `<Suspense>`.
 */
export function useQueryParams(defaults: Readonly<Record<string, string>> = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function get(key: string): string | null {
    return searchParams.get(key);
  }

  function read(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
  }

  function set(partial: QueryParamUpdate, { mode = 'replace' }: QueryParamWriteOptions = {}) {
    // Read the address itself, so two writes in one event do not undo each other.
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(partial)) {
      if (value === null || value === undefined || value === '' || value === defaults[key]) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    const query = next.toString();
    const url = `${pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    // The native history calls are part of the Next.js router: `useSearchParams` follows them at
    // once, with no round trip to the server and no scroll.
    if (mode === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }

  return { get, read, set };
}
