import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbProps = {
  /** Every level above the current page, starting with Home. */
  items: readonly BreadcrumbItem[];
  /** The current page: plain text, never truncated. */
  current: string;
  /** `link` shows the parent levels as primary links and the current page in a darker grey (Figma Traffic pages). */
  tone?: 'muted' | 'link';
  className?: string;
};

export function Breadcrumb({ items, current, tone = 'muted', className }: BreadcrumbProps) {
  return (
    <nav aria-label={commonCopy.landmarks.breadcrumb} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body-s">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className={cn(
                'hit-area transition-colors duration-(--duration-fast) hover:text-primary-700 hover:underline',
                tone === 'link' ? 'text-primary-700' : 'text-gray-600',
              )}
            >
              {item.label}
            </Link>
            <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
          </li>
        ))}
        <li className={tone === 'link' ? 'text-gray-700' : 'text-gray-900'} aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
