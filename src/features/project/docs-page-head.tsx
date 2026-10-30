import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { uiCopy } from '@/content/ui';
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
  children?: React.ReactNode;
};

/** Breadcrumb, `h1` and lede that open every docs page of the Project group. */
export function DocsPageHead({
  title,
  lede,
  breadcrumb,
  breadcrumbCurrent = title,
  updatedAt,
  children,
}: DocsPageHeadProps) {
  return (
    <header className="flex flex-col gap-4">
      <Breadcrumb items={breadcrumb} current={breadcrumbCurrent} />
      <h1 className="type-heading-s lg:type-heading-m">{title}</h1>
      <p className="max-w-170 type-body-m text-gray-600 lg:type-body-l">{lede}</p>
      {updatedAt ? (
        <p className="type-body-xs text-gray-500">
          <time dateTime={updatedAt}>{uiCopy.time.updatedOn(formatDate(updatedAt))}</time>
        </p>
      ) : null}
      {children}
    </header>
  );
}
