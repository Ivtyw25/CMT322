import { Map as MapIcon, Route } from 'lucide-react';
import { SegmentedLinks } from '@/components/ui/segmented-links';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { serialiseHidden, type HideKey, type TimeWindow } from './traffic-filters';

type PanelHeaderProps = {
  view: 'map' | 'route';
  /** "14:20" */
  updatedAt: string;
  when: TimeWindow | null;
  hidden: readonly HideKey[];
};

/** Keeps the time window and hidden layers (not the LRT line, which only the map has) across views. */
function withFilters(path: string, when: TimeWindow | null, hidden: readonly HideKey[]): string {
  const query = new URLSearchParams();
  if (when) query.set('when', when);
  const hide = serialiseHidden(hidden.filter((key) => key !== 'lrt'));
  if (hide) query.set('hide', hide);
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}

/** Page title, "Updated today at …" and the Route view / Map view switch (Figma 1:804). */
export function PanelHeader({ view, updatedAt, when, hidden }: PanelHeaderProps) {
  const copy = trafficCopy.map;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 id="traffic-title" className="type-heading-xs text-gray-900">
          {view === 'map' ? copy.header.title : trafficCopy.route.header.title}
        </h1>
        <p className="type-body-s text-gray-600">{copy.header.updated(updatedAt)}</p>
      </div>
      <SegmentedLinks
        label={copy.viewSwitch.label}
        fullWidth
        links={[
          {
            href: withFilters(routes.traffic.route, when, hidden),
            label: copy.viewSwitch.route,
            icon: <Route className="size-4" />,
            current: view === 'route',
          },
          {
            href: withFilters(routes.traffic.map, when, hidden),
            label: copy.viewSwitch.map,
            icon: <MapIcon className="size-4" />,
            current: view === 'map',
          },
        ]}
      />
    </div>
  );
}
