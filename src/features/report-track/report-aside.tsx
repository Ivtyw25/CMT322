import { Callout } from '@/components/ui/callout';
import { reportTrackCopy } from '@/content/report-track';

const { next, emergency } = reportTrackCopy.report;

/** "What happens next" and the emergency note: the right column from 1280 px, after the form below. */
export function ReportAside() {
  return (
    <div className="flex flex-col gap-6">
      <section aria-label={next.title} className="flex flex-col gap-3">
        <h2 className="type-body-xs-semibold text-gray-900">{next.title}</h2>
        <ol className="flex flex-col gap-3">
          {next.steps.map((step, index) => (
            <li key={step.title} className="flex gap-2.5">
              <span
                aria-hidden
                className="flex size-5.5 shrink-0 items-center justify-center rounded-full border border-primary-600 type-body-xs-medium text-primary-700"
              >
                {index + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="type-body-xs-semibold text-gray-900">{step.title}</span>
                <span className="type-body-xs text-gray-600">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <Callout tone="warning" title={emergency.title}>
        {emergency.body}
      </Callout>
    </div>
  );
}
