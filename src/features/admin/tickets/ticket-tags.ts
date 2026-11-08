import type { TagKind } from '@/components/ui/tag';
import type { TicketPriority, TicketStatus } from '@/data/models/ticket';

export const statusTagOf: Record<TicketStatus, TagKind> = {
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

export const priorityTagOf: Record<TicketPriority, TagKind> = {
  normal: 'normal',
  high: 'highPriority',
};
