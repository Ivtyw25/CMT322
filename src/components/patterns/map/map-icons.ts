import L from 'leaflet';
import type { MapLabel, MapMarker } from './map-types';

/** lucide "triangle-alert" paths, drawn inline because Leaflet icons are plain HTML. */
const TRIANGLE_PATH =
  'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01';

const HALO =
  '<span class="absolute size-11 rounded-full bg-static-on-navy-100 opacity-0 transition-opacity duration-(--duration-fast) group-data-[selected=true]:opacity-100"></span>';

function glyphHtml(variant: 'closure' | 'hazard'): string {
  const glyph =
    variant === 'closure'
      ? '<span class="relative flex size-5.5 items-center justify-center rounded-full border-2 border-static-white bg-danger-600 shadow-control"><span class="h-0.5 w-2.5 rounded-full bg-static-white"></span></span>'
      : `<svg class="relative size-5.5 fill-danger-600 text-static-white drop-shadow-sm" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${TRIANGLE_PATH}"/></svg>`;
  return `<span class="relative flex size-11 items-center justify-center">${HALO}${glyph}</span>`;
}

const Z_OFFSET = { dot: 0, code: 0, closure: 100, hazard: 200 } as const;
export const SELECTED_Z_OFFSET = 1000;

export function variantOf(marker: MapMarker): NonNullable<MapMarker['variant']> {
  return marker.variant ?? (marker.code ? 'code' : 'dot');
}

export function zOffsetOf(marker: MapMarker): number {
  return Z_OFFSET[variantOf(marker)];
}

/** The Leaflet icon of a marker. Selection is a `data-selected` attribute on the icon element. */
export function markerIcon(marker: MapMarker): L.DivIcon {
  const variant = variantOf(marker);
  if (variant === 'closure' || variant === 'hazard') {
    return L.divIcon({
      html: glyphHtml(variant),
      className: 'group',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }
  const element = document.createElement('span');
  element.className =
    variant === 'code'
      ? 'absolute -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-static-white bg-primary-700 px-1.5 py-0.5 type-body-xs-semibold whitespace-nowrap text-static-white shadow-control'
      : 'absolute block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-static-white bg-primary-600 shadow-control';
  if (variant === 'code' && marker.code) element.textContent = marker.code;
  return L.divIcon({ html: element, className: 'overflow-visible', iconSize: [0, 0] });
}

/** A text tag. It does not take clicks or focus. */
export function labelIcon(label: MapLabel): L.DivIcon {
  const element = document.createElement('span');
  element.className =
    'absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-static-white px-2 py-1 type-body-xs-semibold whitespace-nowrap text-static-navy shadow-map-control';
  element.textContent = label.text;
  return L.divIcon({ html: element, className: 'overflow-visible', iconSize: [0, 0] });
}
