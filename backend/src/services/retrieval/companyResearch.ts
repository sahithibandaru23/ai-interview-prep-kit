import { fetchPage, FetchedPage } from "./pageFetcher";
import { rankHiringLinks, RankedLink } from "./linkDiscovery";
import { validatePublicUrl } from "./urlSafety";
import { canFetchUrl } from "./robots";

export interface ResearchResult {
  companyUrl: string;
  pages: FetchedPage[];
  hiringPages: RankedLink[];
  skippedUrls: string[];
}

const MAX_PAGES = 5;

export const researchCompany = async (
  companyUrl: string
): Promise<ResearchResult> => {
  const validatedUrl = await validatePublicUrl(companyUrl);

  const startUrl = validatedUrl.toString();

  const skippedUrls: string[] = [];
  const pages: FetchedPage[] = [];

  // Check robots.txt before fetching the starting page.
  const startAllowed = await canFetchUrl(startUrl);

  if (!startAllowed) {
    throw new Error("Company website is not allowed by robots.txt");
  }

  let homePage: FetchedPage;

  try {
    homePage = await fetchPage(startUrl);
    pages.push(homePage);
  } catch {
    throw new Error("Unable to fetch company website");
  }

  // Discover and rank hiring-related links.
  const hiringPages = rankHiringLinks(startUrl, homePage.links);

  // Fetch the highest-ranked pages first.
  for (const rankedLink of hiringPages) {
    if (pages.length >= MAX_PAGES) {
      break;
    }

    if (pages.some((page) => page.url === rankedLink.url)) {
      continue;
    }

    try {
      const allowed = await canFetchUrl(rankedLink.url);

      if (!allowed) {
        skippedUrls.push(rankedLink.url);
        continue;
      }

      const page = await fetchPage(rankedLink.url);

      pages.push(page);
    } catch {
      // One failed source should not fail the entire research pipeline.
      skippedUrls.push(rankedLink.url);
    }
  }

  return {
    companyUrl: startUrl,
    pages,
    hiringPages,
    skippedUrls,
  };
};