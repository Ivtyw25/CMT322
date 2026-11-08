/** The drawing is 760 × 380 units; HTML stop buttons are placed with percentages of it. */
export const DIAGRAM_WIDTH = 760;
export const DIAGRAM_HEIGHT = 380;
/** Everything is drawn with this y offset so the box has no dead space above the first stop. */
export const DIAGRAM_TOP = 24;

export type LabelSide = 'above' | 'below' | 'right' | 'left';

export type StopLayout = {
  x: number;
  y: number;
  label: LabelSide;
  /** Longest line of the name before it wraps. Default 12 characters. */
  wrapAt?: number;
  /** The stop sits on the lighter, planned part of the line. */
  light?: boolean;
  /** The one interchange stop (Macallum). */
  interchange?: boolean;
};

/** Station positions, taken from the Figma route diagram (1:332). Not to scale, by design. */
export const stopLayout: Readonly<Record<string, StopLayout | undefined>> = {
  S31: { x: 60, y: 63, label: 'right', wrapAt: 8, light: true },
  S30: { x: 67, y: 98, label: 'right', wrapAt: 40, light: true },
  S19: { x: 133, y: 141, label: 'below', interchange: true },
  S20: { x: 60, y: 221, label: 'below', light: true },
  S18: { x: 196, y: 141, label: 'below' },
  S17: { x: 263, y: 141, label: 'below' },
  S16: { x: 331, y: 141, label: 'below' },
  S15: { x: 399, y: 141, label: 'below' },
  S14: { x: 466, y: 141, label: 'below' },
  S13: { x: 533, y: 141, label: 'below' },
  S12: { x: 601, y: 141, label: 'below' },
  S11: { x: 649, y: 185, label: 'right', wrapAt: 40 },
  S10: { x: 649, y: 229, label: 'right', wrapAt: 40 },
  S09: { x: 649, y: 272, label: 'right', wrapAt: 40 },
  S08: { x: 649, y: 318, label: 'right', wrapAt: 40 },
  S07: { x: 601, y: 377, label: 'above' },
  S06: { x: 534, y: 377, label: 'above' },
  S05: { x: 466, y: 377, label: 'above' },
  S04: { x: 399, y: 377, label: 'above' },
  S03: { x: 331, y: 377, label: 'above' },
  S02: { x: 263, y: 377, label: 'above' },
  A01: { x: 196, y: 377, label: 'above' },
};

/** Where each station's nearby places are written (first line baseline). */
export const placesLayout: Readonly<
  Record<string, { x: number; y: number; wrapAt?: number } | undefined>
> = {
  S31: { x: 170, y: 52 },
  S20: { x: 85, y: 277 },
  S13: { x: 528, y: 98 },
  S10: { x: 535, y: 226, wrapAt: 14 },
  S08: { x: 536, y: 295 },
  S05: { x: 420, y: 297 },
};

/** Dotted leader lines from a stop (or its label) to the pin of its first place. */
export const leaders: readonly string[] = [
  'M 127 62 H 151',
  'M 60 260 V 272 H 68',
  'M 533 106 V 116',
  'M 617 229 H 631',
  'M 608 290 H 626 L 637 305',
  'M 466 334 V 305',
];

/** Path of the solid line (Macallum to PSR-A) and the lighter branches. */
export const solidPath = 'M 133 141 H 601 A 48 44 0 0 1 649 185 V 318 A 48 59 0 0 1 601 377 H 196';
export const lightPaths: readonly string[] = [
  'M 60 63 L 67 98 Q 80 135 133 141',
  'M 133 141 C 80 150 60 180 60 221',
];

/** Splits a name into lines of at most `max` characters, breaking between words. */
export function wrapLabel(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max)
      lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}
