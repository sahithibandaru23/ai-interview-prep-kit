import { validateKit } from "./kitValidation";

const kit = {
  source: {
    company: "Example Company",
    company_url: "https://example.com",
    role: "Frontend Developer",
    location: "Remote",
    jd_chars: 500,
    researched_at: new Date().toISOString(),
    pages_used: ["https://example.com"],
  },

  company_brief: {
    summary: "Example company summary.",
    what_they_do: "Example company builds software.",
    sources: ["https://example.com"],
  },

  role: {
    title: "Frontend Developer",
    seniority: "mid-level",
    responsibilities: ["Build web applications"],
    requirements: [
      {
        id: "REQ-001",
        text: "Experience with React",
        kind: "technical" as const,
        priority: "must" as const,
      },
    ],
  },

  questions: [
    {
      id: "Q-001",
      requirement_ids: ["REQ-001"],
      category: "technical" as const,
      prompt: "Explain React reconciliation.",
      answer_outline: "Discuss virtual DOM and reconciliation.",
      difficulty: 3,
    },
  ],

  flashcards: [
    {
      id: "FC-001",
      front: "What is React?",
      back: "A JavaScript library for building user interfaces.",
      requirement_ids: ["REQ-001"],
    },
  ],

  schedule: {
    days_available: 2,
    days: [
      {
        day: 1,
        focus: "Technical preparation",
        question_ids: ["Q-001"],
        minutes: 30,
      },
      {
        day: 2,
        focus: "Review",
        question_ids: [],
        minutes: 30,
      },
    ],
  },

  coverage: {
    uncovered_requirement_ids: [],
    passes: 1,
  },
};

try {
  validateKit(kit);

  console.log("KIT VALIDATION PASSED");
} catch (error) {
  console.error(
    "KIT VALIDATION FAILED:",
    error instanceof Error ? error.message : error
  );
}