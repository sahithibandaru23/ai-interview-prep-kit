import { buildCompanyBrief } from "./companyBrief";

const pages = [
  {
    url: "https://example.com/",
    title: "Example Domain",
    text: "Example Company builds software products for businesses. The company provides digital tools for teams. Its platform helps organizations manage their workflows.",
    links: [],
  },
];

const result = buildCompanyBrief(pages);

console.log(JSON.stringify(result, null, 2));