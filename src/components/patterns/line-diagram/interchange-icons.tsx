import { Bus, Plane, Ship, TrainFront, type LucideIcon } from 'lucide-react';
import type { InterchangeMode } from '@/data/models/station';
import { cn } from '@/lib/cn';

const ICONS: Record<InterchangeMode, LucideIcon> = {
  rail: TrainFront,
  ferry: Ship,
  bus: Bus,
  air: Plane,
};

type InterchangeIconsProps = {
  modes: readonly InterchangeMode[];
  className?: string;
};

/** Small monochrome symbols for other transport at a station. Decorative: the link's name says it. */
export function InterchangeIcons({ modes, className }: InterchangeIconsProps) {
  if (modes.length === 0) return null;
  return (
    <span aria-hidden className={cn('inline-flex gap-0.5 align-middle text-gray-500', className)}>
      {modes.map((mode) => {
        const Icon = ICONS[mode];
        return <Icon key={mode} className="size-3.5" />;
      })}
    </span>
  );
}
