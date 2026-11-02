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
  /** Id of the text that describes the card (its description); read after the link's name. */
  describedBy?: string;
  /** `link`: a larger primary-blue title (Figma Traffic overview cards). */
  titleTone?: 'default' | 'link';
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
  describedBy,
  titleTone = 'default',
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
      <Title
        className={cn(
          'transition-colors duration-(--duration-fast) group-hover:text-primary-700',
          titleTone === 'link'
            ? 'type-body-m-semibold text-primary-700'
            : 'type-body-s-semibold text-gray-900',
        )}
      >
        <Link
          href={href}
          aria-current={selected ? 'true' : undefined}
          aria-describedby={describedBy}
          className="inline-flex min-h-11 items-center outline-none after:absolute after:inset-0 after:rounded-xl md:min-h-0"
        >
          {title}
        </Link>
      </Title>
      {children}
    </article>
  );
}
