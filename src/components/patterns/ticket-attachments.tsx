'use client';

import { FileText } from 'lucide-react';
import Image from 'next/image';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { uiCopy } from '@/content/ui';
import type { TicketAttachment } from '@/data/models/ticket';
import { formatFileSize } from '@/lib/format/file-size';
import { useAttachmentUrl } from '@/lib/tickets';

const tile = 'relative h-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100';

function Attachment({ attachment }: { attachment: TicketAttachment }) {
  const file = useAttachmentUrl(attachment.id);
  const isImage = attachment.mimeType.startsWith('image/');
  const name = 'type-body-xs-medium break-all text-gray-800';
  return (
    <li className="flex w-36 max-w-full flex-col gap-1.5">
      <div className={tile}>
        {isImage && attachment.src ? (
          <Image
            src={attachment.src}
            alt={uiCopy.ticketThread.photoAlt(attachment.fileName)}
            fill
            sizes="144px"
            className="object-cover"
          />
        ) : isImage && file.state === 'ready' ? (
          <Image
            src={file.url}
            alt={uiCopy.ticketThread.photoAlt(attachment.fileName)}
            fill
            unoptimized
            sizes="144px"
            className="object-cover"
          />
        ) : isImage ? (
          <ImagePlaceholder decorative className="size-full" />
        ) : (
          <span className="flex size-full items-center justify-center text-gray-500">
            <FileText aria-hidden className="size-8" />
          </span>
        )}
      </div>
      {file.state === 'ready' && !isImage ? (
        <a
          href={file.url}
          download={attachment.fileName}
          className={`${name} transition-colors duration-(--duration-fast) hover:text-primary-700`}
        >
          {attachment.fileName}
        </a>
      ) : (
        <p className={name}>{attachment.fileName}</p>
      )}
      <p className="type-body-xs text-gray-500">{formatFileSize(attachment.sizeBytes)}</p>
    </li>
  );
}

/** Thumbnails of the photos and the names of the files on a submission or a reply. */
export function TicketAttachments({ attachments }: { attachments: readonly TicketAttachment[] }) {
  if (attachments.length === 0) return null;
  return (
    <ul aria-label={uiCopy.ticketThread.attachments} className="flex flex-wrap gap-3">
      {attachments.map((attachment) => (
        <Attachment key={attachment.id} attachment={attachment} />
      ))}
    </ul>
  );
}
