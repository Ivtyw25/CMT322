'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { reportTrackCopy } from '@/content/report-track';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';

const { ticket: copy } = reportTrackCopy.submitted;
const COPIED_MS = 2000;

/** Copies the text of the element `valueId`. When the browser refuses, it selects the text instead. */
export function CopyIdButton({ valueId, ticketId }: { valueId: string; ticketId: string }) {
  const announce = useAnnounce();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(ticketId);
      setCopied(true);
      announce(copy.copiedAnnounce);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      const target = document.getElementById(valueId);
      if (target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      announce(
        window.matchMedia('(pointer: coarse)').matches ? copy.copyFailedTouch : copy.copyFailed,
      );
    }
  }

  return (
    <Button variant="secondary" aria-describedby={valueId} onClick={copyId} className="px-3 py-2">
      <span className="grid">
        <span
          className={cn('col-start-1 row-start-1 flex items-center gap-2', copied && 'invisible')}
          aria-hidden={copied || undefined}
        >
          <Copy aria-hidden className="size-4" />
          {copy.copy}
        </span>
        <span
          className={cn(
            'col-start-1 row-start-1 flex items-center justify-center gap-2 text-success-700',
            !copied && 'invisible',
          )}
          aria-hidden={!copied || undefined}
        >
          <Check aria-hidden className="size-4" />
          {copy.copied}
        </span>
      </span>
    </Button>
  );
}
