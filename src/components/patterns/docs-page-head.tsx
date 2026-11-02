import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';

type DocsPageHeadProps = {
  title: string;
  lede: React.ReactNode;
  /** Levels above the page, starting with Home. */
  breadcrumb: readonly BreadcrumbItem[];
  /** The breadcrumb label of this page. Defaults to the title. */
  breadcrumbCurrent?: string;
  /** ISO date for "Last updated …". */
  updatedAt?: string;
  /** `xl` is the larger lede of the About page (18 px, 20 px from 1024 px). */
  ledeSize?: 'l' | 'xl';
  /** Decorative icon left of the `h1` (the check circle of "Report submitted"). */
  titleIcon?: React.ReactNode;
  /** Makes the `h1` focusable by code (`tabIndex={-1}`, no ring) so a page can move focus to it. */
  titleRef?: React.Ref<HTMLHeadingElement>;
  children?: React.ReactNode;
};

/** Breadcrumb, `h1` and lede that open every docs page of the Project group. */
export function DocsPageHead({
  title,
  lede,
  breadcrumb,
  breadcrumbCurrent = title,
  updatedAt,
  ledeSize = 'l',
  titleIcon,
  titleRef,
  children,
}: DocsPageHeadProps) {
  return (
    <header className="flex flex-col gap-4">
      <Breadcrumb items={breadcrumb} current={breadcrumbCurrent} />
      <div className={cn(titleIcon && 'flex items-center gap-4')}>
        {titleIcon}
        <h1
          ref={titleRef}
          tabIndex={titleRef ? -1 : undefined}
          className={cn('type-heading-s lg:type-heading-m', titleRef && 'outline-none')}
        >
          {title}
        </h1>
      </div>
      <p
        className={cn(
          'max-w-170 text-gray-600',
          ledeSize === 'xl' ? 'type-body-l lg:type-body-xl' : 'type-body-m lg:type-body-l',
        )}
      >
        {lede}
      </p>
      {updatedAt ? (
        <p className="type-body-xs text-gray-500">
          <time dateTime={updatedAt}>{uiCopy.time.updatedOn(formatDate(updatedAt))}</time>
        </p>
      ) : null}
      {children}
    </header>
  );
}
