import { staffMembers } from '@/data/mock/staff';
import type { StaffMember, StaffRole } from '@/data/models/staff';

export async function getStaffMembers(): Promise<StaffMember[]> {
  return staffMembers;
}

export async function getStaffMember(id: string): Promise<StaffMember | null> {
  return staffMembers.find((member) => member.id === id) ?? null;
}

/** The staff account for a role. The mock has exactly one per role. */
export async function getStaffMemberByRole(role: StaffRole): Promise<StaffMember | null> {
  return staffMembers.find((member) => member.role === role) ?? null;
}
