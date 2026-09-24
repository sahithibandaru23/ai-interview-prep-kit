export interface ValidationRequirement {
  id: string;
  text: string;
  kind: "technical" | "behavioural" | "domain";
  priority: "must" | "nice";
}

export interface ValidationQuestion {
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

export interface ValidationFlashcard {
  id: string;
  front: string;
  back: string;
  requirement_ids: string[];
}

export interface ValidationScheduleDay {
  day: number;
  focus: string;
  question_ids: string[];
  minutes: number;
}

export interface ValidationKit {
  source: {
    company: string;
    company_url: string;
    role: string;
    location: string;
    jd_chars: number;
    researched_at: string;
    pages_used: string[];
  };

  company_brief: {
    summary: string;
    what_they_do: string;
    sources: string[];
  };

  role: {
    title: string;
    seniority: string;
    responsibilities: string[];
    requirements: ValidationRequirement[];
  };

  questions: ValidationQuestion[];

  flashcards: ValidationFlashcard[];

  schedule: {
    days_available: number;
    days: ValidationScheduleDay[];
  };

  coverage: {
    uncovered_requirement_ids: string[];
    passes: number;
  };
}

export const validateKit = (kit: ValidationKit): void => {
  if (!kit.source.company_url) {
    throw new Error("Kit source company_url is required");
  }

  if (!kit.role.title) {
    throw new Error("Kit role title is required");
  }

  if (!Array.isArray(kit.role.requirements)) {
    throw new Error("Kit requirements must be an array");
  }

  if (!Array.isArray(kit.questions)) {
    throw new Error("Kit questions must be an array");
  }

  if (!Array.isArray(kit.flashcards)) {
    throw new Error("Kit flashcards must be an array");
  }

  if (!Number.isInteger(kit.schedule.days_available)) {
    throw new Error("Schedule days_available must be an integer");
  }

  if (
    kit.schedule.days_available < 1 ||
    kit.schedule.days_available > 60
  ) {
    throw new Error("Schedule days_available must be between 1 and 60");
  }

  const requirementIds = new Set(
    kit.role.requirements.map((requirement) => requirement.id)
  );

  const questionIds = new Set(
    kit.questions.map((question) => question.id)
  );

  for (const question of kit.questions) {
    if (!question.id || !question.prompt) {
      throw new Error("Every question must have an id and prompt");
    }

    if (
      question.requirement_ids.length === 0 ||
      question.requirement_ids.some(
        (id) => !requirementIds.has(id)
      )
    ) {
      throw new Error(
        `Question ${question.id} references an invalid requirement`
      );
    }

    if (
      !Number.isInteger(question.difficulty) ||
      question.difficulty < 1 ||
      question.difficulty > 5
    ) {
      throw new Error(
        `Question ${question.id} has an invalid difficulty`
      );
    }
  }

  for (const flashcard of kit.flashcards) {
    if (!flashcard.id || !flashcard.front || !flashcard.back) {
      throw new Error("Every flashcard must have an id, front and back");
    }

    if (
      flashcard.requirement_ids.some(
        (id) => !requirementIds.has(id)
      )
    ) {
      throw new Error(
        `Flashcard ${flashcard.id} references an invalid requirement`
      );
    }
  }

  if (kit.schedule.days.length !== kit.schedule.days_available) {
    throw new Error(
      "Schedule must contain exactly one entry for each available day"
    );
  }

  for (const day of kit.schedule.days) {
    if (!Number.isInteger(day.day) || day.day < 1) {
      throw new Error("Schedule day number is invalid");
    }

    if (!Number.isInteger(day.minutes) || day.minutes < 0) {
      throw new Error(`Invalid minutes for day ${day.day}`);
    }

    for (const questionId of day.question_ids) {
      if (!questionIds.has(questionId)) {
        throw new Error(
          `Schedule references unknown question ${questionId}`
        );
      }
    }
  }

  for (const requirementId of kit.coverage.uncovered_requirement_ids) {
    if (!requirementIds.has(requirementId)) {
      throw new Error(
        `Coverage references unknown requirement ${requirementId}`
      );
    }
  }
};