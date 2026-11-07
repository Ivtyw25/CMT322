import { Check } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/lib/cn';

export type StepState = 'complete' | 'current' | 'upcoming';
export type StepEntry = {
  id: string;
  label: string;
  state: StepState;
  /** A line under the label ("Completed Mar 2025", "28 Oct, 14:41"). */
  detail?: string;
};

/**
 * The step to pulse: the current one, or without one the last complete step when the next has not
 * started.
 */
function pulseIndex(steps: readonly StepEntry[]): number {
  const current = steps.findIndex((step) => step.state === 'current');
  if (current >= 0) return current;
  return steps.findIndex(
    (step, index) => step.state === 'complete' && steps[index + 1]?.state === 'upcoming',
  );
}

const stateLabel = {
  complete: uiCopy.stepper.completed,
  current: uiCopy.stepper.current,
  upcoming: uiCopy.stepper.notStarted,
} as const satisfies Record<StepState, string>;

type StepperProps = {
  steps: readonly StepEntry[];
  /**
   * `status` is the ticket status row (vertical below 1024 px). `stages` is a list that stays
   * vertical at every width, with a detail line per step (station construction stages). Both
   * variants show a step's `detail` under its label.
   */
  variant?: 'status' | 'stages';
  /** `status` only: colour of the completed steps and the lines between them. */
  tone?: 'primary' | 'success';
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
  const pulsing = pulseIndex(steps);
  return (
    <ol aria-label={label} className={cn('flex flex-col', className)}>
      {steps.map((step, index) => (
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
              index === pulsing && 'animate-pulse-ring',
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

const completeTone = {
  primary: { line: 'bg-primary-600', dot: 'border-primary-600 bg-primary-600' },
  success: { line: 'bg-success-600', dot: 'border-success-600 bg-success-600' },
} as const;

/** A line is solid when it joins a finished step to one that has been reached. */
function isReached(from: StepEntry | undefined, to: StepEntry | undefined): boolean {
  return from?.state === 'complete' && to !== undefined && to.state !== 'upcoming';
}

const dottedLine = 'border-gray-300 border-dotted';

function StatusSteps({
  steps,
  label = uiCopy.stepper.label,
  tone = 'primary',
  className,
}: StepListProps) {
  const lastIndex = steps.length - 1;
  const pulsing = pulseIndex(steps);
  return (
    <ol
      aria-label={label}
      style={
        {
          '--steps-columns': `1fr repeat(${Math.max(steps.length - 2, 0)}, 2fr) 1fr`,
        } as React.CSSProperties
      }
      className={cn('flex flex-col lg:grid lg:grid-cols-(--steps-columns)', className)}
    >
      {steps.map((step, index) => {
        const before = isReached(steps[index - 1], step);
        const after = isReached(step, steps[index + 1]);
        return (
          <li
            key={step.id}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className="group relative flex gap-3 pb-6 last:pb-0 lg:flex-col lg:items-center lg:gap-2 lg:pb-0 lg:text-center lg:first:items-start lg:first:text-left lg:last:items-end lg:last:text-right"
          >
            <span
              aria-hidden
              className={cn(
                'absolute top-7 -bottom-1 left-3.5 w-0.5 -translate-x-1/2 group-last:hidden lg:hidden',
                after ? completeTone[tone].line : 'border-l-2 border-dotted border-gray-300',
              )}
            />
            <span aria-hidden className="relative z-10 flex shrink-0 items-center lg:w-full">
              {index > 0 ? (
                <span
                  className={cn(
                    'mr-1.5 hidden h-0.5 flex-1 lg:block',
                    before ? completeTone[tone].line : cn('border-t-2', dottedLine),
                  )}
                />
              ) : null}
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border-2 lg:size-6',
                  step.state === 'complete' && [completeTone[tone].dot, 'text-static-white'],
                  step.state === 'current' && 'border-primary-600 bg-surface',
                  step.state === 'upcoming' && 'border-gray-300 bg-surface',
                  index === pulsing && 'animate-pulse-ring',
                )}
              >
                {step.state === 'complete' ? <Check className="size-4" strokeWidth={3} /> : null}
                {step.state === 'current' ? (
                  <span className="size-2.5 rounded-full bg-primary-600" />
                ) : null}
              </span>
              {index < lastIndex ? (
                <span
                  className={cn(
                    'ml-1.5 hidden h-0.5 flex-1 lg:block',
                    after ? completeTone[tone].line : cn('border-t-2', dottedLine),
                  )}
                />
              ) : null}
            </span>
            <span className="flex flex-col pt-0.5 lg:pt-0">
              <span
                className={cn(
                  'type-body-s-semibold',
                  step.state === 'current' ? 'text-primary-700' : 'text-gray-900',
                  step.state === 'complete' && tone === 'success' && 'text-success-700',
                )}
              >
                {step.label}
              </span>
              {step.detail ? (
                <span className="type-body-xs text-gray-600">{step.detail}</span>
              ) : null}
              <span className="sr-only">{stateLabel[step.state]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
