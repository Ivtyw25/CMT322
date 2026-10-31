import { cn } from '@/lib/cn';

type DocsSectionHeadingProps = { id: string; title: string };

/** The `h2` of a docs section. It takes focus from the "On this page" list. */
export function DocsSectionHeading({ id, title }: DocsSectionHeadingProps) {
  return (
    <h2
      id={id}
      tabIndex={-1}
      className="scroll-mt-32 type-heading-2xs outline-none lg:type-heading-xs"
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
