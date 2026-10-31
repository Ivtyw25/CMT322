/** Words of the Mutiara Line diagram and rail, shared by Home and Route view. */
export const lineDiagramCopy = {
  /** Accessible name of each station link (rail, diagram) and map marker: "S20 KOMTAR". */
  stationLabel: (code: string, name: string) => `${code} ${name}`,
  /** Added to stationLabel for a provisional name. */
  provisionalSuffix: ', provisional name',
  /** Added to stationLabel for S19 Macallum. */
  junctionSuffix: ', where the two routes meet',
  /** Short form under a provisional name in the diagram. The rail uses "Provisional name". */
  provisionalShort: '(provisional)',
  depot: 'Depot',
  legend: {
    line: 'Mutiara Line',
    nearby: 'Nearby places',
    station: 'Elevated station',
    junction: 'Junction: the two routes meet at Macallum',
  },
  /**
   * Nearby-place call-outs on the desktop diagram, keyed by the station they point to.
   * Diagram labels from Figma, not station records. Keep each to two lines.
   */
  callouts: {
    S31: [
      'KTM Butterworth',
      'Sultan Abdul Halim Ferry Terminal, Butterworth',
      'Rapid Penang bus terminal (local and interstate express)',
    ],
    S20: ['KOMTAR bus terminal', 'KOMTAR Tower', 'George Town UNESCO World Heritage Site'],
    S13: ['USM'],
    S10: ['Sungai Nibong bus terminal'],
    S08: ['SPICE Arena'],
    S05: ['Bayan Lepas Free Industrial Zone (FIZ)'],
  },
} as const;
