import { promises as fs } from "node:fs";
import path from "node:path";
import { extractTranslations } from "./extract.ts";
import { generatePo, readPoTranslations } from "./po.ts";
import { translateTranslations } from "./translate.ts";
import type { ExportTranslationsOptions, ExportTranslationsResult } from "./types.ts";

export async function exportTranslations(options: ExportTranslationsOptions): Promise<ExportTranslationsResult> {
  const translations = await extractTranslations(options);
  const result: ExportTranslationsResult = { translations };

  if (options.translator !== undefined) {
    const existing = options.merge === true && options.po !== undefined
      ? await readPoTranslations(options.po)
      : undefined;
    const translateResult = await translateTranslations({
      translations,
      translator: options.translator,
      cachePath: options.cachePath,
      batchSize: options.batchSize,
      existing,
      onProgress: options.onTranslateProgress,
    });

    result.translated = translateResult.translated;
    result.translatedCount = translateResult.newCount;
    result.cachePath = translateResult.cachePath;
  }

  if (options.output !== undefined || options.json === true) {
    const outputPath = options.output ?? "translations.json";
    await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(translations, null, 2)}\n`, "utf8");
    result.jsonPath = outputPath;
  }

  if (options.po !== undefined) {
    await generatePo({
      translations,
      output: options.po,
      locale: options.locale,
      packageName: options.packageName,
      merge: options.merge,
      headers: options.headers,
      translated: result.translated,
    });
    result.poPath = options.po;
  }

  return result;
}
