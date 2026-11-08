import type { StaffMember } from '@/data/models/staff';
import { splitMentions } from '@/lib/staff-notifications';

/** The text of an internal note, with each @-mention of a colleague highlighted. */
export function NoteText({ text, members }: { text: string; members: readonly StaffMember[] }) {
  return (
    <p className="type-body-s wrap-anywhere whitespace-pre-line text-gray-900">
      {splitMentions(text, members).map((segment, position) =>
        segment.staffId ? (
          <span
            key={`${position}-${segment.staffId}`}
            className="rounded-sm bg-primary-50 px-1 type-body-s-medium text-primary-700"
          >
            {segment.text}
          </span>
        ) : (
          <span key={position}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
