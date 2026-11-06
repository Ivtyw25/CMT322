import { routes } from '@/config/routes';
import { navGroups } from '@/content/nav';

export type HelpSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
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
  privacy: {
    label: 'Privacy policy',
    href: routes.legal.privacy,
    description: 'How this prototype uses browser data.',
  },
  terms: {
    label: 'Terms & Conditions',
    href: routes.legal.terms,
    description: 'Using this university demonstration.',
  },
  contact: {
    label: 'Contact us',
    href: routes.help.contact,
    description: 'Contact details and ways to find help.',
  },
  accessibility: {
    label: 'Accessibility',
    href: routes.help.accessibility,
    description: 'Controls, text alternatives and known limitations.',
  },
  sitemap: { label: 'Sitemap', href: routes.help.sitemap, description: 'Find a page by section.' },
  faq: {
    label: 'Frequently asked questions',
    href: routes.project.faq,
    description: 'Answers about the works, road changes and demo reports.',
  },
  report: {
    label: 'Report & Track',
    href: routes.reportTrack.overview,
    description: 'Try the simulated report and ticket journey.',
  },
  route: {
    label: 'Route view',
    href: routes.traffic.route,
    description: 'Read road changes station by station.',
  },
  announcements: {
    label: 'Announcements',
    href: routes.traffic.announcements,
    description: 'Read road changes as text.',
  },
  home: {
    label: 'Home',
    href: routes.home,
    description: 'Search, line information and project updates.',
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
    body: 'Find answers about the project and the demo reporting journey.',
    faq: 'Read the FAQ',
    contact: 'Contact us',
  },
  demo: 'University prototype: sign-in, reports and email confirmations are simulated. Do not enter sensitive or real personal information.',
  summaryTitle: 'In short',
  terms: {
    title: 'Terms & Conditions',
    description: 'What to expect when using the Mutiara Line university prototype.',
    lede: 'These terms explain how to use this university demonstration of Mutiara LRT Community Connect.',
    summary: [
      'Browse project information, road changes and FAQs without an account.',
      'Sign-in and report submissions are simulated; no report is sent to an authority.',
      'Follow road signs and instructions on site. This prototype is not an emergency service.',
    ],
    sections: [
      {
        id: 'about',
        title: '1. About these terms',
        paragraphs: [
          'This website is a USM CMT322 university project. It demonstrates a community information and feedback portal using mock data and services.',
        ],
      },
      {
        id: 'guests',
        title: '2. Browsing as a guest',
        paragraphs: [
          'Guests can read public information and try tracking a sample ticket. A demo account is needed to try reporting an issue.',
        ],
      },
      {
        id: 'account',
        title: '3. Your account',
        paragraphs: [
          'Sign-in creates a simulated session in this browser. It does not create an account with a transport operator or verify your identity. Use example details instead of a real password or personal information.',
        ],
      },
      {
        id: 'reporting',
        title: '4. Reporting an issue',
        paragraphs: [
          'The report form demonstrates issue categories, location details and attachment selection. Submitting creates a demo ticket in this browser; it does not notify a project team.',
        ],
        bullets: [
          'Use fictional details when trying the form.',
          'If someone is hurt or in danger, call 999 first. Do not rely on a demo ticket for help.',
        ],
      },
      {
        id: 'tracking',
        title: '5. Tracking a ticket',
        paragraphs: [
          'Ticket status and replies are sample data. Newly submitted demo tickets are available in the browser where they were created. No response or resolution time is promised.',
        ],
      },
      {
        id: 'submissions',
        title: '6. What you submit',
        paragraphs: [
          'Do not include private information, abusive content or images of other people. Selected attachments demonstrate the interface and are not uploaded to a server.',
        ],
      },
      {
        id: 'information',
        title: '7. Information on the portal',
        paragraphs: [
          'Road changes and construction updates are demonstration records, not a live traffic feed. Always follow current road signs and instructions from people managing the works.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '8. Acceptable use',
        bullets: [
          'Use the demonstration responsibly.',
          'Do not attempt to disrupt the site or access information that is not yours.',
          'Do not mistake simulated reports or replies for official correspondence.',
        ],
      },
      {
        id: 'privacy',
        title: '9. Privacy',
        paragraphs: [
          'The Privacy policy explains browser storage and the limits of this prototype. Avoid entering sensitive information even when a form resembles a live service.',
        ],
      },
      {
        id: 'other-services',
        title: '10. Other services we use',
        paragraphs: [
          'Maps use Leaflet with OpenStreetMap tiles and attribution. Loading a map contacts the tile provider. The Google-labelled demo sign-in action does not connect to Google or request a Google password.',
        ],
      },
      {
        id: 'closing',
        title: '11. Leaving the demonstration',
        paragraphs: [
          'Log out to end the demo session. Clear this site’s browser data to remove locally saved preferences and demo records. Clearing storage may also reset your theme and followed stations.',
        ],
      },
      {
        id: 'responsibility',
        title: '12. Our responsibility',
        paragraphs: [
          'This prototype is for coursework and demonstration. It is not a substitute for official project notices, live travel advice or emergency assistance.',
        ],
      },
      {
        id: 'changes',
        title: '13. Changes to these terms',
        paragraphs: [
          'The demonstration and this description may change as the coursework develops. Read this page again when trying a new version.',
        ],
      },
      {
        id: 'contact',
        title: '14. Questions and contact',
        paragraphs: [
          'Use Contact us to find the contact details supplied for the project. This demonstration does not provide a staffed support inbox or guarantee a reply.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [related.privacy, related.faq, related.report],
  },
  privacy: {
    title: 'Privacy policy',
    description: 'Browser storage and personal information in this university prototype.',
    lede: 'How this demonstration uses information in your browser, and what happens when you try its forms.',
    summary: [
      'Use fictional details when testing forms.',
      'Demo sessions, preferences and reports may remain in this browser.',
      'Reports, files and emails are not sent to a project team.',
    ],
    sections: [
      {
        id: 'information',
        title: '1. What we collect',
        paragraphs: [
          'The prototype displays fictional account and ticket records. Information you enter in forms is used to demonstrate validation and interface behaviour. Demo reports and account preferences may be saved in this browser. Selected files are not uploaded.',
        ],
      },
      {
        id: 'use',
        title: '2. How we use it',
        paragraphs: [
          'Browser data supports the simulated sign-in, followed stations, account settings and report journey. Theme preferences and notice dismissal help the interface remember your choices. This frontend does not send real email confirmations or alerts.',
        ],
      },
      {
        id: 'sharing',
        title: '3. Who we share it with',
        paragraphs: [
          'Submitting a demo report does not forward it to an authority, contractor or transport operator. Map tiles load from OpenStreetMap; your browser contacts that service when displaying the map. The hosting provider also receives normal requests needed to serve this website.',
        ],
      },
      {
        id: 'retention',
        title: '4. How long we keep it',
        paragraphs: [
          'Locally saved demo data can remain until you clear this site’s browser storage. Data held only in memory is lost on reload. There is no backend account or report retention service in this prototype.',
        ],
      },
      {
        id: 'choices',
        title: '5. Your choices',
        bullets: [
          'Use example information in forms.',
          'Log out to end the simulated session.',
          'Clear this site’s browser data to remove locally saved demo information and preferences.',
          'Use a separate browser profile if you want to try the prototype without existing demo data.',
        ],
      },
      {
        id: 'storage',
        title: '6. Cookies and browser storage',
        paragraphs: [
          'The frontend uses localStorage for demo state and preferences, and sessionStorage for dismissed notices. This is browser storage, not a production authentication system. If storage is blocked, some choices may not survive reloads.',
        ],
      },
      {
        id: 'security',
        title: '7. Keeping your data safe',
        paragraphs: [
          'Do not enter real passwords, identity numbers, private contact details or sensitive report content. Anyone with access to this browser may be able to view its saved demo data. This prototype does not make production security or regulatory-compliance guarantees.',
        ],
      },
      {
        id: 'contact',
        title: '8. Contact us',
        paragraphs: [
          'Contact us lists the project contact details supplied for the demonstration. Do not send sensitive information when asking about the prototype. No staffed privacy-request workflow or response deadline is provided here.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [related.terms, related.contact, related.faq],
  },
  accessibility: {
    title: 'Accessibility',
    description: 'Accessibility features and known limitations of the Mutiara Line prototype.',
    lede: 'Ways to use this prototype with a keyboard, on a small screen or through text alternatives to the map.',
    sections: [
      {
        id: 'standard',
        title: 'Our standard',
        paragraphs: [
          'We aim to make this coursework usable with keyboard navigation, clear labels, visible focus and readable contrast. The design draws on the Malaysia Government Design System. This page is not a claim of certified accessibility compliance.',
        ],
      },
      {
        id: 'controls',
        title: 'What you can do on this site',
        bullets: [
          'Use the skip link to reach the main content.',
          'Navigate links and controls with a keyboard and use Escape to close menus.',
          'Choose Light, Dark or System appearance.',
          'Read road changes in Route view and Announcements instead of relying on the map.',
          'Use the responsive layout and browser zoom to increase text size.',
        ],
      },
      {
        id: 'limitations',
        title: 'Known limitations',
        paragraphs: [
          'The interactive map is a visual interface. Route view and Announcements provide text alternatives for the demo road changes. Content is currently available in English. Sign-in, reports and support responses are simulated.',
        ],
      },
      {
        id: 'feedback',
        title: 'Tell us about a problem',
        paragraphs: [
          'If a page is difficult to use, note its title, the control involved, your browser and any assistive technology you were using. Contact us provides the supplied project email address. Do not include passwords or other sensitive information.',
        ],
      },
    ] satisfies readonly HelpSection[],
    related: [related.route, related.announcements, related.contact],
  },
  contact: {
    title: 'Contact us',
    description: 'Contact details and help for the Mutiara Line demonstration.',
    lede: 'Choose the option that fits your question. The reporting journey on this university prototype is simulated.',
    sections: [
      { id: 'works', title: 'Something wrong near the works' },
      { id: 'urgent', title: 'Urgent problems' },
      { id: 'website', title: 'Questions about this website' },
      { id: 'before', title: 'Before you get in touch' },
    ],
    report: {
      title: 'Report an issue',
      body: 'Try the demo form for roads, drains, noise, dust or unsafe worksites.',
      href: routes.reportTrack.report,
    },
    track: {
      title: 'Track a ticket',
      body: 'View a sample ticket or a demo report saved in this browser.',
      href: routes.reportTrack.track,
    },
    faq: {
      title: 'FAQ',
      body: 'Answers about the works, road changes and reporting.',
      href: routes.project.faq,
    },
    announcements: {
      title: 'Announcements',
      body: 'Read the demo closure and construction notices.',
      href: routes.traffic.announcements,
    },
    emergency:
      'If someone is hurt or in danger, call 999 first. This prototype cannot request emergency assistance.',
    careline:
      '24-hour careline. Use the supplied contact number directly for urgent worksite concerns.',
    email:
      'For account, accessibility and privacy questions. This prototype does not send messages or guarantee a reply.',
    related: [related.accessibility, related.privacy, related.sitemap],
  },
  sitemap: {
    title: 'Sitemap',
    description: 'Find public pages on Mutiara LRT Community Connect.',
    lede: 'Every main page, grouped the same way as the menu. Station details are available from Stations.',
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
          { label: 'Forgot password', href: routes.account.forgotPassword },
          { label: 'Profile & settings', href: routes.account.profile },
        ],
      },
      { id: 'help', label: 'Help', items: helpPages },
      { id: 'legal', label: 'Legal', items: legalPages },
    ],
    related: [related.home, related.contact],
  },
} as const;
