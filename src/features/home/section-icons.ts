import {
  CalendarDays,
  Camera,
  CircleHelp,
  Flag,
  Gauge,
  Info,
  Map,
  PersonStanding,
  Search,
  Shield,
  Signpost,
  Ticket,
  Truck,
  type LucideIcon,
} from 'lucide-react';

/** The icons named in the Home guide and safety copy (lucide names, as in Figma). */
export const sectionIcons = {
  info: Info,
  camera: Camera,
  map: Map,
  'calendar-days': CalendarDays,
  flag: Flag,
  ticket: Ticket,
  search: Search,
  'circle-help': CircleHelp,
  signpost: Signpost,
  'person-standing': PersonStanding,
  truck: Truck,
  shield: Shield,
  gauge: Gauge,
} as const satisfies Record<string, LucideIcon>;

export type SectionIconName = keyof typeof sectionIcons;
