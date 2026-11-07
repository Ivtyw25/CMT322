import {
  Accessibility,
  CircleHelp,
  ClipboardList,
  HardHat,
  Info,
  Mail,
  Map,
  MapPin,
  Megaphone,
  MessageSquareWarning,
  Network,
  Route,
  Ticket,
  TrafficCone,
  TrainFront,
  type LucideIcon,
} from 'lucide-react';
import type { NavGroupId } from './nav-groups';

/** The icon shown beside each page in the desktop nav panels, by group and item id. */
export const navItemIcons: Record<NavGroupId, Record<string, LucideIcon>> = {
  project: {
    overview: Info,
    about: TrainFront,
    stations: MapPin,
    construction: HardHat,
    faq: CircleHelp,
  },
  traffic: {
    overview: TrafficCone,
    map: Map,
    route: Route,
    announcements: Megaphone,
  },
  'report-track': {
    overview: ClipboardList,
    report: MessageSquareWarning,
    track: Ticket,
  },
  help: {
    contact: Mail,
    accessibility: Accessibility,
    sitemap: Network,
  },
};
