import { RequiredMark } from '@/components/ui/field';
import { cn } from '@/lib/cn';

type DocsSectionHeadingProps = {
  id: string;
  title: string;
  /** Stays at the smaller step from 1024 px up (the report form's sections). */
  compact?: boolean;
  /** Adds the red `*` after the title (a required group of fields). */
  required?: boolean;
};

/** The `h2` of a docs section. It takes focus from the "On this page" list. */
export function DocsSectionHeading({
  id,
  title,
  compact = false,
  required = false,
}: DocsSectionHeadingProps) {
  return (
    <h2
      id={id}
      tabIndex={-1}
      className={cn('scroll-mt-32 outline-none', compact ? 'type-heading-2xs' : 'type-heading-xs')}
    >
      {title}
      {required ? <RequiredMark /> : null}
    </h2>
  );
}

type DocsSectionProps = DocsSectionHeadingProps & {
  children: React.ReactNode;
  className?: string;
};

/** One `h2` section of a docs article. */
export function DocsSection({ id, title, children, className }: DocsSectionProps) {
  return (
    <section aria-labelledby={id} className={cn('flex flex-col gap-5', className)}>
      <DocsSectionHeading id={id} title={title} />
      {children}
    </section>
  );
}
