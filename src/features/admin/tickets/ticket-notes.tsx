'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import type { Ticket } from '@/data/models/ticket';
import { AdminPanel } from '@/features/admin/panel';
import { formatFullDateTime } from '@/lib/format/date-time';
import { useTickets } from '@/lib/tickets';

const copy = adminCopy.ticket.notes;
const MAX = 500;

/** Notes only staff can read (Figma 115:5184). */
export function TicketNotes({ ticket, staff }: { ticket: Ticket; staff: StaffMember }) {
  const { addNote } = useTickets();
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const note = text.trim();

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (note === '' || text.length > MAX) return;
    addNote(ticket.id, note, staff);
    setText('');
    setMessage(copy.added);
  }

  return (
    <AdminPanel
      headingId="notes-heading"
      title={copy.title}
      action={
        <span className="flex shrink-0 items-center gap-1 type-body-xs text-gray-500">
          <Lock aria-hidden className="size-3" />
          {copy.staffOnly}
        </span>
      }
      className="px-6 py-5"
    >
      {ticket.notes.length > 0 ? (
        <ul className="flex flex-col">
          {ticket.notes.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-0.5 border-t border-gray-200 py-3">
              <p className="type-body-s whitespace-pre-line text-gray-900">{entry.text}</p>
              <p className="type-body-xs text-gray-500">
                {copy.byline(entry.author)}
                <span className="sr-only">: </span>
                <span className="ml-2">{formatFullDateTime(entry.at)}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      <form onSubmit={add} className="flex flex-col gap-3">
        <Field label={copy.label} hideLabel>
          <Textarea
            rows={2}
            maxCharacters={MAX}
            placeholder={copy.placeholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setMessage('');
            }}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="secondary" disabled={note === '' || text.length > MAX}>
            {copy.add}
          </Button>
          <p role="status" className="type-body-s text-success-700 empty:hidden">
            {message}
          </p>
        </div>
      </form>
    </AdminPanel>
  );
}
