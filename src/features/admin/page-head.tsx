import { cn } from '@/lib/cn';

type AdminPageHeadProps = {
  title: string;
  intro?: string;
  /** A button or link on the right (wraps below the text on narrow screens). */
  action?: React.ReactNode;
  className?: string;
};

/** The title block at the top of a staff page (Figma "page-head"). */
export function AdminPageHead({ title, intro, action, className }: AdminPageHeadProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-x-4 gap-y-3', className)}>
      <div className="flex min-w-0 flex-1 basis-80 flex-col gap-1">
        <h1 className="type-heading-s text-gray-900">{title}</h1>
        {intro ? <p className="type-body-s text-gray-600">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
