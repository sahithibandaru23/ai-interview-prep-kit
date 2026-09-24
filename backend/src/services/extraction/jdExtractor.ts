export interface ExtractedRequirement {
  id: string;
  text: string;
  kind: "technical" | "behavioural" | "domain";
  priority: "must" | "nice";
}

export interface ExtractedJD {
  title: string;
  seniority: string;
  responsibilities: string[];
  requirements: ExtractedRequirement[];
}

const technicalKeywords = [
  "javascript",
  "typescript",
  "react",
  "react.js",
  "next.js",
  "node",
  "node.js",
  "express",
  "python",
  "java",
  "sql",
  "mongodb",
  "postgresql",
  "mysql",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "git",
  "rest api",
  "api",
  "html",
  "css",
  "tailwind",
];

export const extractJD = (jd: string): ExtractedJD => {
  const text = jd.trim();
  const lowerText = text.toLowerCase();

  const titleMatch = text.match(
    /(frontend developer|backend developer|full.?stack developer|software engineer|software developer|data analyst|data scientist|it analyst)/i
  );

  const title = titleMatch?.[0] || "Software Engineer";

  let seniority = "mid-level";

  if (/intern|internship/i.test(text)) {
    seniority = "intern";
  } else if (/fresher|entry.?level|graduate|0.?1 years?/i.test(text)) {
    seniority = "entry-level";
  } else if (/senior|lead|5\+ years?|6\+ years?|7\+ years?/i.test(text)) {
    seniority = "senior";
  }

  const sentences = text
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const responsibilities = sentences
    .filter((sentence) =>
      /responsibil|develop|build|design|implement|maintain|collaborat|create|test|deploy/i.test(
        sentence
      )
    )
    .slice(0, 10);

  const requirements: ExtractedRequirement[] = [];

  let requirementCounter = 1;

  for (const keyword of technicalKeywords) {
  const keywordPattern = new RegExp(
    `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "i"
  );

  if (keywordPattern.test(text)) {
    requirements.push({
      id: `REQ-${String(requirementCounter).padStart(3, "0")}`,
      text: `Experience with ${keyword}`,
      kind: "technical",
      priority: "must",
    });

    requirementCounter++;
  }
}

  if (/communication|teamwork|collaboration|collaborate/i.test(text)) {
    requirements.push({
      id: `REQ-${String(requirementCounter).padStart(3, "0")}`,
      text: "Communication and collaboration skills",
      kind: "behavioural",
      priority: "nice",
    });

    requirementCounter++;
  }

  if (/agile|scrum/i.test(text)) {
    requirements.push({
      id: `REQ-${String(requirementCounter).padStart(3, "0")}`,
      text: "Experience working in Agile/Scrum teams",
      kind: "behavioural",
      priority: "nice",
    });
  }

  return {
    title,
    seniority,
    responsibilities,
    requirements,
  };
};