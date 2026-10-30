'use client';

import { Bell, CircleAlert, CircleCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { footerCopy } from '@/content/footer';
import { subscribeToAlerts } from '@/data/api/alerts';
import type { AreaId } from '@/data/models/area';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { useSession } from '@/lib/session';

const ALL_AREAS = 'all';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AreaOption = { id: AreaId; label: string };
type FormState = 'idle' | 'sending' | 'success' | 'failed';

type NewsletterFormProps = {
  areas: readonly AreaOption[];
  /** Gallery only: start in a given state with a given address. */
  preview?: { state: FormState; email: string; showError?: boolean };
};

function emailError(value: string): string | null {
  const copy = footerCopy.newsletter.errors;
  if (value.trim() === '') return copy.emailRequired;
  return EMAIL_PATTERN.test(value.trim()) ? null : copy.emailInvalid;
}

/**
 * "Get road change alerts by email" (footer). Checks the address on submit, then live; the mock
 * sign-up takes about 600 ms. An address ending in @fail.test fails, to show the error state.
 */
export function NewsletterForm({ areas, preview }: NewsletterFormProps) {
  const copy = footerCopy.newsletter;
  const { user } = useSession();
  const [typed, setTyped] = useState<string | null>(preview?.email ?? null);
  const [areaValue, setAreaValue] = useState<string>(ALL_AREAS);
  const [showErrors, setShowErrors] = useState(Boolean(preview?.showError));
  const [state, setState] = useState<FormState>(preview?.state ?? 'idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  // The address is pre-filled for a signed-in visitor until they type their own.
  const email = typed ?? user?.email ?? '';
  const error = showErrors ? emailError(email) : null;
  const sending = state === 'sending';
  const areaLabel =
    areaValue === ALL_AREAS
      ? copy.allAreasInSentence
      : (areas.find((area) => area.id === areaValue)?.label ?? copy.allAreasInSentence);

  useEffect(() => {
    if (state === 'success' && !preview) messageRef.current?.focus();
    if (state === 'failed' && !preview) buttonRef.current?.focus();
  }, [state, preview]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setShowErrors(true);
    if (emailError(email)) {
      inputRef.current?.focus();
      return;
    }
    setState('sending');
    try {
      await subscribeToAlerts(email.trim(), areaValue === ALL_AREAS ? null : (areaValue as AreaId));
      setState('success');
    } catch {
      setState('failed');
    }
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-static-glass-subtle p-4 @min-[48rem]:gap-4 @min-[48rem]:rounded-none @min-[48rem]:bg-transparent @min-[48rem]:p-0 @min-[64rem]:flex-row @min-[64rem]:items-center @min-[64rem]:gap-12">
      <div className="flex gap-3.5 @min-[64rem]:flex-1">
        <span
          aria-hidden
          className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-700 @min-[48rem]:flex"
        >
          <Bell className="size-5.5" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="type-body-s-semibold text-static-white @min-[48rem]:type-heading-3xs">
            {copy.title}
          </h2>
          <p className="type-body-xs text-static-on-navy-200 @min-[48rem]:hidden">
            {copy.bodyMobile}
          </p>
          <p className="hidden type-body-s text-static-on-navy-200 @min-[48rem]:block">
            {copy.body}
          </p>
        </div>
      </div>

      {state === 'success' ? (
        <p
          ref={messageRef}
          role="status"
          tabIndex={-1}
          className="flex items-start gap-2.5 type-body-s-medium text-static-white"
        >
          <CircleCheck aria-hidden className="mt-px size-5 shrink-0" />
          {copy.success(email.trim(), areaLabel)}
        </p>
      ) : (
        <form
          noValidate
          onSubmit={onSubmit}
          className="flex flex-col gap-2.5 @min-[48rem]:gap-2 @min-[64rem]:shrink-0"
        >
          <div className="flex flex-col gap-2.5 @min-[48rem]:flex-row @min-[48rem]:items-start @min-[48rem]:gap-2">
            <Field
              label={copy.emailLabel}
              hideLabel
              tone="onNavy"
              error={error ?? undefined}
              className="@min-[48rem]:w-full @min-[64rem]:w-70"
            >
              <TextInput
                ref={inputRef}
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder={copy.emailPlaceholder}
                value={email}
                disabled={sending}
                onChange={(event) => setTyped(event.target.value)}
              />
            </Field>
            <Field
              label={copy.areaLabel}
              hideLabel
              tone="onNavy"
              className="hidden @min-[48rem]:block @min-[48rem]:shrink-0 @min-[48rem]:[&_select]:field-sizing-content @min-[48rem]:[&_select]:pr-9"
            >
              <Select
                name="area"
                value={areaValue}
                disabled={sending}
                onChange={(event) => setAreaValue(event.target.value)}
                options={[
                  { value: ALL_AREAS, label: copy.allAreasOption },
                  ...areas.map((area) => ({ value: area.id, label: area.label })),
                ]}
              />
            </Field>
            <Button
              ref={buttonRef}
              type="submit"
              variant="secondary"
              loading={sending}
              fullWidth
              className="@min-[48rem]:w-auto @min-[48rem]:shrink-0"
            >
              {sending ? copy.submitting : copy.submit}
            </Button>
          </div>
          {state === 'failed' ? (
            <p className="flex items-start gap-1.5 type-body-s text-static-amber">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {copy.errors.sendFailed}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
