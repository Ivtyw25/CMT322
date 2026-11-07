/** A URL-safe piece of an ID from free text: "Night lane closure!" gives "night-lane-closure". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}
