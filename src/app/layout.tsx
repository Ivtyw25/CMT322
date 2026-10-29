import type { Metadata, Viewport } from 'next';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { themeScript } from '@/lib/theme/theme-script';
import { inter, poppins } from '@/styles/fonts';
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-MY" className={cn(poppins.variable, inter.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
