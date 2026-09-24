export interface RankedLink {
  url: string;
  score: number;
  reason: string;
}

const hiringKeywords = [
  "career",
  "careers",
  "jobs",
  "job",
  "hiring",
  "join-us",
  "join us",
  "work-with-us",
  "work with us",
  "openings",
  "vacancies",
  "opportunities",
  "talent",
];

export const rankHiringLinks = (
  baseUrl: string,
  links: string[]
): RankedLink[] => {
  const base = new URL(baseUrl);

  const uniqueLinks = [...new Set(links)];

  const ranked: RankedLink[] = [];

  for (const link of uniqueLinks) {
    try {
      const url = new URL(link);

      // Only consider HTTP/HTTPS links.
      if (!["http:", "https:"].includes(url.protocol)) {
        continue;
      }

      const sameDomain = url.hostname === base.hostname;

      const searchableText = `${url.pathname} ${url.search}`.toLowerCase();

      const matchedKeywords = hiringKeywords.filter((keyword) =>
        searchableText.includes(keyword)
      );

      let score = 0;

      if (sameDomain) {
        score += 5;
      }

      score += matchedKeywords.length * 10;

      if (url.pathname.toLowerCase().includes("career")) {
        score += 10;
      }

      if (url.pathname.toLowerCase().includes("job")) {
        score += 8;
      }

      if (score > 0) {
        ranked.push({
          url: url.toString(),
          score,
          reason:
            matchedKeywords.length > 0
              ? `Matched hiring keywords: ${matchedKeywords.join(", ")}`
              : "Same company domain",
        });
      }
    } catch {
      // Ignore invalid URLs.
    }
  }

  return ranked.sort((a, b) => b.score - a.score);
};