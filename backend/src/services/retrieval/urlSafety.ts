import dns from "node:dns/promises";

const PRIVATE_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

const isPrivateIPv4 = (ip: string): boolean => {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false;
  }

  const [a, b] = parts;

  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 127
  );
};

export const validatePublicUrl = async (value: string): Promise<URL> => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const hostname = url.hostname.toLowerCase();

  if (PRIVATE_HOSTNAMES.has(hostname)) {
    throw new Error("Private or loopback URLs are not allowed");
  }

  if (isPrivateIPv4(hostname)) {
    throw new Error("Private IP addresses are not allowed");
  }

  try {
    const addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });

    for (const address of addresses) {
      if (isPrivateIPv4(address.address)) {
        throw new Error("URL resolves to a private IP address");
      }

      if (address.address === "::1") {
        throw new Error("URL resolves to a loopback address");
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("private")) {
      throw error;
    }

    throw new Error("Unable to validate URL host");
  }

  return url;
};