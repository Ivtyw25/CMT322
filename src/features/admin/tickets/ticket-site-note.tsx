'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import type { StaffTicket } from '@/data/models/staff-ticket';
import { AdminPanel } from '@/features/admin/panel';
import { useStaffTickets } from './staff-tickets-provider';

const MAX = 500;

/**
 * What the project developer can do on a ticket: add a site note. It lands on the timeline, where
 * the authority sees it before replying to the reporter.
 */
export function TicketSiteNote({ ticket, staff }: { ticket: StaffTicket; staff: StaffMember }) {
  const { record, now } = useStaffTickets();
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const note = text.trim();

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (note === '' || text.length > MAX) return;
    record(ticket.id, {
      events: [
        {
          id: `${ticket.id}-e${ticket.events.length + 1}`,
          at: now(),
          text: adminCopy.ticket.events.siteNote(staff.name, note),
          kind: 'site-note',
        },
      ],
    });
    setText('');
    setMessage(adminCopy.ticket.siteNote.added);
  }

  return (
    <AdminPanel
      headingId="site-note-heading"
      title={adminCopy.ticket.update.readOnlyTitle}
      hint={adminCopy.ticket.update.readOnlyHint}
      className="p-5"
    >
      <form onSubmit={add} className="flex flex-col gap-3">
        <Field label={adminCopy.ticket.siteNote.label} hideLabel>
          <Textarea
            rows={4}
            maxCharacters={MAX}
            placeholder={adminCopy.ticket.siteNote.placeholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setMessage('');
            }}
          />
        </Field>
        <Button type="submit" fullWidth disabled={note === '' || text.length > MAX}>
          {adminCopy.ticket.siteNote.add}
        </Button>
        <p role="status" className="type-body-s text-success-700 empty:hidden">
          {message}
        </p>
      </form>
    </AdminPanel>
  );
}
