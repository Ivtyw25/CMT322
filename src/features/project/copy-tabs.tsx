'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type CopyTab = { id: string; label: string; content: React.ReactNode };

type CopyTabsProps = {
  /** Accessible name of the tab list. */
  label: string;
  tabs: readonly CopyTab[];
  /** Shown under the panel, the same for every tab. */
  children?: React.ReactNode;
};

/** Underline tabs whose panels are short text. Not deep-linked. The first tab is selected. */
export function CopyTabs({ label, tabs, children }: CopyTabsProps) {
  const [value, setValue] = useState(tabs[0]?.id ?? '');
  return (
    <div className="flex flex-col gap-5">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label={label}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            tabIndex={0}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
      {children}
    </div>
  );
}
