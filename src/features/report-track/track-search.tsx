'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { normaliseTicketId, ticketIdProblem, type TicketIdProblem } from '@/lib/reports';
import { markSearchSubmitted } from './track-arrival';

const { search, errors } = reportTrackCopy.track;
export const TRACK_INPUT_NAME = 'ticket-id';
const MAX_LENGTH = 24;

const problemText: Record<TicketIdProblem, string> = {
  empty: errors.empty,
  invalid: errors.invalid,
};

type TrackSearchProps = {
  /** The ID as written in the address, or empty on /track. */
  initialValue: string;
};

/** The ticket ID search. Valid IDs go to /track/[id]; checked on blur (when filled) and on submit. */
export function TrackSearch({ initialValue }: TrackSearchProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);
  const [problem, setProblem] = useState<TicketIdProblem | null>(() =>
    initialValue === '' ? null : ticketIdProblem(normaliseTicketId(initialValue)),
  );

  function check(raw: string) {
    const normalised = normaliseTicketId(raw);
    setValue(normalised);
    const found = ticketIdProblem(normalised);
    setProblem(found);
    return { normalised, found };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const { normalised, found } = check(value);
    if (found) {
      input.current?.focus();
      return;
    }
    markSearchSubmitted();
    startTransition(() => router.push(routes.reportTrack.ticket(normalised)));
  }

  return (
    <form role="search" aria-label={search.formLabel} onSubmit={handleSubmit} noValidate>
      <Field
        label={search.label}
        hint={search.hint}
        error={problem ? problemText[problem] : undefined}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <TextInput
            ref={input}
            name={TRACK_INPUT_NAME}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={(event) => {
              if (event.target.value.trim() !== '') check(event.target.value);
            }}
            placeholder={search.placeholder}
            leadingIcon={<Search className="size-4.5" />}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            maxLength={MAX_LENGTH}
            className="md:flex-1"
          />
          <Button type="submit" loading={pending} className="md:shrink-0">
            {pending ? search.searching : search.submit}
          </Button>
        </div>
      </Field>
    </form>
  );
}
