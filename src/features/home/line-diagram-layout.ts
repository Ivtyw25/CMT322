/** Where each station sits on the logical diagram, in px of the 1152 × 614 Figma drawing (51:2203). */
export type StationLayout = {
  /** Centre of the circle. */
  x: number;
  y: number;
  /** Outer radius of the circle, border included. */
  radius: number;
  /** Border width of the circle. */
  border: number;
  /** A stop on one of the two light branches that meet at Macallum. */
  branch?: boolean;
  /** The place where the two routes meet. */
  junction?: boolean;
  label: {
    x: number;
    y: number;
    width: number;
    height: number;
    align: 'left' | 'center';
    /** Bottom-aligned inside its box (labels above the lower row of stops). */
    anchor?: 'end';
  };
};

const R = 18.55;
const B = 4.64;
const SIDE = { width: 109.45, align: 'left' } as const;
const BELOW = { width: 92.75, align: 'center' } as const;
const ABOVE = { width: 98.32, align: 'center', anchor: 'end' } as const;

export const stationLayouts: Record<string, StationLayout> = {
  S31: {
    x: 63.1,
    y: 41.74,
    radius: R,
    border: B,
    branch: true,
    label: { x: 92.75, y: 32.74, width: 88, height: 18, align: 'left' },
  },
  S30: {
    x: 72.37,
    y: 100.17,
    radius: R,
    border: B,
    branch: true,
    label: { x: 102.03, y: 82.17, width: 99, height: 36, align: 'left' },
  },
  S19: {
    x: 178.1,
    y: 167.88,
    radius: 27.82,
    border: 6.49,
    junction: true,
    label: { x: 126.59, y: 203.13, width: 103, height: 28, align: 'center' },
  },
  S20: {
    x: 63.1,
    y: 294.94,
    radius: R,
    border: B,
    branch: true,
    label: { x: 16.7, y: 320.93, width: 92.75, height: 18, align: 'center' },
  },
  S18: {
    x: 281.06,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 234.67, y: 193.86, height: 36, ...BELOW },
  },
  S17: {
    x: 388.65,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 342.26, y: 193.86, height: 18, ...BELOW },
  },
  S16: {
    x: 497.16,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 450.78, y: 193.86, height: 18, ...BELOW },
  },
  S15: {
    x: 604.75,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 558.38, y: 193.86, height: 36, ...BELOW },
  },
  S14: {
    x: 713.27,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 666.9, y: 193.86, height: 18, ...BELOW },
  },
  S13: {
    x: 820.86,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 774.49, y: 193.86, height: 18, ...BELOW },
  },
  S12: {
    x: 929.38,
    y: 167.88,
    radius: R,
    border: B,
    label: { x: 883.01, y: 193.86, height: 18, ...BELOW },
  },
  S11: {
    x: 1005.43,
    y: 239.29,
    radius: R,
    border: B,
    label: { x: 1035.13, y: 230.3, height: 18, ...SIDE },
  },
  S10: {
    x: 1005.43,
    y: 308.85,
    radius: R,
    border: B,
    label: { x: 1035.13, y: 299.87, height: 18, ...SIDE },
  },
  S09: {
    x: 1005.43,
    y: 378.42,
    radius: R,
    border: B,
    label: { x: 1035.13, y: 369.43, height: 18, ...SIDE },
  },
  S08: {
    x: 1005.43,
    y: 451.69,
    radius: R,
    border: B,
    label: { x: 1035.13, y: 442.71, height: 18, ...SIDE },
  },
  S07: {
    x: 929.38,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 880.23, y: 502.35, height: 18, ...ABOVE },
  },
  S06: {
    x: 820.86,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 771.71, y: 502.35, height: 18, ...ABOVE },
  },
  S05: {
    x: 713.27,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 664.12, y: 502.35, height: 18, ...ABOVE },
  },
  S04: {
    x: 604.75,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 555.59, y: 502.35, height: 18, ...ABOVE },
  },
  S03: {
    x: 497.16,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 448, y: 466.35, height: 54, ...ABOVE },
  },
  S02: {
    x: 388.65,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 339.48, y: 484.35, height: 36, ...ABOVE },
  },
  A01: {
    x: 281.06,
    y: 546.29,
    radius: R,
    border: B,
    label: { x: 231.88, y: 484.35, height: 36, ...ABOVE },
  },
};

export type Callout = { x: number; y: number; width?: number; align?: 'right' };

/** Nearby-place texts, in the order of homeCopy.line.callouts[code]. */
export const calloutLayouts: Record<string, readonly Callout[]> = {
  S31: [
    { x: 254.14, y: 9.55 },
    { x: 254.14, y: 32.74 },
    { x: 254.14, y: 55.93 },
  ],
  S20: [
    { x: 102.03, y: 370.36 },
    { x: 102.03, y: 394.48 },
    { x: 102.03, y: 418.59 },
  ],
  S13: [{ x: 754.84, y: 257.2 }],
  S10: [{ x: 856.23, y: 260.26, width: 88, align: 'right' }],
  S08: [{ x: 871.38, y: 397.26 }],
  S05: [{ x: 543.68, y: 391.04, width: 126, align: 'right' }],
};

/** The two "Depot" labels. */
export const depotLayouts: readonly { x: number; y: number }[] = [
  { x: 1031.42, y: 152.12 },
  { x: 166.96, y: 510.14 },
];

export const DIAGRAM_WIDTH = 1152;
export const DIAGRAM_HEIGHT = 614;
