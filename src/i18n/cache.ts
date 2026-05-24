import { promises as fs } from "node:fs";
import path from "node:path";

export async function loadTranslationCache(filePath: string): Promise<Map<string, string>> {
  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(source);

    if (!isStringRecord(parsed)) {
      throw new Error(`Invalid translation cache format: ${filePath}`);
    }

    return new Map(Object.entries(parsed));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return new Map();
    }

    throw error;
  }
}

export async function saveTranslationCache(filePath: string, cache: ReadonlyMap<string, string>): Promise<void> {
  await fs.mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(Object.fromEntries(cache), null, 2)}\n`, "utf8");
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === "string");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
