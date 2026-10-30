export type MapPoint = { lat: number; lng: number };

export type MapMarker = MapPoint & {
  id: string;
  /** Name of the place, for screen readers and the hover tooltip. */
  label: string;
  /** Text in the marker (a station code). Without it the marker is a plain dot. */
  code?: string;
};

export type LocationMapProps = {
  center: MapPoint;
  zoom: number;
  markers?: readonly MapMarker[];
  /** Name of the map for screen readers, e.g. "Map of worksites around Komtar". */
  label: string;
  /** Label of the button that re-centres the map ("Centre on Komtar"). No label, no button. */
  centreLabel?: string;
  /** Shown over the map when the tiles cannot load. */
  unavailableText?: string;
  /**
   * `snippet` is a small map inside a page: no scroll-wheel zoom, and one finger scrolls the
   * page on touch screens. `full` is a map page: wheel zoom and one-finger pan.
   */
  interaction?: 'snippet' | 'full';
  /** Size and shape of the map box (height, aspect ratio, radius). */
  className?: string;
};
