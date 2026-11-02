/**
 * Set when the search form sends the visitor to a result. The result page reads it once on mount:
 * it moves focus and announces only after a search, not on a direct visit or a reload.
 */
let searchSubmitted = false;

export function markSearchSubmitted(): void {
  searchSubmitted = true;
}

export function takeSearchSubmitted(): boolean {
  const was = searchSubmitted;
  searchSubmitted = false;
  return was;
}
