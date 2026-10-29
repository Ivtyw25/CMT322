import { Inter, Poppins } from 'next/font/google';

/** Headings: Poppins SemiBold; Light and Bold for the home hero only. Exposed as --font-poppins and used by the type-heading-* utilities. */
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

/** Body: Inter Regular, Medium and Semi Bold. Exposed as --font-inter. */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});
