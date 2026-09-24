import { validatePublicUrl } from "./urlSafety";

const test = async (url: string) => {
  try {
    const result = await validatePublicUrl(url);
    console.log("ALLOWED:", result.toString());
  } catch (error) {
    console.log(
      "REJECTED:",
      url,
      "->",
      error instanceof Error ? error.message : error
    );
  }
};

const main = async () => {
  await test("https://example.com");
  await test("http://localhost:5000");
  await test("http://127.0.0.1:5000");
  await test("not-a-url");
};

main();