import { canFetchUrl } from "./robots";

const main = async () => {
  try {
    const allowed = await canFetchUrl("https://example.com/");

    console.log("Can fetch:", allowed);
  } catch (error) {
    console.error("ROBOTS CHECK FAILED:", error);
  }
};

main();