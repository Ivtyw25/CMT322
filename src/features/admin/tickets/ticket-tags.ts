import type { TagKind } from '@/components/ui/tag';
import type { StaffTicketStatus, TicketPriority } from '@/data/models/staff-ticket';

export const statusTagOf: Record<StaffTicketStatus, TagKind> = {
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

export const priorityTagOf: Record<TicketPriority, TagKind> = {
  normal: 'normal',
  high: 'highPriority',
};
