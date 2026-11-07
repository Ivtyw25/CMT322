import { cn } from '@/lib/cn';

type DocsSectionHeadingProps = {
  id: string;
  title: string;
  /** Stays at the smaller step from 1024 px up (the report form's sections). */
  compact?: boolean;
};

/** The `h2` of a docs section. It takes focus from the "On this page" list. */
export function DocsSectionHeading({ id, title, compact = false }: DocsSectionHeadingProps) {
  return (
    <h2
      id={id}
      tabIndex={-1}
      className={cn('scroll-mt-32 outline-none', compact ? 'type-heading-2xs' : 'type-heading-xs')}
    >
      {title}
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
