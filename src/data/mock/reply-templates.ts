import type { ReplyTemplate } from '@/data/models/ticket';

/** Starting points for a staff reply: each fills the subject and the description. */
export const replyTemplates: ReplyTemplate[] = [
  {
    id: 'action-scheduled',
    label: 'Action scheduled',
    subject: 'Action scheduled for your report',
    body: 'Hello, thank you for your report. The site team has scheduled action and we will update this ticket once the work is done.',
  },
  {
    id: 'more-information',
    label: 'More information needed',
    subject: 'We need a little more information',
    body: 'Hello, thank you for your report. Could you reply with the time it happened and a photo of the exact spot so the site team can find it?',
  },
  {
    id: 'resolved',
    label: 'Resolved',
    subject: 'The work on your report is done',
    body: 'Hello, the work on your report is done. Please reply to this ticket if the problem comes back.',
  },
];
