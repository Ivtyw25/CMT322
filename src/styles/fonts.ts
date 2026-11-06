import localFont from 'next/font/local';

/** Headings: Poppins SemiBold; Light and Bold for the home hero only. Exposed as --font-poppins and used by the type-heading-* utilities. */
export const poppins = localFont({
  src: [
    { path: '../assets/fonts/poppins-latin-300.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/poppins-latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/poppins-latin-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-poppins',
});

/** Body: Inter Regular, Medium and Semi Bold. Exposed as --font-inter. */
export const inter = localFont({
  src: '../assets/fonts/inter-latin-variable.woff2',
  weight: '400 600',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
});
