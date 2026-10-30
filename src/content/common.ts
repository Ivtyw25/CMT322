/** Site-wide copy. Page copy lives in one file per page group next to this one. */
export const commonCopy = {
  /** Product name, as in the footer copyright and the browser title. */
  siteName: 'Mutiara LRT Community Connect',
  /** Wordmark beside the logo (header, footer, auth pages). */
  shortName: 'Mutiara Line',
  /** Full line name for running text, e.g. "Line: LRT Mutiara Line". */
  lineName: 'LRT Mutiara Line',
  metadata: {
    titleTemplate: '%s | Mutiara LRT Community Connect',
    defaultTitle: 'Mutiara LRT Community Connect',
    description:
      'Construction news, road changes and community reports for the LRT Mutiara Line in Penang, in one place.',
  },
  skipToContent: 'Skip to main content',
  logo: {
    /** Accessible name of the logo link; the mark image itself is decorative. */
    homeLabel: 'Mutiara Line, home',
  },
  /** Messages for the shell's polite live region. */
  announcements: {
    loggedOut: 'You are logged out.',
  },
  landmarks: {
    mainNav: 'Main',
    siteMenu: 'Site menu',
    siteNotice: 'Site notice',
    footerNav: 'Footer',
    sectionPages: 'Section pages',
    onThisPage: 'On this page',
    breadcrumb: 'Breadcrumb',
  },
} as const;
