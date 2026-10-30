'use client';

import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/segmented-control';

type DemoSegmentedProps = {
  legend: string;
  labels: readonly string[];
  /** Index selected first. */
  initial: number;
};

/** A segmented control with its own state, for the gallery. */
export function DemoSegmented({ legend, labels, initial }: DemoSegmentedProps) {
  const [value, setValue] = useState(labels[initial] ?? '');
  return (
    <SegmentedControl
      legend={legend}
      options={labels.map((label) => ({ value: label, label }))}
      value={value}
      onValueChange={setValue}
    />
  );
}
