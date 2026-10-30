import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { commonCopy } from '@/content/common';

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbProps = {
  /** Every level above the current page, starting with Home. */
  items: readonly BreadcrumbItem[];
  /** The current page: plain text, never truncated. */
  current: string;
  className?: string;
};

export function Breadcrumb({ items, current, className }: BreadcrumbProps) {
  return (
    <nav aria-label={commonCopy.landmarks.breadcrumb} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body-s">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className="hit-area text-gray-600 transition-colors duration-(--duration-fast) hover:text-primary-700 hover:underline"
            >
              {item.label}
            </Link>
            <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
          </li>
        ))}
        <li className="text-gray-900" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
