'use client';

import { useQueryParams } from '@/lib/url/use-query-params';
import {
  parseHidden,
  parseWhen,
  serialiseHidden,
  type HideKey,
  type TimeWindow,
} from './traffic-filters';

/** The time window and hidden layers of the address; both views write them with `replace`. */
export function useTrafficParams() {
  const params = useQueryParams();
  const when = parseWhen(params.get('when'));
  const hidden = parseHidden(params.get('hide'));
  return {
    params,
    when,
    hidden,
    setWhen: (next: TimeWindow | null) => params.set({ when: next }),
    toggleLayer: (key: HideKey) => {
      // Read the address itself, so two quick toggles do not undo each other.
      const current = parseHidden(params.read('hide'));
      params.set({
        hide: serialiseHidden(
          current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
        ),
      });
    },
  };
}
