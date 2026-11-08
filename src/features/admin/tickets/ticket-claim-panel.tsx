'use client';

import { UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import type { Ticket } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { useTickets } from '@/lib/tickets';

const copy = adminCopy.ticket.claim;

/** Shown while nobody has claimed the ticket: claiming makes the staff member its handler. */
export function TicketClaimPanel({ ticket, staff }: { ticket: Ticket; staff: StaffMember }) {
  const { claim } = useTickets();
  const announce = useAnnounce();
  const [claimed, setClaimed] = useState(false);

  function handleClaim() {
    claim(ticket.id, staff);
    setClaimed(true);
    announce(copy.claimed(staff.name));
  }

  return (
    <section
      aria-labelledby="claim-heading"
      className="flex flex-col gap-4 rounded-2xl border border-primary-200 bg-primary-50 p-5 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h2 id="claim-heading" className="type-heading-3xs text-gray-900">
          {copy.title}
        </h2>
        <p className="type-body-s text-gray-700">{copy.body}</p>
      </div>
      <Button
        onClick={handleClaim}
        disabled={claimed}
        icon={<UserCheck aria-hidden className="size-4" />}
        className="shrink-0 self-start md:self-auto"
      >
        {copy.action}
      </Button>
    </section>
  );
}
