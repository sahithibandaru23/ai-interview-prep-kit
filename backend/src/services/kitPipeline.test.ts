import { buildKit } from "./kitPipeline";

const jd = `
Frontend Developer

We are looking for a Frontend Developer with React.js,
JavaScript, TypeScript and REST API experience.

The candidate should be comfortable working with Git
and Agile teams.

Responsibilities include developing web applications,
collaborating with the team and testing applications.
`;

const main = async () => {
  try {
    console.log("Starting full kit pipeline...\n");

    const kit = await buildKit({
      jd,
      company_url: "https://example.com",
      days: 5,
      company: "Example Company",
      location: "Remote",
    });

    console.log("\n===== PIPELINE SUCCESS =====");

    console.log("Role:", kit.role.title);
    console.log("Seniority:", kit.role.seniority);

    console.log(
      "Requirements:",
      kit.role.requirements.length
    );

    console.log(
      "Questions:",
      kit.questions.length
    );

    console.log(
      "Flashcards:",
      kit.flashcards.length
    );

    console.log(
      "Schedule days:",
      kit.schedule.days.length
    );

    console.log(
      "Uncovered requirements:",
      kit.coverage.uncovered_requirement_ids
    );

    console.log(
      "Coverage passes:",
      kit.coverage.passes
    );

    console.log("\nFULL KIT:");
    console.log(JSON.stringify(kit, null, 2));
  } catch (error) {
    console.error(
      "\nPIPELINE FAILED:",
      error instanceof Error ? error.message : error
    );
  }
};

main();