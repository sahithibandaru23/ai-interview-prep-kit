import fs from "fs";
import path from "path";
import { buildKit } from "../src/services/kitPipeline";

type TestCase = {
  id?: string;
  jd: string;
  company_url: string;
  days: number;
  company?: string;
  location?: string;
};

type Result = {
  id: string;
  success: boolean;
  kit?: unknown;
  error?: string;
};

function getArg(name: string): string {
  const index = process.argv.indexOf(name);

  if (index === -1 || !process.argv[index + 1]) {
    throw new Error(`Missing argument: ${name}`);
  }

  return process.argv[index + 1];
}

async function main() {
  const inputPath = getArg("--input");
  const outputPath = getArg("--output");

  const absoluteInput = path.resolve(inputPath);
  const absoluteOutput = path.resolve(outputPath);

  const cases = JSON.parse(
    fs.readFileSync(absoluteInput, "utf-8")
  ) as TestCase[];

  if (!Array.isArray(cases)) {
    throw new Error("Input must be an array of test cases");
  }

  const results: Result[] = [];

  for (let i = 0; i < cases.length; i++) {
    const testCase = cases[i];

    const id = testCase.id || `case-${i + 1}`;

    console.log(`\nRunning ${id}...`);

    try {
      const kit = await buildKit({
        jd: testCase.jd,
        company_url: testCase.company_url,
        days: testCase.days,
        company: testCase.company,
        location: testCase.location,
      });

      results.push({
        id,
        success: true,
        kit,
      });

      console.log(`✓ ${id} completed`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      results.push({
        id,
        success: false,
        error: message,
      });

      console.error(`✗ ${id} failed: ${message}`);
    }
  }

  fs.writeFileSync(
    absoluteOutput,
    JSON.stringify(results, null, 2),
    "utf-8"
  );

  console.log(
    `\nFinished ${results.length} case(s).`
  );

  console.log(
    `Output written to: ${absoluteOutput}`
  );
}

main().catch((error) => {
  console.error("Evaluator failed:", error);
  process.exit(1);
});