import { fetchPage } from "./pageFetcher";

const main = async () => {
  try {
    const page = await fetchPage("https://example.com");

    console.log("URL:", page.url);
    console.log("TITLE:", page.title);
    console.log("TEXT LENGTH:", page.text.length);
    console.log("LINK COUNT:", page.links.length);
    console.log("TEXT:", page.text);
  } catch (error) {
    console.error("FETCH FAILED:", error);
  }
};

main();