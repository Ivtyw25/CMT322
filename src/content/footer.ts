import { routes } from '@/config/routes';

/**
 * Footer, Figma 1:127 (desktop) and 127:5801 (mobile). Careline, email and social names come
 * from the site-info record; area options come from the area records, after "All areas".
 */
export const footerCopy = {
  description:
    'Construction news, road changes and community reports for the LRT Mutiara Line, in one place.',
  contact: {
    /** Visually hidden labels before the two contact links. */
    carelineLabel: 'Phone',
    emailLabel: 'Email',
  },
  columns: [
    {
      id: 'project',
      title: 'Project',
      links: [
        { label: 'Overview', href: routes.project.overview },
        { label: 'About the line', href: routes.project.about },
        { label: 'Stations', href: routes.project.stations },
        { label: 'Construction progress', href: routes.project.construction },
        { label: 'FAQ', href: routes.project.faq },
      ],
    },
    {
      id: 'traffic',
      title: 'Traffic',
      links: [
        { label: 'Overview', href: routes.traffic.overview },
        { label: 'Traffic map', href: routes.traffic.map },
        { label: 'Route view', href: routes.traffic.route },
        { label: 'Announcements', href: routes.traffic.announcements },
      ],
    },
    {
      id: 'report-track',
      title: 'Report & Track',
      links: [
        { label: 'Overview', href: routes.reportTrack.overview },
        { label: 'Report an issue', href: routes.reportTrack.report },
        { label: 'Track a ticket', href: routes.reportTrack.track },
      ],
    },
    {
      id: 'help',
      title: 'Help',
      links: [
        { label: 'Contact us', href: routes.help.contact },
        { label: 'Accessibility', href: routes.help.accessibility },
        { label: 'Sitemap', href: routes.help.sitemap },
      ],
    },
  ],
  newsletter: {
    title: 'Get road change alerts by email',
    body: 'Choose your area and we email you when a closure or night work is announced. Unsubscribe at any time.',
    /** Mobile has no area select (Figma 127:5801). */
    bodyMobile: 'We email you when a closure or night work is announced. Unsubscribe at any time.',
    emailLabel: 'Email address',
    emailPlaceholder: 'Email address',
    areaLabel: 'Area',
    /** First option of the area select; the rest come from the area records. */
    allAreasOption: 'All areas',
    submit: 'Get updates',
    submitting: 'Signing you up…',
    success: (email: string, area: string) =>
      `You're signed up. We'll email ${email} when road changes are announced for ${area}.`,
    /** Used for {area} in the success message when "All areas" is chosen. */
    allAreasInSentence: 'all areas',
    errors: {
      emailRequired: 'Enter your email address',
      emailInvalid: 'Enter an email address in the correct format, like name@example.com',
      sendFailed: "We couldn't sign you up just now. Check your connection and try again.",
    },
  },
  social: {
    /** Label only: the channel names are plain text, not links (owner decision). */
    title: 'MRT Corp on social media',
  },
  backToTop: 'Back to top',
  legal: {
    copyright: '© 2026 Mutiara LRT Community Connect',
    links: [
      { label: 'Privacy policy', href: routes.legal.privacy },
      { label: 'Terms & Conditions', href: routes.legal.terms },
    ],
  },
} as const;
