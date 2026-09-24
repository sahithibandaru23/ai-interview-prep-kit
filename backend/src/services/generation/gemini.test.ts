import { generateText } from "./gemini";

const main = async () => {
  try {
    const result = await generateText(
      "Reply with exactly: Gemini connection successful"
    );

    console.log("GEMINI RESPONSE:");
    console.log(result);
  } catch (error) {
    console.error(
      "GEMINI TEST FAILED:",
      error instanceof Error ? error.message : error
    );
  }
};

main();