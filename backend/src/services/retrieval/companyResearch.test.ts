import { researchCompany } from "./companyResearch";

const main = async () => {
  try {
    const result = await researchCompany("https://example.com");

    console.log("COMPANY URL:");
    console.log(result.companyUrl);

    console.log("\nPAGES FETCHED:");
    console.log(result.pages.length);

    for (const page of result.pages) {
      console.log(`- ${page.url}`);
      console.log(`  Title: ${page.title}`);
      console.log(`  Text length: ${page.text.length}`);
    }

    console.log("\nHIRING LINKS:");
    console.log(result.hiringPages);

    console.log("\nSKIPPED URLS:");
    console.log(result.skippedUrls);
  } catch (error) {
    console.error(
      "RESEARCH FAILED:",
      error instanceof Error ? error.message : error
    );
  }
};

main();