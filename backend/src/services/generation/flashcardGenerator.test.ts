import { generateFlashcards } from "./flashcardGenerator";

const requirements = [
  {
    id: "REQ-001",
    text: "Experience with React",
    kind: "technical" as const,
  },
  {
    id: "REQ-002",
    text: "Experience with TypeScript",
    kind: "technical" as const,
  },
  {
    id: "REQ-003",
    text: "Communication and collaboration skills",
    kind: "behavioural" as const,
  },
];

const main = async () => {
  try {
    const flashcards = await generateFlashcards(requirements);

    console.log(JSON.stringify(flashcards, null, 2));
  } catch (error) {
    console.error(
      "FLASHCARD GENERATION FAILED:",
      error instanceof Error ? error.message : error
    );
  }
};

main();