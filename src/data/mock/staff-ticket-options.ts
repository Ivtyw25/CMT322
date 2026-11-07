import type { Assignee, ReplyTemplate } from '@/data/models/staff-ticket';

/** The teams a ticket can be assigned to (Figma 115:4681 "Assigned to" column). */
export const assignees: Assignee[] = [
  { id: 'mrt-corp', label: 'MRT Corp project team' },
  { id: 'traffic-contractor', label: 'Traffic management contractor' },
  { id: 'council-road-works', label: 'City council road works' },
  { id: 'council-drainage', label: 'City council drainage' },
];

/** Starting points for "Reply to the reporter". Figma shows "Action scheduled". */
export const replyTemplates: ReplyTemplate[] = [
  {
    id: 'action-scheduled',
    label: 'Action scheduled',
    body: 'Hello, thank you for your report. The site team has scheduled action and we will update this ticket once the work is done.',
  },
  {
    id: 'more-information',
    label: 'More information needed',
    body: 'Hello, thank you for your report. Could you reply with the time it happened and a photo of the exact spot so the site team can find it?',
  },
  {
    id: 'resolved',
    label: 'Resolved',
    body: 'Hello, the work on your report is done. Please reply to this ticket if the problem comes back.',
  },
];
