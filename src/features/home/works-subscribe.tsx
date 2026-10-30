'use client';

import { Bell, CircleAlert, CircleCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import { subscribeToAlerts } from '@/data/api/alerts';
import type { AreaId } from '@/data/models/area';
import { useSession } from '@/lib/session';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALL_KEY = 'all';

type SubscribeArea = { id: AreaId; label: string } | null;
type SendState = 'idle' | 'sending' | 'failed';
/** What a finished sign-up said, kept per area for this page view. */
type SignedUp = { email: string; areaLabel: string };

function emailError(value: string): string | null {
  const errors = uiCopy.form.errors;
  if (value.trim() === '') return errors.emailRequired;
  return EMAIL_PATTERN.test(value.trim()) ? null : errors.emailInvalid;
}

/** "Get updates for this area": email sign-up for the chosen area. See docs/specs/home.md section 4. */
export function WorksSubscribe({ area }: { area: SubscribeArea }) {
  const copy = homeCopy.works.subscribe;
  const { user } = useSession();
  const [typed, setTyped] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [signedUp, setSignedUp] = useState<Record<string, SignedUp>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const key = area?.id ?? ALL_KEY;
  const done = signedUp[key];
  // A signed-in visitor's address is pre-filled until they type their own.
  const email = typed ?? user?.email ?? '';
  const error = showErrors ? emailError(email) : null;
  const sending = sendState === 'sending';

  const justSignedUp = Boolean(done);
  useEffect(() => {
    if (justSignedUp) messageRef.current?.focus();
  }, [justSignedUp]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setShowErrors(true);
    if (emailError(email)) {
      inputRef.current?.focus();
      return;
    }
    const target = area;
    const sentTo = email.trim();
    setSendState('sending');
    try {
      await subscribeToAlerts(sentTo, target?.id ?? null);
      setSignedUp((previous) => ({
        ...previous,
        [target?.id ?? ALL_KEY]: {
          email: sentTo,
          areaLabel: target?.label ?? copy.allAreasInSentence,
        },
      }));
      setSendState('idle');
    } catch {
      setSendState('failed');
      buttonRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-primary-200 bg-primary-50 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Bell aria-hidden className="size-5 shrink-0 text-primary-700" />
        <h3 className="type-body-m-semibold text-gray-900">
          {area ? copy.title : copy.titleAllAreas}
        </h3>
      </div>
      {done ? (
        <p
          ref={messageRef}
          role="status"
          tabIndex={-1}
          className="flex items-start gap-2.5 type-body-s text-gray-800 transition-opacity duration-(--duration-fast) ease-(--ease-enter) outline-none motion-reduce:transition-none starting:opacity-0"
        >
          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success-600" />
          {copy.success(done.email, done.areaLabel)}
        </p>
      ) : (
        <>
          <p className="type-body-s text-gray-700">
            {area ? copy.text(area.label) : copy.textAllAreas}
          </p>
          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3.5">
            <Field label={copy.emailLabel} hideLabel error={error ?? undefined}>
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
            <Button ref={buttonRef} type="submit" fullWidth loading={sending}>
              {sending ? copy.submitting : copy.submit}
            </Button>
            {sendState === 'failed' ? (
              <p className="flex items-start gap-1.5 type-body-s text-danger-700">
                <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                {copy.sendFailed}
              </p>
            ) : null}
            <p className="type-body-xs text-gray-500">{copy.footnote}</p>
          </form>
        </>
      )}
    </div>
  );
}
