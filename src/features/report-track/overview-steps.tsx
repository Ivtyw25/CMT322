import { reportTrackCopy } from '@/content/report-track';

/** The four steps: vertical on a line below 1024 px, four columns from there. */
export function OverviewSteps() {
  return (
    <ol className="flex flex-col lg:grid lg:grid-cols-4 lg:gap-6">
      {reportTrackCopy.overview.howItWorks.steps.map((step, index) => (
        <li
          key={step.title}
          className="group relative flex gap-3 pb-6 last:pb-0 lg:flex-col lg:gap-2 lg:pb-0"
        >
          <span
            aria-hidden
            className="absolute top-7 -bottom-1 left-3.5 w-0.5 -translate-x-1/2 bg-gray-200 group-last:hidden lg:hidden"
          />
          <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary-600 bg-surface type-body-xs-medium text-primary-700">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1 pt-0.5 lg:pt-0">
            <h3 className="type-body-s-semibold text-gray-900">{step.title}</h3>
            <p className="type-body-s text-gray-600">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
