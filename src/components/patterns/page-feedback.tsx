'use client';

import { CircleCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type FeedbackStatus = 'asking' | 'reasons' | 'thanks' | 'thanksReason';

type PageFeedbackProps = {
  /** `sm` is the per-answer variant (32 px buttons) used inside the FAQ accordion. */
  size?: 'default' | 'sm';
  /** Defaults to "Was this page helpful?". */
  question?: string;
  /** Shown after Yes. Defaults to "Thanks for your feedback.". */
  thanks?: string;
  reasonsLabel?: string;
  reasons?: readonly string[];
  /** Shown after a reason is chosen. */
  thanksReason?: string;
  /** Extra text after the buttons, e.g. "Last updated 22 Oct 2026". Hidden once thanked. */
  trailing?: React.ReactNode;
  /** Thumbs on the Yes and No buttons, as on the docs pages. */
  icons?: boolean;
  className?: string;
};

const answerClass = cn(
  'hit-area inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-4',
  'type-body-s-semibold transition-colors duration-(--duration-fast) ease-(--ease-standard)',
  'border-gray-300 bg-surface text-gray-800 hover:border-gray-400 hover:bg-gray-50',
  'aria-pressed:border-gray-900 aria-pressed:bg-gray-900 aria-pressed:text-surface',
);

/**
 * "Was this page helpful?" Yes thanks you; No asks why with three chips, then thanks you.
 * Nothing is sent (mock). The state lives for this page view. Focus follows the change:
 * to the thanks message, or to the first reason.
 */
export function PageFeedback({
  size = 'default',
  question = uiCopy.docsPage.feedback.question,
  thanks = uiCopy.docsPage.feedback.thanks,
  reasonsLabel = uiCopy.docsPage.feedback.reasonsLabel,
  reasons = uiCopy.docsPage.feedback.reasons,
  thanksReason = uiCopy.docsPage.feedback.thanksReason,
  trailing,
  icons = false,
  className,
}: PageFeedbackProps) {
  const [status, setStatus] = useState<FeedbackStatus>('asking');
  const thanksRef = useRef<HTMLParagraphElement>(null);
  const firstReasonRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    if (status === 'reasons') firstReasonRef.current?.focus();
    if (status === 'thanks' || status === 'thanksReason') thanksRef.current?.focus();
  }, [status]);

  function choose(next: FeedbackStatus) {
    moveFocus.current = true;
    setStatus(next);
  }

  const thanked = status === 'thanks' || status === 'thanksReason';
  const feedback = uiCopy.docsPage.feedback;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {thanked ? (
        <p
          ref={thanksRef}
          role="status"
          tabIndex={-1}
          className="flex items-center gap-2 type-body-s text-gray-700 outline-none"
        >
          <CircleCheck aria-hidden className="size-4 shrink-0 text-success-600" />
          {status === 'thanks' ? thanks : thanksReason}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="type-body-s text-gray-700">{question}</p>
          <div role="group" aria-label={question} className="flex gap-2">
            <button
              type="button"
              onClick={() => choose('thanks')}
              className={cn(answerClass, size === 'sm' ? 'h-8' : 'h-8.5')}
            >
              {icons ? <ThumbsUp aria-hidden className="size-4" /> : null}
              {feedback.yes}
            </button>
            <button
              type="button"
              aria-pressed={status === 'reasons'}
              onClick={() => choose('reasons')}
              className={cn(answerClass, size === 'sm' ? 'h-8' : 'h-8.5')}
            >
              {icons ? <ThumbsDown aria-hidden className="size-4" /> : null}
              {feedback.no}
            </button>
          </div>
          {trailing ? (
            <>
              <span aria-hidden className="hidden h-2.5 w-px bg-gray-300 sm:block" />
              <span className="type-body-xs text-gray-500">{trailing}</span>
            </>
          ) : null}
        </div>
      )}
      {status === 'reasons' ? (
        <div role="group" aria-label={reasonsLabel} className="flex flex-wrap items-center gap-2">
          <p aria-hidden className="type-body-xs text-gray-600">
            {reasonsLabel}
          </p>
          {reasons.map((reason, index) => (
            <button
              key={reason}
              ref={index === 0 ? firstReasonRef : undefined}
              type="button"
              onClick={() => choose('thanksReason')}
              className={cn(
                'hit-area inline-flex h-6.5 cursor-pointer items-center rounded-full border px-3',
                'border-gray-200 bg-surface type-body-xs-medium text-gray-700',
                'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:border-gray-400',
              )}
            >
              {reason}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
