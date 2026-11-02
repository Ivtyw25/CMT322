import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { FaqItem } from '@/data/models/faq';

const { questions } = projectCopy.overview;

/** The three most asked questions as link rows, then the link to the whole FAQ. */
export function OverviewPopularQuestions({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <p className="type-body-s text-gray-600">{questions.empty}</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={routes.project.faqItem(item.id)}
                className="flex min-h-12.25 items-start justify-between gap-4 py-3 type-body-m text-gray-900 transition-colors duration-(--duration-fast) hover:bg-gray-50 hover:text-primary-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
              >
                <span>{item.question}</span>
                <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-gray-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={routes.project.faq}
        className="inline-flex min-h-11 items-center self-start type-body-s-semibold text-primary-700 hover:underline md:min-h-0"
      >
        {questions.link}
      </Link>
    </div>
  );
}
