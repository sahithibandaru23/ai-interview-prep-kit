import axios from "axios";
import * as cheerio from "cheerio";

export interface FetchedPage {
  url: string;
  title: string;
  text: string;
  links: string[];
}

export const fetchPage = async (url: string): Promise<FetchedPage> => {
  const response = await axios.get<string>(url, {
    timeout: 10000,
    maxContentLength: 2_000_000,
    maxBodyLength: 2_000_000,
    headers: {
      "User-Agent": "AI-Interview-Prep-Kit/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const contentType = response.headers["content-type"] || "";

  if (!contentType.includes("text/html")) {
    throw new Error("URL did not return an HTML page");
  }

  const $ = cheerio.load(response.data);

  $("script, style, noscript, svg").remove();

  const title = $("title").first().text().trim();

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const links: string[] = [];

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    try {
      const absoluteUrl = new URL(href, url).toString();

      if (
        absoluteUrl.startsWith("http://") ||
        absoluteUrl.startsWith("https://")
      ) {
        links.push(absoluteUrl);
      }
    } catch {
      // Ignore invalid URLs.
    }
  });

  return {
    url,
    title,
    text,
    links: [...new Set(links)],
  };
};