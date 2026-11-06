import { cn } from '@/lib/cn';

export function ProfileCard({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn('flex flex-col gap-4', className)}>
      <h2 id={id} tabIndex={-1} className="scroll-mt-32 type-body-m-semibold outline-none">
        {title}
      </h2>
      {children}
    </section>
  );
}
