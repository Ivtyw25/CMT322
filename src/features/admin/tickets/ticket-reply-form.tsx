'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { MenuSelect } from '@/components/ui/menu-select';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { TextInput } from '@/components/ui/text-input';
import { Textarea } from '@/components/ui/textarea';
import { adminCopy } from '@/content/admin';
import { uiCopy } from '@/content/ui';
import type { StaffMember } from '@/data/models/staff';
import type { ReplyStatus, Ticket, TicketPriority } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { useTickets } from '@/lib/tickets';

const copy = adminCopy.ticket.reply;

const statusChoices: readonly SegmentedOption<ReplyStatus>[] = [
  { value: 'in-progress', label: copy.statusOptions['in-progress'] },
  { value: 'resolved', label: copy.statusOptions.resolved },
];

const priorityChoices = [
  { value: 'normal', label: copy.priorityOptions.normal },
  { value: 'high', label: copy.priorityOptions.high },
] as const;

function isPriority(value: string): value is TicketPriority {
  return value === 'normal' || value === 'high';
}

type Errors = { subject?: string; description?: string; files?: string };

type TicketReplyFormProps = {
  ticket: Ticket;
  staff: StaffMember;
};

/**
 * "Reply to the reporter": status, priority, a subject, a description and optional files. Sending
 * adds a reply to the conversation, sets the status and priority, and emails the reporter
 * (simulated: there is no backend).
 */
export function TicketReplyForm({ ticket, staff }: TicketReplyFormProps) {
  const { reply } = useTickets();
  const announce = useAnnounce();
  const [status, setStatus] = useState<ReplyStatus>(
    ticket.status === 'pending' ? 'in-progress' : ticket.status,
  );
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const found: Errors = {
      subject: subject.trim() === '' ? copy.errors.subject : undefined,
      description: body.trim() === '' ? copy.errors.description : undefined,
      files: uploading ? copy.errors.uploading : undefined,
    };
    setErrors(found);
    if (found.subject || found.description || found.files) return;
    setSending(true);
    setMessage('');
    await reply(
      ticket.id,
      { status, priority, subject: subject.trim(), body: body.trim() },
      files,
      staff,
    );
    setSubject('');
    setBody('');
    setFiles([]);
    setUploadKey((key) => key + 1);
    setSending(false);
    setMessage(copy.sent);
    announce(copy.sent);
  }

  return (
    <form noValidate onSubmit={send} className="flex flex-col gap-4">
      <p className="type-body-xs text-gray-600">{copy.hint}</p>

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

      <Field label={copy.subject.label} required error={errors.subject}>
        <TextInput
          value={subject}
          maxLength={copy.subject.max}
          placeholder={copy.subject.placeholder}
          onChange={(event) => {
            setSubject(event.target.value);
            setMessage('');
          }}
        />
      </Field>

      <Field label={copy.description.label} required error={errors.description}>
        <Textarea
          rows={5}
          maxCharacters={copy.description.max}
          placeholder={copy.description.placeholder}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            setMessage('');
          }}
        />
      </Field>

      <div role="group" aria-labelledby="reply-files-label" className="flex flex-col gap-1.5">
        <p id="reply-files-label" className="type-body-s-medium text-gray-900">
          {copy.files.label}
          <span className="ml-1 text-gray-500">{uiCopy.form.optional}</span>
        </p>
        <FileUpload
          key={uploadKey}
          maxFiles={copy.files.maxFiles}
          maxMegabytes={copy.files.maxMb}
          onFilesChange={setFiles}
          onBusyChange={setUploading}
        />
        {errors.files ? <p className="type-body-s text-danger-700">{errors.files}</p> : null}
      </div>

      <Button type="submit" fullWidth loading={sending}>
        {sending ? copy.sending : copy.send}
      </Button>
      <p role="status" className="type-body-s text-success-700 empty:hidden">
        {message}
      </p>
    </form>
  );
}
