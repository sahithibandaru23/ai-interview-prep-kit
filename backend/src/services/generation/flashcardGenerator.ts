import { generateText } from "./gemini";

export interface FlashcardRequirement {
  id: string;
  text: string;
  kind: "technical" | "behavioural" | "domain";
}

export interface GeneratedFlashcard {
  id: string;
  front: string;
  back: string;
  requirement_ids: string[];
}

const extractJson = (text: string): string => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return a JSON array");
  }

  return cleaned.slice(start, end + 1);
};

export const generateFlashcards = async (
  requirements: FlashcardRequirement[]
): Promise<GeneratedFlashcard[]> => {
  if (requirements.length === 0) {
    return [];
  }

  const requirementText = requirements
    .map(
      (requirement) =>
        `${requirement.id}: ${requirement.text} (${requirement.kind})`
    )
    .join("\n");

  const prompt = `
Create one concise interview-preparation flashcard for each requirement.

Requirements:
${requirementText}

Rules:
1. Create exactly one flashcard per requirement.
2. Preserve the requirement ID exactly.
3. The front should be a short question or concept.
4. The back should be a concise answer.
5. Keep answers practical and interview-focused.
6. Return ONLY valid JSON.
7. Do not use Markdown.
8. Do not add explanations outside the JSON.

JSON format:
[
  {
    "id": "FC-001",
    "front": "Question or concept",
    "back": "Concise answer",
    "requirement_ids": ["REQ-001"]
  }
]
`;

  const response = await generateText(prompt);

  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(response));
  } catch {
    throw new Error("Gemini returned invalid flashcard JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Flashcard response must be an array");
  }

  return parsed.map((flashcard, index) => {
    if (!flashcard || typeof flashcard !== "object") {
      throw new Error(`Invalid flashcard at index ${index}`);
    }

    const item = flashcard as Record<string, unknown>;

    if (
      typeof item.front !== "string" ||
      typeof item.back !== "string" ||
      !Array.isArray(item.requirement_ids)
    ) {
      throw new Error(`Invalid flashcard structure at index ${index}`);
    }

    return {
      id:
        typeof item.id === "string"
          ? item.id
          : `FC-${String(index + 1).padStart(3, "0")}`,
      front: item.front,
      back: item.back,
      requirement_ids: item.requirement_ids.filter(
        (id): id is string => typeof id === "string"
      ),
    };
  });
};