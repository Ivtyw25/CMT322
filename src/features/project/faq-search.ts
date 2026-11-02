import type { FaqItem } from '@/data/models/faq';

/** Lower-case, accent-free text, one output character per input character. */
export function fold(text: string): string {
  return Array.from(text)
    .map((char) => char.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().charAt(0) || char)
    .join('');
}

/** The words of a query, folded. */
export function queryWords(query: string): string[] {
  return fold(query).split(/\s+/).filter(Boolean);
}

/**
 * Items where every word of the query appears in the question, summary, answer or keywords.
 * Items whose question holds the whole query come first, then the rest, each in data order.
 */
export function searchFaq(items: readonly FaqItem[], query: string): FaqItem[] {
  const words = queryWords(query);
  if (words.length === 0) return [];
  const whole = words.join(' ');
  const matches = items.filter((item) => {
    const haystack = fold(
      [item.question, item.summary, ...item.answer, ...item.keywords].join(' '),
    );
    return words.every((word) => haystack.includes(word));
  });
  const inQuestion = (item: FaqItem) => fold(item.question).includes(whole);
  return [...matches.filter(inQuestion), ...matches.filter((item) => !inQuestion(item))];
}

/** Splits `text` into pieces, marking those that match a query word. */
export function splitByMatches(text: string, query: string): { text: string; match: boolean }[] {
  const words = queryWords(query);
  const folded = fold(text);
  const marked = new Array<boolean>(text.length).fill(false);
  for (const word of words) {
    let from = folded.indexOf(word);
    while (from !== -1) {
      for (let index = from; index < from + word.length; index += 1) marked[index] = true;
      from = folded.indexOf(word, from + word.length);
    }
  }
  const pieces: { text: string; match: boolean }[] = [];
  Array.from(text).forEach((char, index) => {
    const match = marked[index] ?? false;
    const last = pieces[pieces.length - 1];
    if (last && last.match === match) last.text += char;
    else pieces.push({ text: char, match });
  });
  return pieces;
}
