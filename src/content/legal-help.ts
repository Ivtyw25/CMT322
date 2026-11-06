import { routes } from '@/config/routes';
import { navGroups } from '@/content/nav';

export type HelpSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  after?: readonly string[];
  note?: { tone: 'warning' | 'info'; text: string };
};

export type HelpAsideCopy = {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const helpPages = [
  { label: 'Contact us', href: routes.help.contact },
  { label: 'Accessibility', href: routes.help.accessibility },
  { label: 'Sitemap', href: routes.help.sitemap },
] as const;
const legalPages = [
  { label: 'Terms & Conditions', href: routes.legal.terms },
  { label: 'Privacy policy', href: routes.legal.privacy },
] as const;
const related = {
  contact: {
    label: 'Contact us',
    href: routes.help.contact,
    description: 'Ways to reach the right team.',
  },
  home: {
    label: 'Home',
    href: routes.home,
    description: 'Search, the line at a glance and the latest updates.',
  },
} as const;

export const legalHelpCopy = {
  home: 'Home',
  help: 'Help',
  legal: 'Legal',
  groups: [
    { id: 'help', label: 'Help', items: helpPages },
    { id: 'legal', label: 'Legal', items: legalPages },
  ],
  aside: {
    title: 'Questions about this site?',
    body: 'Most questions are answered in the FAQ.',
    faq: 'Read the FAQ',
    contact: 'Contact us',
    careline: (label: string, number: string) => `${label} ${number}, 24 hours`,
  },
  demo: '',
  summaryTitle: 'In short',
  terms: {
    title: 'Terms & Conditions',
    description:
      'What you can expect from Mutiara Line Community Connect, and what we expect from you.',
    lede: 'These terms explain what you can expect from Mutiara Line Community Connect, and what we expect from you when you browse the portal, sign in, report an issue or track a ticket.',
    updated: 'Last updated 29 October 2026. Effective from 1 November 2026.',
    summary: [
      'You can browse project updates, the traffic map and FAQs without an account.',
      'You need an account to report an issue or track a ticket.',
      'Only send genuine reports, and leave out other people’s personal details.',
      'Traffic and construction information is a guide and can change at short notice. Always follow road signs and officers on site.',
      'This portal is not an emergency service. If anyone is in danger, call 999.',
    ],
    aside: {
      title: 'Questions about these terms?',
      body: 'Most questions are answered in the FAQ. You can also email help@mutiaraconnect.my.',
      primary: { label: 'Read the FAQ', href: routes.project.faq },
      secondary: { label: 'Privacy policy', href: routes.legal.privacy },
    } satisfies HelpAsideCopy,
    sections: [
      {
        id: 'about',
        title: '1. About these terms',
        paragraphs: [
          'By using the portal you agree to these terms. If you do not agree, please do not use it.',
          'These terms apply together with our Privacy policy, which explains how we collect and use your personal data.',
        ],
      },
      {
        id: 'guests',
        title: '2. Browsing as a guest',
        paragraphs: [
          'Anyone can read the public pages without an account. This includes project updates, construction progress, the traffic map, route view, announcements and FAQs.',
          'Guests cannot report an issue, upload photos or track a ticket.',
        ],
      },
      {
        id: 'account',
        title: '3. Your account',
        bullets: [
          'Create an account with your email address, or sign in with Google.',
          'Give accurate details and keep them up to date, so the team handling your report can reach you.',
          'Keep your password private. You are responsible for what happens on your account.',
          'Tell us straight away if you think someone else has used your account.',
          'If you are under 18, ask a parent or guardian before you create an account.',
        ],
      },
      {
        id: 'reporting',
        title: '4. Reporting an issue',
        paragraphs: [
          'Reports help the project team find and fix problems such as damaged roads, blocked drains, noise outside permitted hours and unsafe worksites.',
        ],
        bullets: [
          'Only report what you have seen or experienced. False or duplicate reports slow down help for others.',
          'Pin the location on the map, or describe it as precisely as you can.',
          'Avoid photos that clearly show other people’s faces, number plates or the inside of private homes.',
          'We forward your report to the project team, its contractors or the relevant authority, such as the local council. They decide how and when to act.',
          'Response times shown in the portal are targets, not guarantees.',
        ],
        note: {
          tone: 'warning',
          text: 'Not for emergencies. If someone is hurt or in danger, or you see a fire or a collapsed structure, call 999 first. You can report it here afterwards.',
        },
      },
      {
        id: 'tracking',
        title: '5. Tracking a ticket',
        paragraphs: [
          'Every report gets a ticket number. Use it on Track a ticket to see the latest status and replies from the team handling it.',
          'We may close a ticket if we need more information and do not hear back from you within 14 days. You can always open a new report.',
        ],
      },
      {
        id: 'submissions',
        title: '6. What you submit',
        paragraphs: [
          'You keep ownership of the text and photos you send. By submitting them, you allow us and the teams handling your report to use, copy and share them to investigate the issue, keep records and improve the service.',
          'We may edit or remove anything that is offensive, unlawful or shares personal data that should stay private.',
        ],
      },
      {
        id: 'information',
        title: '7. Information on the portal',
        paragraphs: [
          'Traffic, closure, construction and timeline information is a general guide. Works can change at short notice because of weather, safety or site conditions.',
        ],
        bullets: [
          'Always follow road signs, traffic officers and instructions on site.',
          'Official notices from the project owner and the authorities take priority over summaries on this portal.',
          'Maps are powered by OpenStreetMap and may not show the newest road layout.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '8. Acceptable use',
        paragraphs: ['When you use the portal, you must not:'],
        bullets: [
          'use it for anything unlawful, abusive or harassing',
          'pretend to be another person or organisation',
          'upload viruses or harmful code, or try to break or overload the portal',
          'collect data from the portal with bots or scrapers',
          'use reports to advertise or promote anything',
        ],
      },
      {
        id: 'privacy',
        title: '9. Privacy',
        paragraphs: [
          'We handle your personal data in line with the Personal Data Protection Act 2010. Our Privacy policy explains what we collect, why we collect it, and how to ask for a copy or a correction.',
        ],
      },
      {
        id: 'other-services',
        title: '10. Other services we use',
        paragraphs: [
          'The portal uses services from other providers, including Google Sign-In and OpenStreetMap. Their own terms and privacy policies apply when you use them.',
          'Links to official notices and other websites are there for convenience. We are not responsible for their content.',
        ],
      },
      {
        id: 'closing',
        title: '11. Suspending or closing accounts',
        paragraphs: [
          'We may suspend or close an account that breaks these terms, for example by sending repeated false reports or abusive messages.',
          'You can close your account at any time from your profile. Tickets that are still open will be closed.',
        ],
      },
      {
        id: 'responsibility',
        title: '12. Our responsibility',
        paragraphs: [
          'We work to keep the portal accurate and available, but we provide it as it is. As far as the law allows, we are not liable for loss caused by using the portal or relying on its information, including delays from road changes.',
          'Nothing in these terms takes away rights you have under Malaysian consumer law.',
        ],
      },
      {
        id: 'changes',
        title: '13. Changes to these terms',
        paragraphs: [
          'We may update these terms from time to time. The new date will appear at the top of this page. For important changes, we will also tell signed-in users by email or in the notification bar.',
        ],
      },
      {
        id: 'contact',
        title: '14. Law and contact',
        paragraphs: [
          'These terms are governed by the laws of Malaysia, and the courts of Malaysia will handle any dispute.',
          'Questions about these terms? Email help@mutiaraconnect.my, or call MRTCareline on 1800-88-6782, 24 hours.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [
      {
        label: 'Privacy policy',
        href: routes.legal.privacy,
        description: 'How we collect, use and protect your personal data.',
      },
      {
        label: 'Frequently asked questions',
        href: routes.project.faq,
        description: 'Answers about the works, road changes and your reports.',
      },
      {
        label: 'Report & Track',
        href: routes.reportTrack.overview,
        description: 'How reporting works, what happens next and how to follow a ticket.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    description:
      'How Mutiara Line Community Connect collects, uses and protects your personal data.',
    lede: 'How Mutiara Line Community Connect collects, uses and protects your personal data, and the choices you have.',
    updated: 'Last updated 29 October 2026. Effective from 1 November 2026.',
    summary: [
      'We only collect what we need to run your account and handle your reports.',
      'Your report goes to the team that can fix the problem. We never sell your data.',
      'Other commuters never see your name or contact details.',
      'You can download, correct or delete your data from your profile at any time.',
    ],
    aside: {
      title: 'Questions about your data?',
      body: 'Most requests can be done from your profile. You can also email help@mutiaraconnect.my.',
      primary: { label: 'Go to your profile', href: routes.account.profile },
      secondary: { label: 'Terms & Conditions', href: routes.legal.terms },
    } satisfies HelpAsideCopy,
    sections: [
      {
        id: 'information',
        title: '1. What we collect',
        bullets: [
          'Account details: your name, email address and, if you add it, your phone number.',
          'Reports: the description, location, photos and any files you upload.',
          'Google sign-in: your name, email and profile picture from Google. We never see your Google password.',
          'Basic usage data: pages visited and device type, to keep the portal working and secure.',
        ],
      },
      {
        id: 'use',
        title: '2. How we use it',
        bullets: [
          'To create and manage your account.',
          'To send your report to the team that can act on it, and to update you on its progress.',
          'To send the email alerts you choose. You can turn them off in your profile.',
          'To learn which pages help commuters and improve them.',
        ],
      },
      {
        id: 'sharing',
        title: '3. Who we share it with',
        paragraphs: [
          'We share report details with the project owner, its contractors and the relevant authority, such as the local council, only so they can investigate and fix the issue.',
          'Station pages show nearby reports by issue, area and status only. Your name and contact details are never shown.',
          'We do not sell your personal data or use it for advertising.',
        ],
      },
      {
        id: 'retention',
        title: '4. How long we keep it',
        paragraphs: [
          'We keep your account details while your account is open. Resolved tickets are kept for two years, then deleted or made anonymous.',
        ],
      },
      {
        id: 'choices',
        title: '5. Your rights',
        paragraphs: ['Under the Personal Data Protection Act 2010, you can:'],
        bullets: [
          'ask for a copy of your personal data',
          'correct details that are wrong or out of date',
          'stop email alerts at any time',
          'close your account and ask us to delete your data',
        ],
        after: ['You can do most of this from your profile, under Privacy & data.'],
      },
      {
        id: 'storage',
        title: '6. Cookies',
        paragraphs: [
          'We use essential cookies to keep you signed in and remember your settings. Analytics cookies that count visits are only used if you agree.',
        ],
      },
      {
        id: 'security',
        title: '7. Keeping your data safe',
        paragraphs: [
          'Your data is encrypted when it is sent and stored. Only the people handling your report can see its details.',
        ],
      },
      {
        id: 'contact',
        title: '8. Contact us',
        paragraphs: [
          'For privacy questions or requests, email help@mutiaraconnect.my. We reply within 21 days, as the Personal Data Protection Act 2010 requires.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [
      {
        label: 'Terms & Conditions',
        href: routes.legal.terms,
        description: 'The rules for using the portal and sending reports.',
      },
      {
        label: 'Contact us',
        href: routes.help.contact,
        description: 'Ways to reach the right team.',
      },
      {
        label: 'Frequently asked questions',
        href: routes.project.faq,
        description: 'Answers about the works, road changes and reports.',
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    description:
      'How Mutiara Line Community Connect works for everyone, and its known limitations.',
    lede: 'Everyone should be able to check road changes and report problems, whatever device or assistive technology they use.',
    updated: 'Last reviewed 29 October 2026.',
    aside: {
      title: 'Something hard to use?',
      body: 'Tell us the page and what happened, and we will fix it or send the information another way.',
      primary: { label: 'Contact us', href: routes.help.contact },
    } satisfies HelpAsideCopy,
    sections: [
      {
        id: 'standard',
        title: 'Our standard',
        paragraphs: [
          'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. Colours, type and components follow the Malaysia Government Design System (MYDS).',
        ],
      },
      {
        id: 'controls',
        title: 'What you can do on this site',
        bullets: [
          'Use every page with a keyboard alone.',
          'Use a screen reader such as NVDA, VoiceOver or TalkBack.',
          'Zoom text up to 200% without losing content.',
          'Read road changes as a list or table instead of the map.',
          'Choose Light, Dark or System appearance. The site remembers your choice.',
        ],
      },
      {
        id: 'limitations',
        title: 'Known limitations',
        bullets: [
          'The traffic map is hard to use with a screen reader. Route view and Announcements show the same information as text.',
          'Some older official notices are scanned PDFs. Ask us for an accessible version.',
          'Older site update photos may not have descriptions yet.',
        ],
        note: {
          tone: 'info',
          text: 'Need something in another format? Email help@mutiaraconnect.my and we will reply within 5 working days.',
        },
      },
      {
        id: 'feedback',
        title: 'Tell us about a problem',
        paragraphs: [
          'If part of this site is hard to use, email help@mutiaraconnect.my with the page and what happened. We aim to reply within 5 working days.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [
      {
        label: 'Route view',
        href: routes.traffic.route,
        description: 'Road changes station by station, as text.',
      },
      {
        label: 'Announcements',
        href: routes.traffic.announcements,
        description: 'Every closure in a sortable table.',
      },
      {
        label: 'Contact us',
        href: routes.help.contact,
        description: 'Ways to reach the right team.',
      },
    ],
  },
  contact: {
    title: 'Contact us',
    description: 'Ways to reach the right team about the works, this website or an urgent problem.',
    lede: 'Choose the option that fits your question, so it reaches the right team quickly.',
    sections: [
      { id: 'works', title: 'Something wrong near the works' },
      { id: 'urgent', title: 'Urgent problems' },
      { id: 'website', title: 'Questions about this website' },
      { id: 'before', title: 'Before you get in touch' },
    ],
    aside: {
      title: 'Not sure where to start?',
      body: 'Most questions are answered in the FAQ.',
      primary: { label: 'Read the FAQ', href: routes.project.faq },
    } satisfies HelpAsideCopy,
    report: {
      title: 'Report an issue',
      body: 'Damaged roads, blocked drains, noise, dust or unsafe worksites. You get a ticket number.',
      href: routes.reportTrack.report,
    },
    track: {
      title: 'Track a ticket',
      body: 'Check the status of a report you have already sent.',
      href: routes.reportTrack.track,
    },
    faq: {
      title: 'FAQ',
      body: 'Answers about the works, road changes and reports.',
      href: routes.project.faq,
    },
    announcements: {
      title: 'Announcements',
      body: 'Check whether a closure is already planned.',
      href: routes.traffic.announcements,
    },
    emergency: 'If someone is hurt or in danger, call 999 first.',
    careline:
      '24 hours, for urgent problems at a worksite such as a blocked road or fallen hoarding.',
    email: 'Account, sign-in, accessibility and privacy questions. We reply within 3 working days.',
    related: [
      {
        label: 'Accessibility',
        href: routes.help.accessibility,
        description: 'How we make the site work for everyone.',
      },
      {
        label: 'Privacy policy',
        href: routes.legal.privacy,
        description: 'How we handle your personal data.',
      },
      {
        label: 'Sitemap',
        href: routes.help.sitemap,
        description: 'Every page in one list.',
      },
    ],
  },
  sitemap: {
    title: 'Sitemap',
    description: 'Find public pages on Mutiara LRT Community Connect.',
    lede: 'Every page on Mutiara Line Community Connect, grouped the same way as the menu.',
    aside: {
      title: 'Can’t find a page?',
      body: 'Tell us what you were looking for and we will point you to it.',
      primary: { label: 'Contact us', href: routes.help.contact },
    } satisfies HelpAsideCopy,
    groups: [
      ...Object.values(navGroups).map((group) => ({
        id: group.id,
        label: group.label,
        items: group.items,
      })),
      {
        id: 'account',
        label: 'Your account',
        items: [
          { label: 'Log in', href: routes.account.login },
          { label: 'Create an account', href: routes.account.signup },
          { label: 'Profile & settings', href: routes.account.profile },
        ],
      },
      { id: 'help', label: 'Help', items: helpPages },
      { id: 'legal', label: 'Legal', items: legalPages },
    ],
    related: [related.home, related.contact],
  },
} as const;
