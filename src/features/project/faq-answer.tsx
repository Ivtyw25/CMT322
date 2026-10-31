import { PageFeedback } from '@/components/patterns/page-feedback';
import { ButtonLink } from '@/components/ui/button-link';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { FaqItem } from '@/data/models/faq';
import { formatDate } from '@/lib/format/dates';

const { item: copy } = projectCopy.faq;

/** An open FAQ item: short answer in bold, the rest, next steps and its own feedback row. */
export function FaqAnswer({ item }: { item: FaqItem }) {
  const [short, ...rest] = item.answer;
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-col gap-3">
        {short ? <p className="type-body-m-semibold text-gray-900">{short}</p> : null}
        {rest.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {item.nextSteps.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
          <p className="type-body-s-semibold text-gray-900">{copy.nextSteps}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {item.nextSteps.map((step) => (
              <ButtonLink
                key={step.label}
                href={step.href}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {step.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      ) : null}
      <PageFeedback
        size="sm"
        question={copy.feedback.question}
        thanks={copy.feedback.thanks}
        reasonsLabel={copy.feedback.reasonsLabel}
        reasons={copy.feedback.reasons}
        thanksReason={copy.feedback.thanksReason}
        trailing={uiCopy.time.updatedOn(formatDate(item.updatedAt))}
      />
    </div>
  );
}
