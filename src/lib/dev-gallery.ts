/**
 * The dev gallery is off in production, except in the test build that `npm run verify` makes
 * (DEV_GALLERY=1), so behaviour tests can run against `next start` instead of `next dev`.
 * Vercel builds never set DEV_GALLERY, so the live site always 404s on /dev.
 */
export const devGalleryEnabled =
  process.env.NODE_ENV !== 'production' || process.env.DEV_GALLERY === '1';
