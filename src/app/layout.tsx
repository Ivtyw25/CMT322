import type { Metadata, Viewport } from 'next';
import { commonCopy } from '@/content/common';
import { getSiteNotice } from '@/data/api/announcements';
import { getNow } from '@/data/api/clock';
import { getTickets } from '@/data/api/tickets';
import { getCurrentUser } from '@/data/api/user';
import { AnnouncerProvider } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { FollowsProvider } from '@/lib/follows';
import { SessionProvider } from '@/lib/session';
import { TicketsProvider } from '@/lib/tickets';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { buildShellScript } from '@/lib/theme/theme-script';
import { googleSans, poppins } from '@/styles/fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: commonCopy.metadata.defaultTitle, template: commonCopy.metadata.titleTemplate },
  description: commonCopy.metadata.description,
  applicationName: commonCopy.siteName,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [user, notice, demoTickets, mockNow] = await Promise.all([
    getCurrentUser(),
    getSiteNotice(),
    getTickets(),
    getNow(),
  ]);
  return (
    <html
      lang="en-MY"
      className={cn(poppins.variable, googleSans.variable)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildShellScript(notice?.id ?? null) }} />
      </head>
      <body>
        <ThemeProvider>
          <SessionProvider user={user}>
            <FollowsProvider accountCodes={user.followedStationCodes}>
              <AnnouncerProvider>
                <TicketsProvider demoTickets={demoTickets} mockNow={mockNow}>
                  {children}
                </TicketsProvider>
              </AnnouncerProvider>
            </FollowsProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
