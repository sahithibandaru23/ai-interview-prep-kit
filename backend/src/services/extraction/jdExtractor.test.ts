import { extractJD } from "./jdExtractor";

const jd = `
Frontend Developer

We are looking for a Frontend Developer with React.js,
JavaScript, TypeScript and REST API experience.

The candidate should be comfortable working with Git
and Agile teams.

Responsibilities include developing web applications,
collaborating with the team and testing applications.
`;

const result = extractJD(jd);

console.log(JSON.stringify(result, null, 2));