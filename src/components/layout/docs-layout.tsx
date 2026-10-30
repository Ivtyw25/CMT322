import Link from 'next/link';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';
import { DocsAside, type DocsAsideItem } from './docs-aside';
import { navGroupList } from './nav-groups';
import { SectionBar } from './section-bar';

export type DocsSidebarGroup = {
  id: string;
  label: string;
  items: readonly { label: string; href: string }[];
};

type DocsLayoutProps = {
  /** Route of the current page. */
  currentHref: string;
  /** Groups shown in the sidebar. Defaults to Project, Traffic and Report & Track. */
  groups?: readonly DocsSidebarGroup[];
  /** One entry per `h2` of the article, with the heading's id. */
  onThisPage: readonly DocsAsideItem[];
  /** The page's "Need help?" block: under the aside from 1280 px, under the article below. */
  needHelp?: React.ReactNode;
  /** Gallery only: show the aside at any width and pin its active item. */
  preview?: { activeId: string };
  children: React.ReactNode;
};

const defaultGroups: readonly DocsSidebarGroup[] = navGroupList.map((group) => ({
  id: group.id,
  label: group.label,
  items: group.items.map((item) => ({ label: item.label, href: item.href })),
}));

/**
 * The docs page frame (Figma About 1:332): sidebar, article, "On this page". Below 1024 px the
 * sidebar becomes the section bar; from 1280 px the aside shows. The page puts its title,
 * breadcrumb and sections inside `children`.
 */
export function DocsLayout({
  currentHref,
  groups = defaultGroups,
  onThisPage,
  needHelp,
  preview,
  children,
}: DocsLayoutProps) {
  const currentGroup = groups.find((group) =>
    group.items.some((item) => item.href === currentHref),
  );
  const currentItem = currentGroup?.items.find((item) => item.href === currentHref);

  return (
    <div className="flex flex-col lg:flex-row">
      {currentGroup && currentItem ? (
        <SectionBar
          groupLabel={currentGroup.label}
          pageLabel={currentItem.label}
          items={currentGroup.items}
          currentHref={currentHref}
        />
      ) : null}

      <div className="hidden w-[calc(var(--container-docs-sidebar)+1.5rem)] shrink-0 border-r border-gray-200 lg:block">
        <nav
          aria-label={commonCopy.landmarks.sectionPages}
          className="sticky top-29.25 flex max-h-[calc(100dvh-8.8125rem)] flex-col gap-6 overflow-y-auto px-6 py-8"
        >
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              <p
                id={`docs-group-${group.id}`}
                className="px-2.5 py-1 type-body-xs-semibold text-gray-500"
              >
                {group.label}
              </p>
              <ul aria-labelledby={`docs-group-${group.id}`} className="flex flex-col">
                {group.items.map((item) => {
                  const current = item.href === currentHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? 'page' : undefined}
                        className={cn(
                          'block rounded-lg px-2.5 py-1.5 type-body-s transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                          current
                            ? 'bg-primary-50 type-body-s-semibold text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-14 lg:py-10">
        <div className="flex gap-14">
          <article className="max-w-article min-w-0 flex-1">{children}</article>
          <div
            className={cn(
              'w-docs-aside shrink-0 flex-col gap-8',
              preview ? 'flex' : 'hidden xl:flex',
            )}
          >
            <div className="sticky top-29.25 flex max-h-[calc(100dvh-8.8125rem)] flex-col gap-8 overflow-y-auto">
              <DocsAside items={onThisPage} previewActiveId={preview?.activeId} />
              {needHelp ? <div className="border-t border-gray-200 pt-6">{needHelp}</div> : null}
            </div>
          </div>
        </div>
        {needHelp && !preview ? (
          <div className="mt-10 max-w-article border-t border-gray-200 pt-6 xl:hidden">
            {needHelp}
          </div>
        ) : null}
      </div>
    </div>
  );
}
