'use client';

import { useEffect, useState } from 'react';
import { loadAttachmentBlob } from './attachment-blobs';

export type AttachmentUrl =
  { state: 'loading' } | { state: 'missing' } | { state: 'ready'; url: string };

/** An object URL for a stored attachment, revoked when the attachment leaves the page. */
export function useAttachmentUrl(attachmentId: string): AttachmentUrl {
  const [loaded, setLoaded] = useState<{ id: string; url: string | null } | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    void loadAttachmentBlob(attachmentId).then((blob) => {
      if (cancelled) return;
      objectUrl = blob ? URL.createObjectURL(blob) : null;
      setLoaded({ id: attachmentId, url: objectUrl });
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachmentId]);

  if (loaded?.id !== attachmentId) return { state: 'loading' };
  return loaded.url ? { state: 'ready', url: loaded.url } : { state: 'missing' };
}
