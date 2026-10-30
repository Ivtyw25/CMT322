import { mockUser } from '@/data/mock/user';
import type { User } from '@/data/models/user';

/** The simulated account behind "Signed in as Tan Mei Ling". */
export async function getCurrentUser(): Promise<User> {
  return mockUser;
}
