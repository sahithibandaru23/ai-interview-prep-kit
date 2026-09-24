import { FetchedPage } from "./pageFetcher";

export interface CompanyBrief {
  summary: string;
  what_they_do: string;
  sources: string[];
}

const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
};

const firstSentences = (text: string, count: number): string => {
  const sentences = cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  return sentences.slice(0, count).join(" ");
};

export const buildCompanyBrief = (
  pages: FetchedPage[]
): CompanyBrief => {
  if (pages.length === 0) {
    return {
      summary: "No company research information was available.",
      what_they_do: "Unable to determine company activities.",
      sources: [],
    };
  }

  const primaryPage = pages[0];

  const text = cleanText(primaryPage.text);

  const summary =
    firstSentences(text, 3) ||
    "Company information was retrieved but no summary could be extracted.";

  const whatTheyDo =
    firstSentences(text, 5) ||
    "The available company pages did not provide enough information to determine what the company does.";

  const sources = pages.map((page) => page.url);

  return {
    summary,
    what_they_do: whatTheyDo,
    sources,
  };
};