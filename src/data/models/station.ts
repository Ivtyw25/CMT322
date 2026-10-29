export type StationCode = `${'S' | 'A'}${number}`;

export type Station = {
  code: StationCode;
  name: string;
  /** Landmark or interchange line shown under the name, e.g. "KOMTAR bus terminal, KOMTAR Tower". */
  subtitle: string | null;
  /** The name is not final yet ("Provisional name" in Figma). */
  isProvisionalName: boolean;
  /** 1-based position from Penang Sentral (1) to PSR-A (22). */
  order: number;
  /** Segment 1: PSR-A to KOMTAR. Segment 2: Macallum to Penang Sentral. */
  segment: 1 | 2;
  /** Area name used to group works and filters, e.g. "George Town". */
  area: string;
};
