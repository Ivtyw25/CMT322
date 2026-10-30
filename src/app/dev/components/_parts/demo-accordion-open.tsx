'use client';

import { useState } from 'react';
import { Accordion, type AccordionEntry } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

type DemoAccordionOpenProps = {
  items: readonly AccordionEntry[];
  /** The item the button opens. */
  targetId: string;
  buttonLabel: string;
};

/** An accordion that a button opens from code (the `openId` prop), for the gallery. */
export function DemoAccordionOpen({ items, targetId, buttonLabel }: DemoAccordionOpenProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-4">
      <Button variant="secondary" className="self-start" onClick={() => setOpenId(targetId)}>
        {buttonLabel}
      </Button>
      <Accordion items={items} openId={openId} />
    </div>
  );
}
