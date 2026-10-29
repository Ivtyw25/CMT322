export type FaqCategory = {
  id: string;
  label: string;
};

export type FaqItem = {
  id: string;
  categoryId: string;
  question: string;
  /** One paragraph per item. */
  answer: string[];
};
