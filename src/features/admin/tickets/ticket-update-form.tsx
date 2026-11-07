'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { Textarea } from '@/components/ui/textarea';
import { adminCopy } from '@/content/admin';
import type {
  StaffTicket,
  StaffTicketEvent,
  StaffTicketStatus,
  TicketPriority,
} from '@/data/models/staff-ticket';
import type { StaffMember } from '@/data/models/staff';
import { useStaffTickets } from './staff-tickets-provider';

const copy = adminCopy.ticket.update;
const NONE = 'none';

const statusChoices: readonly SegmentedOption<StaffTicketStatus>[] = [
  { value: 'pending', label: copy.statusOptions.pending },
  { value: 'in-progress', label: copy.statusOptions['in-progress'] },
  { value: 'resolved', label: copy.statusOptions.resolved },
];

const priorityChoices = [
  { value: 'normal', label: copy.priorityOptions.normal },
  { value: 'high', label: copy.priorityOptions.high },
] as const;

/** The first sentence of a reply, for the timeline line. */
function firstSentence(text: string): string {
  const trimmed = text.trim();
  const end = trimmed.search(/[.!?](\s|$)/);
  return end === -1 ? trimmed : trimmed.slice(0, end + 1);
}

function isPriority(value: string): value is TicketPriority {
  return value === 'normal' || value === 'high';
}

/**
 * "Update ticket" (Figma 115:5195): status, assignee, priority and a reply. Saving adds the
 * changes to the ticket's timeline; there is no backend, so nothing is really emailed.
 */
export function TicketUpdateForm({ ticket, staff }: { ticket: StaffTicket; staff: StaffMember }) {
  const { assignees, templates, record, now } = useStaffTickets();
  const [status, setStatus] = useState<StaffTicketStatus>(ticket.status);
  const [assigneeId, setAssigneeId] = useState(ticket.assigneeId ?? NONE);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [templateId, setTemplateId] = useState(ticket.draftReply?.templateId ?? NONE);
  const [reply, setReply] = useState(ticket.draftReply?.text ?? '');
  const [emailReporter, setEmailReporter] = useState(ticket.reporter !== null);
  const [message, setMessage] = useState('');

  const replyText = reply.trim();
  const statusChanged = status !== ticket.status;
  const assigneeChanged = assigneeId !== (ticket.assigneeId ?? NONE);
  const priorityChanged = priority !== ticket.priority;
  const dirty = statusChanged || assigneeChanged || priorityChanged || replyText !== '';
  const canEmail = ticket.reporter !== null;
  const notify = canEmail && emailReporter;
  const overLimit = reply.length > copy.replyMax;

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dirty || overLimit) return;
    const at = now();
    const events: StaffTicketEvent[] = [];
    const add = (text: string) =>
      events.push({
        id: `${ticket.id}-e${ticket.events.length + events.length + 1}`,
        at,
        text,
        kind: 'event',
      });

    if (assigneeChanged) {
      const team = assignees.find((assignee) => assignee.id === assigneeId);
      add(
        team
          ? adminCopy.ticket.events.assigned(team.label, staff.name)
          : adminCopy.ticket.events.unassigned(staff.name),
      );
    }
    if (priorityChanged) {
      add(adminCopy.ticket.events.priority(copy.priorityOptions[priority], staff.name));
    }
    const statusLabel = copy.statusOptions[status];
    const quoted = firstSentence(replyText);
    if (statusChanged && replyText)
      add(adminCopy.ticket.events.statusWithReply(statusLabel, quoted));
    else if (statusChanged) add(adminCopy.ticket.events.status(statusLabel));
    else if (replyText) add(adminCopy.ticket.events.reply(quoted));

    record(ticket.id, {
      status,
      assigneeId:
        assigneeId === NONE ? null : (assignees.find((a) => a.id === assigneeId)?.id ?? null),
      priority,
      events,
    });
    setReply('');
    setTemplateId(NONE);
    setMessage(notify ? copy.savedAndEmailed : copy.saved);
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p aria-hidden className="type-body-s-medium text-gray-900">
          {copy.status}
        </p>
        <SegmentedControl
          legend={copy.status}
          options={statusChoices}
          value={status}
          fullWidth
          onValueChange={(next) => {
            setStatus(next);
            setMessage('');
          }}
        />
      </div>

      <Field label={copy.assignee}>
        <MenuSelect
          value={assigneeId}
          onValueChange={(next) => {
            setAssigneeId(next);
            setMessage('');
          }}
          options={[
            { value: NONE, label: copy.unassigned },
            ...assignees.map((assignee) => ({ value: assignee.id, label: assignee.label })),
          ]}
        />
      </Field>

      <Field label={copy.priority}>
        <MenuSelect
          value={priority}
          onValueChange={(next) => {
            if (isPriority(next)) setPriority(next);
            setMessage('');
          }}
          options={priorityChoices}
        />
      </Field>

      <div role="group" aria-labelledby="reply-heading" className="flex flex-col gap-1.5">
        <p id="reply-heading" className="type-body-s-medium text-gray-900">
          {copy.reply}
        </p>
        <Field label={copy.template} hideLabel>
          <MenuSelect
            value={templateId}
            onValueChange={(next) => {
              setTemplateId(next);
              const template = templates.find((candidate) => candidate.id === next);
              if (template) setReply(template.body);
              setMessage('');
            }}
            options={[
              { value: NONE, label: copy.noTemplate },
              ...templates.map((template) => ({
                value: template.id,
                label: copy.templateOption(template.label),
              })),
            ]}
          />
        </Field>
        <Field label={copy.replyLabel} hideLabel>
          <Textarea
            rows={5}
            maxCharacters={copy.replyMax}
            placeholder={copy.replyPlaceholder}
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
              setMessage('');
            }}
          />
        </Field>
      </div>

      <Checkbox
        checked={notify}
        disabled={!canEmail}
        onChange={(event) => setEmailReporter(event.target.checked)}
        label={
          <span className="flex flex-col gap-0.5">
            <span className="type-body-s-medium text-gray-900">{copy.email.label}</span>
            <span className="type-body-xs text-gray-600">
              {canEmail ? copy.email.hint : copy.email.hintNoEmail}
            </span>
          </span>
        }
      />

      <Button type="submit" fullWidth disabled={!dirty || overLimit}>
        {notify ? copy.save : copy.saveOnly}
      </Button>
      <p role="status" className="type-body-s text-success-700 empty:hidden">
        {message}
      </p>
      {!dirty && message === '' ? (
        <p className="type-body-xs text-gray-500">{copy.nothingChanged}</p>
      ) : null}
    </form>
  );
}
