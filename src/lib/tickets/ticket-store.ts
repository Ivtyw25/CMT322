import type { Ticket } from '@/data/models/ticket';
import { createRecordStore } from '@/lib/staff-records/record-store';

/** localStorage key of the shared ticket store: new reports and every staff change, over the demo tickets. */
export const TICKETS_STORAGE_KEY = 'mlc-tickets';

export const ticketStore = createRecordStore<Ticket>(TICKETS_STORAGE_KEY);
