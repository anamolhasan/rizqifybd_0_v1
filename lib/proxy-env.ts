import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

let secret: string | undefined;

const ENV_FILES = [".env.local", ".env.development", ".env"];

function readValueFromEnvFiles(targetKey: string): string | undefined {
  const cwd = process.cwd();

  for (const file of ENV_FILES) {
    const absolutePath = path.join(cwd, file);
    if (!existsSync(absolutePath)) continue;

    const content = readFileSync(absolutePath, "utf8");

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const separatorIndex = line.indexOf("=");
      if (separatorIndex <= 0) continue;

      const key = line.slice(0, separatorIndex).trim();
      if (key !== targetKey) continue;

      return line
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^"([\s\S]*)"$/, "$1");
    }
  }

  return undefined;
}

export function getAccessTokenSecret(): string {
  if (secret !== undefined) return secret;

  secret =
    process.env.ACCESS_TOKEN_SECRET ??
    readValueFromEnvFiles("ACCESS_TOKEN_SECRET") ??
    "";

  return secret;
}