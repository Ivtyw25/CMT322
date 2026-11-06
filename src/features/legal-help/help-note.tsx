import { Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

const tones = {
  warning: {
    box: 'border-warning-600 bg-warning-50',
    icon: 'text-warning-600',
    Icon: TriangleAlert,
  },
  info: { box: 'border-primary-600 bg-gray-50', icon: 'text-primary-600', Icon: Info },
} as const;

export function HelpNote({
  tone,
  children,
}: {
  tone: keyof typeof tones;
  children: React.ReactNode;
}) {
  const { box, icon, Icon } = tones[tone];
  return (
    <p
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-3 px-4 py-3.5 type-body-s text-gray-700',
        box,
      )}
    >
      <Icon aria-hidden className={cn('size-4.5 shrink-0', icon)} />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}
