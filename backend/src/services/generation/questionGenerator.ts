import { generateText } from "./gemini";

export interface QuestionRequirement {
  id: string;
  text: string;
  kind: "technical" | "behavioural" | "domain";
  priority: "must" | "nice";
}

export interface GeneratedQuestion {
  id: string;
  requirement_ids: string[];
  category:
    | "technical"
    | "behavioural"
    | "system-design"
    | "company-fit";
  prompt: string;
  answer_outline: string;
  difficulty: number;
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

export const generateQuestions = async (
  requirements: QuestionRequirement[]
): Promise<GeneratedQuestion[]> => {
  if (requirements.length === 0) {
    return [];
  }

  const requirementText = requirements
    .map(
      (requirement) =>
        `${requirement.id}: ${requirement.text} (${requirement.kind}, ${requirement.priority})`
    )
    .join("\n");

  const prompt = `
You are generating interview questions for an interview preparation kit.

Generate exactly one high-quality interview question for each requirement below.

Requirements:
${requirementText}

Rules:
1. Every question MUST reference exactly one requirement ID.
2. Preserve the requirement ID exactly.
3. Use category "technical" for technical requirements.
4. Use category "behavioural" for behavioural requirements.
5. Use category "company-fit" for domain/company-related requirements.
6. Difficulty must be an integer from 1 to 5.
7. Provide a concise answer outline.
8. Return ONLY a valid JSON array.
9. Do not use Markdown.
10. Do not add explanations outside the JSON.

JSON format:
[
  {
    "id": "Q-001",
    "requirement_ids": ["REQ-001"],
    "category": "technical",
    "prompt": "Question here",
    "answer_outline": "Key points an answer should cover",
    "difficulty": 3
  }
]
`;

  const response = await generateText(prompt);

  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(response));
  } catch {
    throw new Error("Gemini returned invalid question JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Question response must be an array");
  }

  return parsed.map((question, index) => {
    if (!question || typeof question !== "object") {
      throw new Error(`Invalid question at index ${index}`);
    }

    const item = question as Record<string, unknown>;

    if (
      typeof item.prompt !== "string" ||
      typeof item.answer_outline !== "string" ||
      !Array.isArray(item.requirement_ids)
    ) {
      throw new Error(`Invalid question structure at index ${index}`);
    }

    return {
      id:
        typeof item.id === "string"
          ? item.id
          : `Q-${String(index + 1).padStart(3, "0")}`,
      requirement_ids: item.requirement_ids.filter(
        (id): id is string => typeof id === "string"
      ),
      category:
        item.category === "behavioural" ||
        item.category === "system-design" ||
        item.category === "company-fit"
          ? item.category
          : "technical",
      prompt: item.prompt,
      answer_outline: item.answer_outline,
      difficulty:
        typeof item.difficulty === "number"
          ? Math.min(5, Math.max(1, Math.round(item.difficulty)))
          : 3,
    };
  });
};