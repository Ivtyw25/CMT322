import { TriangleAlert } from 'lucide-react';
import { LineMarkerGlyph } from '@/components/patterns/line-diagram/line-marker-glyph';
import { Checkbox } from '@/components/ui/checkbox';
import { trafficCopy } from '@/content/traffic';
import type { TrafficLayer } from '@/data/models/traffic-item';
import type { HideKey } from './traffic-filters';

type LayerTogglesProps = {
  view: 'map' | 'route';
  hidden: readonly HideKey[];
  counts: Record<TrafficLayer, number>;
  onToggle: (key: HideKey) => void;
};

const mapKeys: readonly HideKey[] = ['closure', 'construction', 'hazard', 'lrt'];
const routeKeys: readonly HideKey[] = ['closure', 'construction', 'hazard'];

/** The legend swatch of a map layer (Figma 1:859 legend). */
function MapSwatch({ kind }: { kind: HideKey }) {
  if (kind === 'closure') return <span className="h-1 w-6 rounded-full bg-danger-600" />;
  if (kind === 'construction') {
    return (
      <span className="size-5 rounded-full border border-dashed border-warning-600 bg-warning-100" />
    );
  }
  if (kind === 'hazard') {
    return <TriangleAlert className="size-5 fill-danger-600 text-danger-600" />;
  }
  return (
    <span className="relative flex h-1 w-6 items-center justify-center rounded-full bg-primary-600">
      <span className="size-2 rounded-full border-2 border-primary-600 bg-surface" />
    </span>
  );
}

function Swatch({ view, kind }: { view: 'map' | 'route'; kind: HideKey }) {
  if (view === 'map') return <MapSwatch kind={kind} />;
  return kind === 'lrt' ? null : <LineMarkerGlyph kind={kind} className="size-5" />;
}

/** "Show on map" or "Show on diagram": a checkbox per layer, with its swatch and its count. */
export function LayerToggles({ view, hidden, counts, onToggle }: LayerTogglesProps) {
  const copy = trafficCopy.map.filters;
  const names = {
    closure: copy.layers.closures,
    construction: copy.layers.construction,
    hazard: copy.layers.hazards,
    lrt: copy.layers.alignment,
  } as const;
  return (
    <fieldset className="flex flex-col gap-1 md:gap-2.5">
      <legend className="mb-3 type-body-s-semibold text-gray-900">
        {view === 'map' ? copy.layersTitleMap : copy.layersTitleDiagram}
      </legend>
      {(view === 'map' ? mapKeys : routeKeys).map((key) => {
        const count = key === 'lrt' ? null : counts[key];
        return (
          <Checkbox
            key={key}
            checked={!hidden.includes(key)}
            onChange={() => onToggle(key)}
            aria-label={count === null ? names[key] : copy.layerCount(names[key], count)}
            label={
              <>
                <span aria-hidden className="flex w-6 shrink-0 items-center justify-center">
                  <Swatch view={view} kind={key} />
                </span>
                <span className="flex-1">{names[key]}</span>
                {count === null ? null : (
                  <span aria-hidden className="type-body-s text-gray-500 tabular-nums">
                    {count}
                  </span>
                )}
              </>
            }
          />
        );
      })}
    </fieldset>
  );
}
