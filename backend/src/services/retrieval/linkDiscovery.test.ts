import { rankHiringLinks } from "./linkDiscovery";

const baseUrl = "https://example.com";

const links = [
  "https://example.com/about",
  "https://example.com/careers",
  "https://example.com/jobs/software-engineer",
  "https://example.com/products",
  "https://example.com/contact",
  "https://external.com/careers",
];

const result = rankHiringLinks(baseUrl, links);

console.log(JSON.stringify(result, null, 2));