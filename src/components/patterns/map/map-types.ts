export type MapPoint = { lat: number; lng: number };

/**
 * `code` is a station-code chip, `dot` a plain dot (both unchanged). `closure` and `hazard` are
 * 22 px glyphs on a 44 px hit area: a no-entry circle and a warning triangle.
 */
export type MapMarkerVariant = 'code' | 'dot' | 'closure' | 'hazard';

export type MapMarker = MapPoint & {
  id: string;
  /** Name of the place, for screen readers and the hover tooltip. */
  label: string;
  /** Text in the marker (a station code). Without it the marker is a plain dot. */
  code?: string;
  /** Look of the marker. Default: `code` when there is a `code`, otherwise `dot`. */
  variant?: MapMarkerVariant;
  /** Draws the halo and lifts the marker above the others. `selectedId` does the same. */
  selected?: boolean;
};

/** A dashed circle around an area, e.g. a construction zone. */
export type MapZone = MapPoint & {
  id: string;
  /** Radius in metres. */
  radiusM: number;
  selected?: boolean;
  /** Name for screen readers. */
  label?: string;
};

/** A line through points, with a small dot at each point (the LRT alignment). Not interactive. */
export type MapLine = {
  id: string;
  points: readonly MapPoint[];
  variant: 'line';
};

/** A text tag shown from `minZoom` upwards. Not interactive. */
export type MapLabel = MapPoint & {
  id: string;
  text: string;
  minZoom: number;
};

export type LocationMapProps = {
  center: MapPoint;
  zoom: number;
  markers?: readonly MapMarker[];
  /** Name of the map for screen readers, e.g. "Map of worksites around Komtar". */
  label: string;
  /** Label of the button that re-centres the map ("Centre on Komtar"). No label, no button. */
  centreLabel?: string;
  /** Shown over the map when the tiles cannot load (also the `tileErrorText` of the spec). */
  unavailableText?: string;
  /**
   * `snippet` is a small map inside a page: no scroll-wheel zoom, and one finger scrolls the
   * page on touch screens. `full` is a map page: wheel zoom and one-finger pan.
   */
  interaction?: 'snippet' | 'full';
  /** Size and shape of the map box (height, aspect ratio, radius). */
  className?: string;
  zones?: readonly MapZone[];
  lines?: readonly MapLine[];
  labels?: readonly MapLabel[];
  /** The marker or zone that is selected (halo, on top, popup open). */
  selectedId?: string | null;
  /** A marker or zone was clicked, or chosen with Enter. */
  onSelect?: (id: string) => void;
  /** The empty map was clicked, or the popup was closed. */
  onDeselect?: () => void;
  /** Content of the popup of a marker or zone. Without it nothing opens. */
  renderPopup?: (id: string) => React.ReactNode;
  /** Pan to this item and open its popup. Change `focusKey` to do it again for the same id. */
  focusId?: string | null;
  focusKey?: number;
  /** The reset button fits the map to these points (24 px padding). Default: `center` and `zoom`. */
  resetBounds?: readonly MapPoint[];
};
