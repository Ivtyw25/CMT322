import { cn } from '@/lib/cn';

type DocsSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

/** One `h2` section of a docs article. The heading takes focus from the "On this page" list. */
export function DocsSection({ id, title, children, className }: DocsSectionProps) {
  return (
    <section aria-labelledby={id} className={cn('flex flex-col gap-5', className)}>
      <h2
        id={id}
        tabIndex={-1}
        className="scroll-mt-32 type-heading-2xs outline-none lg:type-heading-xs"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
