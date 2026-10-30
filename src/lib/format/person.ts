/**
 * Display parts of a person's name. Malaysian names often lead with the family name
 * ("Tan Mei Ling"), so with three or more words the first word is left out of the short forms.
 * A `givenName` field on the user record would replace this.
 */
export function givenName(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  return (words.length >= 3 ? words.slice(1) : words).join(' ');
}

/** Up to two capital letters, e.g. "ML" for "Tan Mei Ling". */
export function initialsOf(fullName: string): string {
  return givenName(fullName)
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
