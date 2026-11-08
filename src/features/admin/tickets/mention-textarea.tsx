'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';

const copy = adminCopy.ticket.notes;
const MAX_QUERY_LENGTH = 40;

type ActiveMention = { start: number; query: string };

/** The "@name" being typed at the caret, or null when the caret is not inside one. */
function activeMention(text: string, caret: number): ActiveMention | null {
  const before = text.slice(0, caret);
  const start = before.lastIndexOf('@');
  if (start < 0) return null;
  if (start > 0 && !/\s/.test(before.charAt(start - 1))) return null;
  const query = before.slice(start + 1);
  if (query.includes('\n') || query.length > MAX_QUERY_LENGTH) return null;
  return { start, query };
}

/** Names that start with the query, or have a word that does. */
function suggestionsFor(members: readonly StaffMember[], query: string): StaffMember[] {
  const text = query.toLowerCase();
  return members.filter((member) => {
    const name = member.name.toLowerCase();
    return name.startsWith(text) || name.split(' ').some((word) => word.startsWith(text));
  });
}

type MentionTextareaProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** The colleagues that can be mentioned. */
  members: readonly StaffMember[];
  maxCharacters: number;
  placeholder: string;
};

/**
 * A text area where typing "@" suggests colleagues. It is a combobox: the suggestions are a
 * listbox; arrow keys move, Enter or Tab picks, Escape closes. The pick becomes "@Full Name".
 * Must sit inside a `Field`, which names it.
 */
export function MentionTextarea({
  value,
  onValueChange,
  members,
  maxCharacters,
  placeholder,
}: MentionTextareaProps) {
  const announce = useAnnounce();
  const listId = useId();
  const field = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const [caret, setCaret] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const mention = activeMention(value, caret);
  const suggestions = mention ? suggestionsFor(members, mention.query) : [];
  const open = mention !== null && suggestions.length > 0 && mention.start !== dismissedAt;
  const index = Math.min(activeIndex, Math.max(0, suggestions.length - 1));
  const optionId = (position: number) => `${listId}-option-${position}`;
  const count = suggestions.length;

  useEffect(() => {
    if (open) announce(copy.mentionSuggestions(count));
  }, [open, count, announce]);

  useLayoutEffect(() => {
    if (pendingCaret.current === null) return;
    field.current?.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  }, [value]);

  function pick(member: StaffMember) {
    if (!mention) return;
    const inserted = `@${member.name} `;
    pendingCaret.current = mention.start + inserted.length;
    onValueChange(value.slice(0, mention.start) + inserted + value.slice(caret));
    setCaret(mention.start + inserted.length);
    setActiveIndex(0);
    field.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index - 1 + count) % count);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const member = suggestions[index];
      if (member) pick(member);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setDismissedAt(mention.start);
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={field}
        rows={2}
        maxCharacters={maxCharacters}
        placeholder={placeholder}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? optionId(index) : undefined}
        onChange={(event) => {
          onValueChange(event.target.value);
          setCaret(event.target.selectionStart);
          setActiveIndex(0);
        }}
        onSelect={(event) => setCaret(event.currentTarget.selectionStart)}
        onKeyDown={handleKeyDown}
        onBlur={() => setDismissedAt(mention?.start ?? null)}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={copy.mentionList}
          className="max-w-sm absolute top-full left-0 z-20 mt-1 flex max-h-56 w-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-surface p-1 shadow-menu"
        >
          {suggestions.map((member, position) => (
            <li
              key={member.id}
              id={optionId(position)}
              role="option"
              aria-selected={position === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(member)}
              className={cn(
                'flex cursor-pointer flex-col rounded-lg px-3 py-2 transition-colors duration-(--duration-fast)',
                position === index ? 'bg-primary-50' : 'hover:bg-gray-50',
              )}
            >
              <span className="type-body-s-medium text-gray-900">{member.name}</span>
              <span className="type-body-xs text-gray-600">{member.organisation}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
