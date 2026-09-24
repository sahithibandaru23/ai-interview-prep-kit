import {
  generateQuestions,
  GeneratedQuestion,
  QuestionRequirement,
} from "./questionGenerator";

export const repairCoverage = async (
  requirements: QuestionRequirement[],
  uncoveredRequirementIds: string[]
): Promise<GeneratedQuestion[]> => {
  if (uncoveredRequirementIds.length === 0) {
    return [];
  }

  const missingRequirements = requirements.filter((requirement) =>
    uncoveredRequirementIds.includes(requirement.id)
  );

  if (missingRequirements.length === 0) {
    return [];
  }

  return generateQuestions(missingRequirements);
};