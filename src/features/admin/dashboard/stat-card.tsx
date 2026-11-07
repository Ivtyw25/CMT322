import { cn } from '@/lib/cn';

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  /** Colours the figure and the hint when something needs action or care. */
  tone?: 'default' | 'danger' | 'warning';
  /** Colours only the hint (the developer stats). */
  hintTone?: 'default' | 'warning';
};

const toneText = {
  default: 'text-gray-900',
  danger: 'text-danger-700',
  warning: 'text-warning-700',
};

/** One figure with its label and a short note (Figma "stat/…"). */
export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
  hintTone = 'default',
}: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-gray-200 bg-surface px-5 py-4.5">
      <p className="type-body-s text-gray-600">{label}</p>
      <p className={cn('type-heading-m', toneText[tone])}>{value}</p>
      <p
        className={cn(
          'type-body-xs',
          tone === 'danger'
            ? 'text-danger-700'
            : hintTone === 'warning'
              ? 'text-warning-700'
              : 'text-gray-500',
        )}
      >
        {hint}
      </p>
    </div>
  );
}
