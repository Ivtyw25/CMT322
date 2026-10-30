import Link from 'next/link';
import { cn } from '@/lib/cn';

type LinkCardProps = {
  href: string;
  title: string;
  /** Rendered above the title: a tag, an image placeholder. */
  media?: React.ReactNode;
  /** Heading level of the title. */
  titleAs?: 'h2' | 'h3' | 'h4';
  /** The card for the page's current topic: highlighted, and its link has `aria-current`. */
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
};

/**
 * One link per card: the title link is stretched over the whole card. Anything else in the card
 * must stay non-interactive, or sit above the stretched area with `relative z-10`.
 */
export function LinkCard({
  href,
  title,
  media,
  titleAs: Title = 'h3',
  selected = false,
  children,
  className,
}: LinkCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col gap-2 rounded-xl border p-4',
        'transition-colors duration-(--duration-fast)',
        selected
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 bg-surface hover:border-gray-300',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-600',
        className,
      )}
    >
      {media}
      <Title className="type-body-s-semibold text-gray-900 transition-colors duration-(--duration-fast) group-hover:text-primary-700">
        <Link
          href={href}
          aria-current={selected ? 'true' : undefined}
          className="inline-flex min-h-11 items-center outline-none after:absolute after:inset-0 after:rounded-xl md:min-h-0"
        >
          {title}
        </Link>
      </Title>
      {children}
    </article>
  );
}
