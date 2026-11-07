'use client';

import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu } from 'radix-ui';
import { adminCopy } from '@/content/admin';
import { cn } from '@/lib/cn';

type RowMenuProps = {
  /** The record's title, for the button's name. */
  title: string;
  editHref: string;
  onDelete: () => void;
};

const itemClass = cn(
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.25 outline-none md:min-h-0',
  'type-body-s-medium text-gray-800 transition-colors duration-(--duration-fast)',
  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
);

/** The "more" button of a list row: Edit and Delete. Sits above the row's stretched link. */
export function RowMenu({ title, editHref, onDelete }: RowMenuProps) {
  const copy = adminCopy.content.rowMenu;
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={copy.label(title)}
        className="hit-area relative z-10 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors duration-(--duration-fast) hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100"
      >
        <Ellipsis aria-hidden className="size-4.5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          collisionPadding={16}
          className={cn(
            'z-50 w-40 rounded-2xl border border-gray-200 bg-surface p-2 shadow-menu',
            'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
          )}
        >
          <DropdownMenu.Item asChild>
            <Link href={editHref} className={itemClass}>
              <Pencil aria-hidden className="size-4 shrink-0" />
              {copy.edit}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={onDelete} className={cn(itemClass, 'text-danger-700')}>
            <Trash2 aria-hidden className="size-4 shrink-0" />
            {copy.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
