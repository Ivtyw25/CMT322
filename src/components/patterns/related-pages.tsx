import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

export type RelatedPage = { label: string; description: string; href: string };

type RelatedPagesProps = {
  pages: readonly RelatedPage[];
  /** Defaults to "Related pages". */
  title?: string;
  className?: string;
};

/** A titled list of page links: each whole row is the link, with a short description. */
export function RelatedPages({
  pages,
  title = uiCopy.docsPage.relatedPages,
  className,
}: RelatedPagesProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={cn('flex flex-col gap-3', className)}>
      <h2 id={titleId} className="type-heading-2xs text-gray-900">
        {title}
      </h2>
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className={cn(
                '-mx-3 flex min-h-17.75 items-center justify-between gap-4 rounded-lg px-3 py-3',
                'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-gray-50',
                'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600',
              )}
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="type-body-m-semibold text-primary-700">{page.label}</span>
                <span className="type-body-s text-gray-600">{page.description}</span>
              </span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
