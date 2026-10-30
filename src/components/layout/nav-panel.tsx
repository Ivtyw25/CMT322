import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { navCopy, type NavGroup } from '@/content/nav';
import { Callout } from '@/components/ui/callout';
import { Tag } from '@/components/ui/tag';
import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import { cn } from '@/lib/cn';
import type { NavGroupId } from './nav-groups';
import type { ShellData } from './shell-data';

type NavPanelProps = {
  group: NavGroup & { id: NavGroupId };
  data: ShellData;
  /** Pathname of the current page, for the "current page" row. */
  pathname: string;
  /** Path with search and hash, for the "Create an account" return link. */
  currentPath: string;
  /** Show the guests-only account note. Gallery passes false to preview a signed-in visitor. */
  showAccountNote?: boolean;
  onNavigate?: () => void;
  id?: string;
  className?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

const featureTitle = 'type-body-s-semibold text-gray-900';
const featureLink =
  'hit-area type-body-s-medium text-primary-700 transition-colors duration-(--duration-fast) hover:underline';

/** One mega-menu panel (Figma 101:4039): the group's pages on a line rail, a feature on the right. */
export function NavPanel({
  group,
  data,
  pathname,
  currentPath,
  showAccountNote = true,
  onNavigate,
  id,
  className,
  onKeyDown,
}: NavPanelProps) {
  return (
    <div
      id={id}
      onKeyDown={onKeyDown}
      className={cn(
        'flex max-h-[calc(100dvh-7.3125rem)] overflow-y-auto rounded-3xl border border-gray-200 bg-surface shadow-panel',
        'animate-panel-in',
        className,
      )}
    >
      <div className="flex w-1/2 shrink-0 flex-col gap-4 px-8 py-7">
        <div className="flex flex-col gap-1 pl-3">
          <p className="type-heading-3xs text-gray-900">{group.label}</p>
          <p className="type-body-s text-gray-600">{group.intro}</p>
        </div>
        <LineRail variant="panel" label={group.label}>
          {group.items.map((item, index) => (
            <LineRailStop
              key={item.id}
              title={item.label}
              description={item.description}
              href={item.href}
              filled={index === 0}
              current={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </LineRail>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3.5 border-l border-gray-200 bg-gray-50 px-8 py-7">
        {group.id === 'project' ? <ProjectFeature data={data} onNavigate={onNavigate} /> : null}
        {group.id === 'traffic' ? <TrafficFeature data={data} onNavigate={onNavigate} /> : null}
        {group.id === 'report-track' ? (
          <ReportTrackFeature
            data={data}
            currentPath={currentPath}
            showAccountNote={showAccountNote}
            onNavigate={onNavigate}
          />
        ) : null}
      </div>
    </div>
  );
}

type FeatureProps = { data: ShellData; onNavigate?: () => void };

function ProjectFeature({ data, onNavigate }: FeatureProps) {
  const copy = navCopy.projectPanel;
  return (
    <>
      <p className={featureTitle}>{copy.title}</p>
      <ul className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-surface">
        {data.featuredStations.map((station) => (
          <li key={station.code}>
            <Link
              href={routes.project.station(station.code)}
              onClick={onNavigate}
              className="flex items-center gap-3 px-3.5 py-3 transition-colors duration-(--duration-fast) hover:bg-gray-50 focus-visible:-outline-offset-2"
            >
              <span className="w-10 shrink-0 rounded-md bg-primary-600 py-0.75 text-center type-body-xs-semibold text-static-white">
                {station.code}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="type-body-s-medium text-gray-900">{station.name}</span>
                <span className="type-body-xs text-gray-500">{station.area}</span>
              </span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={copy.seeAllHref} onClick={onNavigate} className={cn(featureLink, 'self-start')}>
        {copy.seeAll(data.stationCount)}
      </Link>
    </>
  );
}

function TrafficFeature({ data, onNavigate }: FeatureProps) {
  const copy = navCopy.trafficPanel;
  return (
    <>
      <p className={featureTitle}>{copy.title}</p>
      {data.closures.length > 0 ? (
        <ul className="flex flex-col gap-3.5">
          {data.closures.map((closure) => (
            <li key={closure.id}>
              <Link
                href={copy.allHref}
                onClick={onNavigate}
                className="flex flex-col items-start gap-1 rounded-xl border border-gray-200 bg-surface px-3.5 py-3 transition-colors duration-(--duration-fast) hover:border-primary-300"
              >
                <Tag kind="active" />
                <span className="type-body-s-semibold text-gray-900">{closure.title}</span>
                <span className="type-body-xs text-gray-600">{closure.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-body-s text-gray-600">{copy.empty}</p>
      )}
      <Link href={copy.allHref} onClick={onNavigate} className={cn(featureLink, 'self-start')}>
        {copy.allLink}
      </Link>
    </>
  );
}

function ReportTrackFeature({
  data,
  currentPath,
  showAccountNote,
  onNavigate,
}: FeatureProps & { currentPath: string; showAccountNote: boolean }) {
  const copy = navCopy.reportTrackPanel;
  return (
    <>
      <Callout tone="warning" title={copy.emergencyTitle}>
        {copy.emergencyText(data.careline)}
      </Callout>
      {showAccountNote ? (
        <div
          data-auth="guest"
          className="flex flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-surface p-4"
        >
          <p className={featureTitle}>{copy.accountTitle}</p>
          <p className="type-body-s text-gray-600">{copy.accountText}</p>
          <Link href={copy.accountHref(currentPath)} onClick={onNavigate} className={featureLink}>
            {copy.accountLink}
          </Link>
        </div>
      ) : null}
    </>
  );
}
