'use client';

import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/segmented-control';

type DemoSegmentedProps = {
  legend: string;
  labels: readonly string[];
  /** Index selected first. */
  initial: number;
  orientation?: 'horizontal' | 'vertical' | 'adaptive';
  className?: string;
};

/** A segmented control with its own state, for the gallery. */
export function DemoSegmented({
  legend,
  labels,
  initial,
  orientation,
  className,
}: DemoSegmentedProps) {
  const [value, setValue] = useState(labels[initial] ?? '');
  return (
    <SegmentedControl
      legend={legend}
      options={labels.map((label) => ({ value: label, label }))}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      className={className}
    />
  );
}
