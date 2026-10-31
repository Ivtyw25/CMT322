import { Container } from '@/components/layout/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';
import { cn } from '@/lib/cn';
import { StationFollowButton } from './station-follow-button';

const { station: copy } = projectCopy;

export type StationStat = { id: string; label: string; value: string };

type StationHeaderProps = {
  station: Station;
  stats: readonly StationStat[];
};

/** Full-bleed band: breadcrumb, code chip, name, lede, actions and the four figures. */
export function StationHeader({ station, stats }: StationHeaderProps) {
  const underConstruction = station.progress !== null && station.progress.percent < 100;
  return (
    <div className="border-b border-gray-200 bg-gray-50 py-8 lg:py-10">
      <Container className="flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: uiCopy.breadcrumb.home, href: routes.home },
            { label: projectCopy.sectionLabel, href: routes.project.overview },
            { label: projectCopy.stations.sectionBarCurrent, href: routes.project.stations },
          ]}
          current={station.name}
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:gap-5">
            <span
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 type-heading-xs text-static-white md:size-16 md:rounded-2xl"
            >
              {station.code}
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="type-heading-m md:type-heading-xl">
                <span className="sr-only">{`${station.code} `}</span>
                {station.name}
                {station.isProvisionalName ? (
                  <span className="ml-2 type-body-l text-gray-500">{copy.header.provisional}</span>
                ) : null}
              </h1>
              <p className="max-w-190 type-body-m text-gray-600 md:type-body-l">{station.lede}</p>
              {underConstruction ? (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-0.5 type-body-xs-medium text-warning-700">
                  <span aria-hidden className="size-1.5 rounded-full bg-warning-600" />
                  {uiCopy.tags.construction}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            <StationFollowButton code={station.code} name={station.name} />
            <ButtonLink href={routes.reportTrack.reportAt(station.code)}>
              {copy.actions.report}
            </ButtonLink>
          </div>
        </div>
        <dl
          aria-label={copy.stats.label}
          className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-surface md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={cn(
                'flex flex-col-reverse justify-end gap-1 border-gray-200 px-5 py-4',
                index % 2 === 1 && 'border-l',
                index >= 2 && 'border-t md:border-t-0',
                index > 0 && 'md:border-l',
              )}
            >
              <dt className="type-body-s text-gray-600">{stat.label}</dt>
              <dd className="type-heading-xs text-gray-900 md:type-heading-s">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
