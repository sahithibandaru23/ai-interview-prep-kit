export interface ScheduleQuestion {
  id: string;
  category:
    | "technical"
    | "behavioural"
    | "system-design"
    | "company-fit";
}

export interface ScheduleDay {
  day: number;
  focus: string;
  question_ids: string[];
  minutes: number;
}

export interface StudySchedule {
  days_available: number;
  days: ScheduleDay[];
}

const getFocus = (categories: string[]): string => {
  const unique = [...new Set(categories)];

  if (unique.length === 1) {
    return `${unique[0]} interview preparation`;
  }

  if (unique.includes("technical") && unique.includes("behavioural")) {
    return "Technical and behavioural interview preparation";
  }

  return "Interview preparation";
};

export const generateSchedule = (
  questions: ScheduleQuestion[],
  daysAvailable: number
): StudySchedule => {
  if (!Number.isInteger(daysAvailable) || daysAvailable < 1 || daysAvailable > 60) {
    throw new Error("Days available must be an integer between 1 and 60");
  }

  if (questions.length === 0) {
    return {
      days_available: daysAvailable,
      days: Array.from({ length: daysAvailable }, (_, index) => ({
        day: index + 1,
        focus: "Review and preparation",
        question_ids: [],
        minutes: 30,
      })),
    };
  }

  const days: ScheduleDay[] = Array.from(
    { length: daysAvailable },
    (_, index) => ({
      day: index + 1,
      focus: "Interview preparation",
      question_ids: [],
      minutes: 30,
    })
  );

  questions.forEach((question, index) => {
    const dayIndex = index % daysAvailable;

    days[dayIndex].question_ids.push(question.id);
  });

  for (const day of days) {
    const dayQuestions = questions.filter((question) =>
      day.question_ids.includes(question.id)
    );

    const categories = dayQuestions.map((question) => question.category);

    day.focus = getFocus(categories);

    // 15 minutes per question, minimum 30 minutes per study day.
    day.minutes = Math.max(30, day.question_ids.length * 15);
  }

  return {
    days_available: daysAvailable,
    days,
  };
};