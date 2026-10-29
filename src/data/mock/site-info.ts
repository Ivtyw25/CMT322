import type { SiteInfo } from '@/data/models/site-info';

export const siteInfo: SiteInfo = {
  careline: {
    label: 'MRTCareline',
    number: '1800-88-6782',
    tel: 'tel:1800886782',
    description: '24-hour line for complaints about the works',
  },
  email: {
    address: 'help@mutiaraconnect.my',
    href: 'mailto:help@mutiaraconnect.my',
    description: 'Questions about this platform',
  },
  socials: ['Facebook', 'Instagram', 'X', 'YouTube', 'TikTok', 'LinkedIn'].map((name) => ({
    name,
    url: null,
  })),
};
