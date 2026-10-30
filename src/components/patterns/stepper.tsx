import { Check } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

export type StepState = 'complete' | 'current' | 'upcoming';
export type StepEntry = { id: string; label: string; state: StepState };

const stateLabel = {
  complete: uiCopy.stepper.completed,
  current: uiCopy.stepper.current,
  upcoming: uiCopy.stepper.notStarted,
} as const satisfies Record<StepState, string>;

/**
 * Ticket status steps. Vertical below 1024 px, a row from there. Each step also says its state
 * in text, so colour is never the only signal.
 */
export function Stepper({ steps, className }: { steps: readonly StepEntry[]; className?: string }) {
  return (
    <ol aria-label={uiCopy.stepper.label} className={cn('flex flex-col lg:flex-row', className)}>
      {steps.map((step) => (
        <li
          key={step.id}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className="group relative flex gap-3 pb-6 last:pb-0 lg:flex-1 lg:flex-col lg:gap-2 lg:pb-0"
        >
          <span
            aria-hidden
            className={cn(
              'absolute top-7 -bottom-1 left-3.5 w-0.5 -translate-x-1/2 group-last:hidden',
              step.state === 'complete' ? 'bg-primary-600' : 'bg-gray-300',
              'lg:top-3.5 lg:right-0 lg:bottom-auto lg:left-7 lg:h-0.5 lg:w-auto lg:translate-x-0 lg:-translate-y-1/2',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2',
              step.state === 'complete' && 'border-primary-600 bg-primary-600 text-static-white',
              step.state === 'current' && 'border-primary-600 bg-surface',
              step.state === 'upcoming' && 'border-gray-300 bg-surface',
            )}
          >
            {step.state === 'complete' ? <Check className="size-4" strokeWidth={3} /> : null}
            {step.state === 'current' ? (
              <span className="size-2.5 rounded-full bg-primary-600" />
            ) : null}
          </span>
          <span className="flex flex-col pt-0.5">
            <span
              className={cn(
                'type-body-s-semibold',
                step.state === 'upcoming' ? 'text-gray-500' : 'text-gray-900',
              )}
            >
              {step.label}
            </span>
            <span className="sr-only">{stateLabel[step.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
