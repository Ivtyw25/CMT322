'use client';

import { Button } from '@/components/ui/button';
import { devCopy } from '@/content/dev';
import { useQueryParams } from '@/lib/url/use-query-params';

const copy = devCopy.traffic;
const DEFAULTS = { when: 'now' } as const;

/** Buttons that write `when` and `hide` with the hook, and the values read back. */
export function DemoQueryParams() {
  const params = useQueryParams(DEFAULTS);
  const when = params.get('when') ?? DEFAULTS.when;
  const hide = params.get('hide') ?? copy.queryNone;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={() => params.set({ when: 'now' })}>
        {copy.queryNow}
      </Button>
      <Button variant="secondary" onClick={() => params.set({ when: 'week' })}>
        {copy.queryWeek}
      </Button>
      <Button variant="secondary" onClick={() => params.set({ hide: 'closure' })}>
        {copy.queryHide}
      </Button>
      <p role="status" className="type-body-s text-gray-700">
        {copy.queryShow(when, hide)}
      </p>
    </div>
  );
}
