export type Normalised = { text: string; origin: number[] };

/** Lower case, no diacritics, "-" as a space, runs of spaces collapsed. `origin` maps back to the input. */
export function normalise(input: string): Normalised {
  let text = '';
  const origin: number[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const char = (input[index] ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    for (const piece of char === '-' ? ' ' : char) {
      if (piece === ' ' && (text.endsWith(' ') || text === '')) continue;
      text += piece;
      origin.push(index);
    }
  }
  return { text: text.trimEnd(), origin };
}

export function normaliseQuery(query: string): string {
  return normalise(query).text;
}
