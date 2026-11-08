/** The two staff roles of the staff portal. The role decides the dashboard and the navigation. */
export type StaffRole = 'authority' | 'developer';

export type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  /** The organisation named on replies, e.g. "Penang Island City Council". */
  organisation: string;
  /** Work email used to log in. Null for an account that only signs in through the prototype link. */
  email: string | null;
};
