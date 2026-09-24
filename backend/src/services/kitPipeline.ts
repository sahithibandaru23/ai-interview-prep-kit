import { extractJD } from "./extraction/jdExtractor";
import { researchCompany } from "./retrieval/companyResearch";
import { buildCompanyBrief } from "./retrieval/companyBrief";
import { generateQuestions } from "./generation/questionGenerator";
import { repairCoverage } from "./generation/coverageRepair";
import { generateFlashcards } from "./generation/flashcardGenerator";
import { checkCoverage } from "./scheduling/coverage";
import { generateSchedule } from "./scheduling/schedule";
import { validateKit } from "../utils/kitValidation";

export interface BuildKitInput {
  jd: string;
  company_url: string;
  days: number;
  company?: string;
  location?: string;
}

export const buildKit = async (input: BuildKitInput) => {
  if (!input.jd || !input.jd.trim()) {
    throw new Error("Job description cannot be empty");
  }

  if (!input.company_url || !input.company_url.trim()) {
    throw new Error("Company URL is required");
  }

  if (!Number.isInteger(input.days) || input.days < 1 || input.days > 60) {
    throw new Error("Days must be an integer between 1 and 60");
  }

  // 1. Extract requirements from the job description.
  const extractedJD = extractJD(input.jd);

  // 2. Research the company website.
  const research = await researchCompany(input.company_url);

  // 3. Build a deterministic company brief from retrieved pages.
  const companyBrief = buildCompanyBrief(research.pages);

  // 4. Generate questions from extracted requirements.
  let questions = await generateQuestions(extractedJD.requirements);

  // 5. Check coverage deterministically.
  let coverage = checkCoverage(
    extractedJD.requirements,
    questions
  );

  // 6. Generate questions only for uncovered requirements.
  if (coverage.uncovered_requirement_ids.length > 0) {
    const repairedQuestions = await repairCoverage(
      extractedJD.requirements,
      coverage.uncovered_requirement_ids
    );

    questions = [...questions, ...repairedQuestions];

    // Give repaired questions unique IDs.
    questions = questions.map((question, index) => ({
      ...question,
      id: `Q-${String(index + 1).padStart(3, "0")}`,
    }));

    // 7. Recheck coverage.
    coverage = checkCoverage(
      extractedJD.requirements,
      questions
    );
  }

  // 8. Generate flashcards from requirements.
  const flashcards = await generateFlashcards(
    extractedJD.requirements
  );

  // Give flashcards stable IDs.
  const normalizedFlashcards = flashcards.map(
    (flashcard, index) => ({
      ...flashcard,
      id: `FC-${String(index + 1).padStart(3, "0")}`,
    })
  );

  // 9. Generate deterministic study schedule.
  const schedule = generateSchedule(
    questions,
    input.days
  );

  // 10. Build the final kit.
  const kit = {
    source: {
      company: input.company || "",
      company_url: research.companyUrl,
      role: extractedJD.title,
      location: input.location || "",
      jd_chars: input.jd.length,
      researched_at: new Date().toISOString(),
      pages_used: research.pages.map((page) => page.url),
    },

    company_brief: companyBrief,

    role: {
      title: extractedJD.title,
      seniority: extractedJD.seniority,
      responsibilities: extractedJD.responsibilities,
      requirements: extractedJD.requirements,
    },

    questions,

    flashcards: normalizedFlashcards,

    schedule,

    coverage: {
      uncovered_requirement_ids:
        coverage.uncovered_requirement_ids,
      passes: coverage.passes,
    },
  };

  // 11. Validate before returning.
  validateKit(kit);

  return kit;
};