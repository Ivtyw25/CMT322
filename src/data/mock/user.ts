import type { User } from '@/data/models/user';

/** The simulated signed-in user (docs/BRIEFING.md §8). */
export const mockUser: User = {
  id: 'user-meiling',
  name: 'Tan Mei Ling',
  email: 'meiling.tan@example.com',
  homeArea: 'George Town',
  followedStationCodes: ['S20', 'S13'],
};
