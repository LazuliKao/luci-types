import { promises as fs } from "node:fs";
import ts from "typescript";
import { collectSourceFiles, DEFAULT_EXTENSIONS } from "./files.ts";
import type { ExtractTranslationsOptions, WriteTranslationsOptions } from "./types.ts";

export async function extractTranslations(options: ExtractTranslationsOptions): Promise<string[]> {
  const inputs = Array.isArray(options.input) ? options.input : [options.input];
  const files = await collectSourceFiles(inputs, options.extensions ?? DEFAULT_EXTENSIONS, options.exclude);
  const translations = new Set<string>();

  await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      extractFromSource(source, filePath, translations);
    }),
  );

  return [...translations]
    .filter((translation) => translation.trim() !== "" && translation !== "-" && translation !== "+")
    .sort((left, right) => left.localeCompare(right));
}

export function extractFromSource(source: string, fileName = "source.ts", translations = new Set<string>()): Set<string> {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, scriptKindForFile(fileName));

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "_") {
      const firstArgument = node.arguments[0];

      if (firstArgument !== undefined && ts.isStringLiteralLike(firstArgument)) {
        translations.add(firstArgument.text);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return translations;
}

export async function writeTranslationsJson(options: WriteTranslationsOptions): Promise<string[]> {
  const translations = await extractTranslations(options);
  await fs.mkdir(dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, `${JSON.stringify(translations, null, 2)}\n`, "utf8");
  return translations;
}

function scriptKindForFile(fileName: string): ts.ScriptKind {
  if (fileName.endsWith(".tsx")) {
    return ts.ScriptKind.TSX;
  }

  if (fileName.endsWith(".jsx")) {
    return ts.ScriptKind.JSX;
  }

  if (fileName.endsWith(".js")) {
    return ts.ScriptKind.JS;
  }

  return ts.ScriptKind.TS;
}

function dirname(filePath: string): string {
  const lastSeparator = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
  return lastSeparator === -1 ? "." : filePath.slice(0, lastSeparator);
}
