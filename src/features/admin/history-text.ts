import { adminCopy } from '@/content/admin';
import type { StaffHistoryEntry } from '@/data/models/staff-content';
import { formatFullDateTime } from '@/lib/format/date-time';

/** "Scheduled by Daniel Lim, 28 Oct 2026, 15:20" for one history entry. */
export function historyText(entry: StaffHistoryEntry): string {
  const when = formatFullDateTime(entry.at);
  const copy = adminCopy.content.history;
  switch (entry.action) {
    case 'created':
      return copy.created(when);
    case 'notice-uploaded':
      return copy['notice-uploaded'](when);
    case 'draft-saved':
      return copy['draft-saved'](when, entry.by);
    case 'scheduled':
      return copy.scheduled(when, entry.by);
    case 'published':
      return copy.published(when, entry.by);
    case 'updated':
      return copy.updated(when, entry.by);
  }
}
