import type { ReportCategory } from '@/data/models/ticket';

/** Report form "Category" options, in the order the select lists them. Figma shows the first. */
export const reportCategories: ReportCategory[] = [
  {
    id: 'blocked-access',
    label: 'Blocked access to home or business',
    shortLabel: 'blocked access',
    hint: 'Hoarding, materials or site vehicles blocking a door, gate or driveway.',
  },
  {
    id: 'noise',
    label: 'Noise or vibration',
    shortLabel: 'noise or vibration',
    hint: 'Tell us the time it happened. Works normally run from 7 am to 7 pm.',
  },
  {
    id: 'dust',
    label: 'Dust, mud or dirty roads',
    shortLabel: 'dust or mud',
    hint: 'Dust from a worksite, or mud and debris left on the road.',
  },
  {
    id: 'road-damage',
    label: 'Damaged road or footpath',
    shortLabel: 'damaged road',
    hint: 'Potholes, loose road plates or broken paving near the works.',
  },
  {
    id: 'drainage',
    label: 'Blocked drain or flooding',
    shortLabel: 'drain or flooding',
    hint: 'Drains blocked by the works, or water pooling after rain.',
  },
  {
    id: 'traffic',
    label: 'Traffic, detours or signs',
    shortLabel: 'traffic or signs',
    hint: 'Missing or confusing signs, or a detour that does not work.',
  },
  {
    id: 'safety',
    label: 'Unsafe worksite or hazard',
    shortLabel: 'safety hazard',
    hint: 'If anyone is in danger now, call 999 first.',
  },
  {
    id: 'property',
    label: 'Damage to property',
    shortLabel: 'property damage',
    hint: 'Cracks or other damage you think the works caused. Add photos if you can.',
  },
  {
    id: 'other',
    label: 'Something else',
    shortLabel: 'other',
    hint: 'Questions or suggestions that do not fit another category.',
  },
];
