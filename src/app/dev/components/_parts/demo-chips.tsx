'use client';

import { useState } from 'react';
import { FilterChips } from '@/components/ui/filter-chips';

/** Single-select chips with their own state, for the gallery. */
export function DemoChips({ label, labels }: { label: string; labels: readonly string[] }) {
  const [value, setValue] = useState(labels[0] ?? '');
  return (
    <FilterChips
      label={label}
      options={labels.map((entry) => ({ value: entry, label: entry }))}
      value={value}
      onValueChange={setValue}
    />
  );
}
