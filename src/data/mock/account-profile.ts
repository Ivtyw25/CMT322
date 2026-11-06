import type { AccountProfile } from '@/data/models/account';

/** Profile extras for the mock user (Figma 92:2963). Stations and tickets come from their own data. */
export const mockAccountProfile: AccountProfile = {
  userId: 'user-meiling',
  phone: '+60 12-345 6789',
  memberSince: 'March 2026',
  emailVerified: true,
  language: 'en',
  googleEmail: 'meiling.tan@gmail.com',
  passwordLastChanged: '2 months ago',
  devices: [
    { name: 'Chrome on Windows', current: true, lastActive: 'now' },
    { name: 'Safari on iPhone', current: false, lastActive: 'yesterday' },
  ],
  notifications: {
    'ticket-updates': true,
    'road-closures': true,
    'night-works': true,
    'construction-milestones': false,
    newsletter: false,
  },
};
