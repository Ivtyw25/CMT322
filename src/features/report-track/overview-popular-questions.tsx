import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';

const { faq } = reportTrackCopy.overview;

/** Three question rows that open the FAQ at that question, then the link to every FAQ. */
export function OverviewPopularQuestions() {
  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {faq.items.map((item) => (
          <li key={item.faqId}>
            <Link
              href={routes.project.faqItem(item.faqId)}
              className="group flex min-h-12 items-center justify-between gap-4 py-3 type-body-m text-gray-900 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
            >
              <span>{item.question}</span>
              <ChevronRight
                aria-hidden
                className="size-4.5 shrink-0 text-gray-400 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 motion-reduce:transform-none"
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={routes.project.faq}
        className="hit-area inline-flex items-center self-start type-body-s-semibold text-primary-700 hover:underline"
      >
        {faq.seeAll}
      </Link>
    </div>
  );
}
