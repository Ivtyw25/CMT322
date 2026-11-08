import type { StaffMember } from '@/data/models/staff';

export type MentionSegment = { text: string; staffId: string | null };

const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Matches "@Full Name" for any of the staff members, longest names first, not followed by a letter. */
function mentionPattern(members: readonly StaffMember[]): RegExp | null {
  if (members.length === 0) return null;
  const names = members
    .map((member) => escapePattern(member.name))
    .toSorted((a, b) => b.length - a.length);
  return new RegExp(`@(${names.join('|')})(?![\\p{L}\\p{N}])`, 'gu');
}

/** A note as plain and mention segments, in order. A mention segment keeps its "@". */
export function splitMentions(text: string, members: readonly StaffMember[]): MentionSegment[] {
  const pattern = mentionPattern(members);
  if (!pattern) return [{ text, staffId: null }];
  const segments: MentionSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const member = members.find((candidate) => candidate.name === match[1]);
    if (!member) continue;
    if (match.index > last) segments.push({ text: text.slice(last, match.index), staffId: null });
    segments.push({ text: match[0], staffId: member.id });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), staffId: null });
  return segments;
}

/** The IDs of the staff members a note @-mentions, once each. */
export function mentionedStaffIds(text: string, members: readonly StaffMember[]): string[] {
  const ids = splitMentions(text, members).flatMap((segment) =>
    segment.staffId ? [segment.staffId] : [],
  );
  return [...new Set(ids)];
}
