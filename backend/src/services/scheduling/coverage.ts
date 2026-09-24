export interface CoverageRequirement {
  id: string;
  priority: "must" | "nice";
}

export interface CoverageQuestion {
  requirement_ids: string[];
}

export interface CoverageResult {
  uncovered_requirement_ids: string[];
  covered_requirement_ids: string[];
  passes: number;
}

export const checkCoverage = (
  requirements: CoverageRequirement[],
  questions: CoverageQuestion[]
): CoverageResult => {
  const coveredIds = new Set<string>();

  for (const question of questions) {
    for (const requirementId of question.requirement_ids) {
      coveredIds.add(requirementId);
    }
  }

  const uncoveredRequirementIds = requirements
    .filter((requirement) => !coveredIds.has(requirement.id))
    .map((requirement) => requirement.id);

  const coveredRequirementIds = requirements
    .filter((requirement) => coveredIds.has(requirement.id))
    .map((requirement) => requirement.id);

  return {
    uncovered_requirement_ids: uncoveredRequirementIds,
    covered_requirement_ids: coveredRequirementIds,
    passes: uncoveredRequirementIds.length === 0 ? 1 : 0,
  };
};