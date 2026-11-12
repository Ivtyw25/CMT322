/** Where a photo is served from, e.g. `/photos/viaduct-span.jpg`. A real API returns a URL here. */
export type PhotoSource = string;

/** A site photo and what it shows, for captions and screen readers. */
export type Photo = {
  src: PhotoSource;
  alt: string;
};
