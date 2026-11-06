import { routes } from '@/config/routes';

export const notFoundCopy = {
  heading: 'We can’t find that page',
  body: 'The link may be out of date, or the page may have moved.',
  homeLink: 'Go to the home page',
  links: [
    { label: 'Project overview', href: routes.project.overview },
    { label: 'Traffic overview', href: routes.traffic.overview },
    { label: 'Report & Track', href: routes.reportTrack.overview },
    { label: 'Sitemap', href: routes.help.sitemap },
  ],
} as const;
