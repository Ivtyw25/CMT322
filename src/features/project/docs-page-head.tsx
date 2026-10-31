import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';

type DocsPageHeadProps = {
  title: string;
  lede: string;
  /** Levels above the page, starting with Home. */
  breadcrumb: readonly BreadcrumbItem[];
  /** The breadcrumb label of this page. Defaults to the title. */
  breadcrumbCurrent?: string;
  /** ISO date for "Last updated …". */
  updatedAt?: string;
  /** `xl` is the larger lede of the About page (18 px, 20 px from 1024 px). */
  ledeSize?: 'l' | 'xl';
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
  children,
}: DocsPageHeadProps) {
  return (
    <header className="flex flex-col gap-4">
      <Breadcrumb items={breadcrumb} current={breadcrumbCurrent} />
      <h1 className="type-heading-s lg:type-heading-m">{title}</h1>
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
