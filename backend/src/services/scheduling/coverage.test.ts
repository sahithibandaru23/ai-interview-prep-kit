import { checkCoverage } from "./coverage";

const requirements = [
  {
    id: "REQ-001",
    priority: "must" as const,
  },
  {
    id: "REQ-002",
    priority: "must" as const,
  },
  {
    id: "REQ-003",
    priority: "nice" as const,
  },
];

const questions = [
  {
    requirement_ids: ["REQ-001"],
  },
  {
    requirement_ids: ["REQ-002"],
  },
];

const result = checkCoverage(requirements, questions);

console.log(JSON.stringify(result, null, 2));