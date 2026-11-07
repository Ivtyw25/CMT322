import { BRANCH_CODE, JUNCTION_CODE } from '@/data/api/line-alignment';
import { branchSpan, mainSpan, type FlowSpan } from './line-flow-style';

/** Width of the zigzag viewBox. Everything is placed in these units and scales with the container. */
export const ZIGZAG_WIDTH = 1000;

export type ZigzagColumns = 3 | 4 | 5 | 6;

/** Row height as a share of the column spacing: fewer columns means narrower labels, so taller rows. */
const ROW_RATIO: Record<ZigzagColumns, number> = { 3: 1.35, 4: 1.1, 5: 0.95, 6: 0.85 };

/** Line thickness as a share of the column spacing. */
const STROKE_RATIO: Record<ZigzagColumns, number> = { 3: 0.05, 4: 0.05, 5: 0.045, 6: 0.04 };

/** How far a U-turn reaches past the end stops, in column spacings. Wide enough to clear the end labels. */
const TURN_REACH = 0.65;

/** Clear space beyond the outer edge of each U-turn, in column spacings, on top of half the line. */
const EDGE_GAP = 0.03;

/** Space above the first row and below the last, in row heights (the rows hold the labels). */
const TOP_SPACE = 0.3;
const BOTTOM_SPACE = 0.85;

export type ZigzagNode<Station> = {
  station: Station;
  /** Centre of the stop, in viewBox units. */
  x: number;
  y: number;
};

export type ZigzagPath = {
  id: 'main' | 'tail' | 'stub';
  d: string;
  /** Its share of the route for the water flow: the main line first, then both branches at once. */
  flow: FlowSpan;
};

export type ZigzagLayout<Station> = {
  width: number;
  height: number;
  /** Distance between neighbouring stops in a row. */
  step: number;
  strokeWidth: number;
  /** In reading order: the main line from A01 to the junction, then the stop on the stub, then the tail. */
  nodes: ZigzagNode<Station>[];
  paths: ZigzagPath[];
};

type Point = { x: number; y: number; row: number };

/** Length of half an ellipse with these radii (Ramanujan's approximation). */
function halfEllipseLength(a: number, b: number): number {
  return (Math.PI / 2) * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

/**
 * One continuous path through the points: straight along a row, a half ellipse at each U-turn.
 * Also returns its length, which times the water flow.
 */
function pathThrough(
  points: readonly Point[],
  rowHeight: number,
  reach: number,
): { d: string; length: number } {
  const [first, ...rest] = points;
  if (!first) return { d: '', length: 0 };
  let previous = first;
  let length = 0;
  const parts = [`M${first.x} ${first.y}`];
  for (const point of rest) {
    if (point.row === previous.row) {
      parts.push(`L${point.x} ${point.y}`);
      length += Math.abs(point.x - previous.x);
    } else {
      const sweep = previous.row % 2 === 0 ? 1 : 0;
      parts.push(`A${reach} ${rowHeight / 2} 0 0 ${sweep} ${point.x} ${point.y}`);
      length += halfEllipseLength(reach, rowHeight / 2);
    }
    previous = point;
  }
  return { d: parts.join(''), length };
}

/**
 * Lays the line out as a snake (owner decision 2026-11-07): A01 at the top left, left to right on
 * the first row, right to left on the next, and so on, to the junction S19. The line goes on
 * through S30 and S31 in the same snake, and a short stub drops straight down from S19 to S20.
 * `stations` are in line order (S31 first), as the data returns them.
 */
export function zigzagLayout<Station extends { code: string }>(
  stations: readonly Station[],
  columns: ZigzagColumns,
): ZigzagLayout<Station> {
  const fromStart = [...stations].reverse();
  const junctionIndex = fromStart.findIndex((station) => station.code === JUNCTION_CODE);
  const stub = fromStart.find((station) => station.code === BRANCH_CODE);
  const main = fromStart
    .slice(0, junctionIndex + 1)
    .filter((station) => station.code !== BRANCH_CODE);
  const tail = fromStart.slice(junctionIndex + 1);
  const snake = [...main, ...tail];

  // The U-turns bulge past the end stops by `reach`; keep their outer edge, plus half the line
  // thickness, inside the viewBox so the curve is never cut off at the sides.
  const edge = STROKE_RATIO[columns] / 2 + EDGE_GAP;
  const step = ZIGZAG_WIDTH / (columns - 1 + 2 * TURN_REACH + 2 * edge);
  const reach = step * TURN_REACH;
  const inset = step * edge + reach;
  const rowHeight = step * ROW_RATIO[columns];

  const snakePoint = (index: number): Point => {
    const row = Math.floor(index / columns);
    const place = index % columns;
    const column = row % 2 === 0 ? place : columns - 1 - place;
    return { x: inset + column * step, y: rowHeight * (TOP_SPACE + row), row };
  };
  const points = snake.map((_, index) => snakePoint(index));
  const junction = points[main.length - 1];
  const stubPoint = junction && { ...junction, y: junction.y + rowHeight, row: junction.row + 1 };

  const rows = Math.max(...points.map((point) => point.row), stubPoint?.row ?? 0) + 1;
  const nodes: ZigzagNode<Station>[] = main.map((station, index) => ({
    station,
    x: points[index]?.x ?? 0,
    y: points[index]?.y ?? 0,
  }));
  if (stub && stubPoint) nodes.push({ station: stub, x: stubPoint.x, y: stubPoint.y });
  tail.forEach((station, index) => {
    const point = points[main.length + index];
    if (point) nodes.push({ station, x: point.x, y: point.y });
  });

  const mainPath = pathThrough(points.slice(0, main.length), rowHeight, reach);
  const tailPath =
    junction && tail.length > 0
      ? pathThrough(points.slice(main.length - 1), rowHeight, reach)
      : null;
  const stubPath =
    junction && stubPoint
      ? { d: `M${junction.x} ${junction.y}L${stubPoint.x} ${stubPoint.y}`, length: rowHeight }
      : null;
  const route = mainPath.length + Math.max(tailPath?.length ?? 0, stubPath?.length ?? 0);

  const paths: ZigzagPath[] = [
    { id: 'main', d: mainPath.d, flow: { ...mainSpan(mainPath.length, route), from: 1 } },
  ];
  if (tailPath) {
    const span = branchSpan(mainPath.length, tailPath.length, route);
    paths.push({ id: 'tail', d: tailPath.d, flow: { ...span, from: 1 } });
  }
  if (stubPath) {
    const span = branchSpan(mainPath.length, stubPath.length, route);
    paths.push({ id: 'stub', d: stubPath.d, flow: { ...span, from: 1 } });
  }

  return {
    width: ZIGZAG_WIDTH,
    height: rowHeight * (TOP_SPACE + rows - 1 + BOTTOM_SPACE),
    step,
    strokeWidth: step * STROKE_RATIO[columns],
    nodes,
    paths,
  };
}
