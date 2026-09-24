import axios from "axios";

export const canFetchUrl = async (url: string): Promise<boolean> => {
  const target = new URL(url);

  const robotsUrl = `${target.protocol}//${target.host}/robots.txt`;

  try {
    const response = await axios.get<string>(robotsUrl, {
      timeout: 5000,
      headers: {
        "User-Agent": "AI-Interview-Prep-Kit/1.0",
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });

    // If robots.txt does not exist, allow the request.
    if (response.status === 404) {
      return true;
    }

    const robots = response.data;

    const lines = robots
      .split(/\r?\n/)
      .map((line) => line.trim());

    let appliesToOurBot = false;
    let blocked = false;

    for (const line of lines) {
      if (!line || line.startsWith("#")) {
        continue;
      }

      const [rawKey, rawValue] = line.split(":");

      if (!rawKey || rawValue === undefined) {
        continue;
      }

      const key = rawKey.trim().toLowerCase();
      const value = rawValue.trim();

      if (key === "user-agent") {
        appliesToOurBot =
          value === "*" ||
          value.toLowerCase() === "ai-interview-prep-kit";
        continue;
      }

      if (key === "disallow" && appliesToOurBot) {
        if (value === "") {
          continue;
        }

        const path = target.pathname;

        if (path.startsWith(value)) {
          blocked = true;
        }
      }
    }

    return !blocked;
  } catch {
    // If robots.txt cannot be reached, skip the source rather than failing
    // the entire research pipeline.
    return false;
  }
};