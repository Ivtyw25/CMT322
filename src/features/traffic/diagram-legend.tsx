import { MapPin } from 'lucide-react';
import { LineMarkerGlyph } from '@/components/patterns/line-diagram/line-marker-glyph';
import { trafficCopy } from '@/content/traffic';

function Item({ swatch, children }: { swatch: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 type-body-s text-gray-700">
      <span aria-hidden className="flex w-6.5 shrink-0 items-center justify-center">
        {swatch}
      </span>
      {children}
    </li>
  );
}

/** The key under the route diagram (Figma 5:843). Plain text, nothing to focus. */
export function DiagramLegend() {
  const copy = trafficCopy.route.diagram.legend;
  return (
    <ul aria-label={copy.title} className="flex flex-wrap gap-x-6 gap-y-2">
      <Item swatch={<span className="h-1.25 w-6.5 rounded-full bg-primary-600" />}>
        {copy.line}
      </Item>
      <Item
        swatch={<span className="size-4.5 rounded-full border-3 border-primary-600 bg-surface" />}
      >
        {copy.station}
      </Item>
      <Item
        swatch={<span className="size-4.5 rounded-full border-4 border-primary-800 bg-surface" />}
      >
        {copy.interchange}
      </Item>
      <Item swatch={<MapPin className="size-4.5 fill-gray-700 text-gray-700" />}>{copy.place}</Item>
      <Item swatch={<LineMarkerGlyph kind="construction" className="w-6.5" />}>
        {copy.worksite}
      </Item>
      <Item swatch={<LineMarkerGlyph kind="closure" className="size-4.5" />}>{copy.closure}</Item>
      <Item swatch={<LineMarkerGlyph kind="hazard" className="size-4.5" />}>{copy.hazard}</Item>
    </ul>
  );
}
