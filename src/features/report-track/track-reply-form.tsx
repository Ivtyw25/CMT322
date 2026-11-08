'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { Ticket } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { useTickets } from '@/lib/tickets';

const copy = reportTrackCopy.track.result.reply;

type Errors = { message?: string; files?: string };

/** The reporter's reply on their own ticket: a message and optional photos or files. */
export function TrackReplyForm({ ticket }: { ticket: Ticket }) {
  const { replyAsReporter } = useTickets();
  const announce = useAnnounce();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const found: Errors = {
      message: message.trim() === '' ? copy.errors.message : undefined,
      files: uploading ? copy.errors.uploading : undefined,
    };
    setErrors(found);
    if (found.message || found.files) return;
    setSending(true);
    setStatus('');
    await replyAsReporter(ticket.id, message.trim(), files);
    setMessage('');
    setFiles([]);
    setUploadKey((key) => key + 1);
    setSending(false);
    setStatus(copy.sent);
    announce(copy.sent);
  }

  return (
    <section
      aria-labelledby="reporter-reply-heading"
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-surface p-5"
    >
      <div className="flex flex-col gap-1">
        <h3 id="reporter-reply-heading" className="type-heading-3xs text-gray-900">
          {copy.title}
        </h3>
        <p className="type-body-s text-gray-600">{copy.hint}</p>
      </div>
      <form noValidate onSubmit={send} className="flex flex-col gap-4">
        <Field label={copy.message.label} required error={errors.message}>
          <Textarea
            rows={4}
            maxCharacters={copy.message.max}
            placeholder={copy.message.placeholder}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setStatus('');
            }}
          />
        </Field>
        <div role="group" aria-labelledby="reporter-reply-files" className="flex flex-col gap-1.5">
          <p id="reporter-reply-files" className="type-body-s-medium text-gray-900">
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
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={sending}>
            {sending ? copy.sending : copy.send}
          </Button>
          <p role="status" className="type-body-s text-success-700 empty:hidden">
            {status}
          </p>
        </div>
      </form>
    </section>
  );
}
