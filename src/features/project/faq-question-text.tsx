import { splitByMatches } from './faq-search';

/** A question with the words that match the search in bold. Plain text when there is no query. */
export function FaqQuestionText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  return splitByMatches(text, query).map((piece, index) =>
    piece.match ? (
      <strong key={index} className="font-bold">
        {piece.text}
      </strong>
    ) : (
      piece.text
    ),
  );
}
