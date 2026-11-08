import { cn } from '@/lib/cn';

type StatCardProps = {
  label: string;
  value: string;
  /** Colours the figure when something needs action or care. */
  tone?: 'default' | 'danger' | 'warning';
};

const toneText = {
  default: 'text-gray-900',
  danger: 'text-danger-700',
  warning: 'text-warning-700',
};

/** One figure with its label (Figma "stat/…"). */
export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-gray-200 bg-surface px-5 py-4.5">
      <p className="type-body-s text-gray-600">{label}</p>
      <p className={cn('type-heading-m', toneText[tone])}>{value}</p>
    </div>
  );
}
