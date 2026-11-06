import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function ContactCard({
  title,
  body,
  href,
  icon,
}: {
  title: string;
  body: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1.5 rounded-2xl border border-gray-200 p-5 transition-colors hover:bg-gray-50"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-primary-600">{icon}</span>
        <span className="flex-1 type-body-m-semibold text-gray-900">{title}</span>
        <ChevronRight aria-hidden className="size-4 shrink-0 text-gray-400" />
      </span>
      <span className="type-body-s text-gray-600">{body}</span>
    </Link>
  );
}
