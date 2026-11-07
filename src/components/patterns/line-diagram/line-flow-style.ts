/**
 * Where a drawn path sits along the route the water travels (line-flow.css), as shares of the
 * whole route from A01 (0) to the far end of the longest branch (1). A path fills while the water
 * level passes from `start` to `end`, so every path fills at the same speed and the flow carries
 * straight on from the main line into the branches.
 */
export type FlowSpan = {
  start: number;
  end: number;
  /** 1 fills the path from its start, -1 from its end. */
  from: 1 | -1;
};

export type FlowStyle = React.CSSProperties & {
  '--flow-from': number;
  '--flow-start': number;
  '--flow-end': number;
};

export function flowStyle({ start, end, from }: FlowSpan): FlowStyle {
  return { '--flow-from': from, '--flow-start': start, '--flow-end': end };
}

type Span = Omit<FlowSpan, 'from'>;

/**
 * The span of the main line from A01, given its length and the whole route's (the main line plus
 * the longest branch), in any one unit.
 */
export function mainSpan(mainLength: number, routeLength: number): Span {
  return { start: 0, end: routeLength > 0 ? mainLength / routeLength : 1 };
}

/** The span of a branch that leaves from the end of the main line. */
export function branchSpan(mainLength: number, branchLength: number, routeLength: number): Span {
  if (routeLength <= 0) return { start: 1, end: 1 };
  return { start: mainLength / routeLength, end: (mainLength + branchLength) / routeLength };
}
