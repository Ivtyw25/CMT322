import { Check } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/lib/cn';

export type StepState = 'complete' | 'current' | 'upcoming';
export type StepEntry = {
  id: string;
  label: string;
  state: StepState;
  /** `stages` only: a line under the label ("Completed Mar 2025"). */
  detail?: string;
};

const stateLabel = {
  complete: uiCopy.stepper.completed,
  current: uiCopy.stepper.current,
  upcoming: uiCopy.stepper.notStarted,
} as const satisfies Record<StepState, string>;

type StepperProps = {
  steps: readonly StepEntry[];
  /**
   * `status` is the ticket status row (vertical below 1024 px). `stages` is a list that stays
   * vertical at every width, with a detail line per step (station construction stages).
   */
  variant?: 'status' | 'stages';
  /** Name of the list for screen readers. Defaults to "Ticket status". */
  label?: string;
  className?: string;
};

/**
 * Steps with a state each. The state is also written in text, so colour is never the only signal.
 */
export function Stepper({ variant = 'status', ...props }: StepperProps) {
  return variant === 'stages' ? <StageList {...props} /> : <StatusSteps {...props} />;
}

type StepListProps = Omit<StepperProps, 'variant'>;

function StageList({ steps, label = uiCopy.stepper.label, className }: StepListProps) {
  return (
    <ol aria-label={label} className={cn('flex flex-col', className)}>
      {steps.map((step) => (
        <li
          key={step.id}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className="group relative flex gap-3 pb-5 last:pb-0"
        >
          <span
            aria-hidden
            className={cn(
              'absolute top-6 bottom-0 left-3 w-0.5 -translate-x-1/2 group-last:hidden',
              step.state === 'complete' ? 'bg-success-600' : 'bg-gray-200',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2',
              step.state === 'complete' && 'border-success-600 bg-success-600 text-static-white',
              step.state === 'current' && 'border-primary-600 bg-surface',
              step.state === 'upcoming' && 'border-gray-300 bg-surface',
            )}
          >
            {step.state === 'complete' ? <Check className="size-3.5" strokeWidth={3} /> : null}
            {step.state === 'current' ? (
              <span className="size-2.5 rounded-full bg-primary-600" />
            ) : null}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex flex-wrap items-center gap-2">
              <span className="type-body-m-medium text-gray-900">{step.label}</span>
              {step.state === 'current' ? <Tag kind="inProgress" /> : null}
            </span>
            {step.detail ? <span className="type-body-s text-gray-600">{step.detail}</span> : null}
            {/* The current step says "In progress" in its visible tag. */}
            {step.state === 'current' ? null : (
              <span className="sr-only">{stateLabel[step.state]}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StatusSteps({ steps, label = uiCopy.stepper.label, className }: StepListProps) {
  return (
    <ol aria-label={label} className={cn('flex flex-col lg:flex-row', className)}>
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
