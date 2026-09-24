import { repairCoverage } from "./coverageRepair";

const requirements = [
  {
    id: "REQ-001",
    text: "Experience with React",
    kind: "technical" as const,
    priority: "must" as const,
  },
  {
    id: "REQ-002",
    text: "Experience with TypeScript",
    kind: "technical" as const,
    priority: "must" as const,
  },
  {
    id: "REQ-003",
    text: "Communication and collaboration skills",
    kind: "behavioural" as const,
    priority: "nice" as const,
  },
];

const main = async () => {
  try {
    const questions = await repairCoverage(
      requirements,
      ["REQ-003"]
    );

    console.log(JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error(
      "COVERAGE REPAIR FAILED:",
      error instanceof Error ? error.message : error
    );
  }
};

main();