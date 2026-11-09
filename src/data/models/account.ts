export type AccountDevice = {
  name: string;
  current: boolean;
  /** Plain-English last activity, e.g. "yesterday". */
  lastActive: string;
};

/** Account details the profile shows beyond the base User record. */
export type AccountProfile = {
  userId: string;
  phone: string | null;
  memberSince: string;
  emailVerified: boolean;
  language: 'en' | 'ms';
  googleEmail: string | null;
  passwordLastChanged: string;
  devices: AccountDevice[];
};
