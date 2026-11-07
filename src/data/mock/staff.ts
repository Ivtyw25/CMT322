import type { StaffMember } from '@/data/models/staff';

/** One account per role (Figma 113:4668 and 116:4824). */
export const staffMembers: StaffMember[] = [
  {
    id: 'staff-nurul',
    name: 'Nurul Aisyah',
    role: 'authority',
    email: 'nurul.aisyah@authority.gov.my',
  },
  {
    id: 'staff-daniel',
    name: 'Daniel Lim',
    role: 'developer',
    email: null,
  },
];
