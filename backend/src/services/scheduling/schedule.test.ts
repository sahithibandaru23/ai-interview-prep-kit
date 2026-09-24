import { generateSchedule } from "./schedule";

const questions = [
  {
    id: "Q-001",
    category: "technical" as const,
  },
  {
    id: "Q-002",
    category: "technical" as const,
  },
  {
    id: "Q-003",
    category: "behavioural" as const,
  },
  {
    id: "Q-004",
    category: "company-fit" as const,
  },
  {
    id: "Q-005",
    category: "technical" as const,
  },
];

const result = generateSchedule(questions, 3);

console.log(JSON.stringify(result, null, 2));