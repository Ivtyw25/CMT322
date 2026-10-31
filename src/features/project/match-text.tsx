import { splitByMatches } from './faq-search';

/** Text with the parts that match the query in bold. No colour change. */
export function MatchText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  return splitByMatches(text, query).map((piece, index) =>
    piece.match ? (
      <mark key={index} className="bg-transparent font-bold text-inherit">
        {piece.text}
      </mark>
    ) : (
      piece.text
    ),
  );
}
