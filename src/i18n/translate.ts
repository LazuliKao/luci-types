import { loadTranslationCache, saveTranslationCache } from "./cache.ts";
import type { TranslateTranslationsOptions, TranslateTranslationsResult } from "./types.ts";

const defaultBatchSize = 25;

export async function translateTranslations(options: TranslateTranslationsOptions): Promise<TranslateTranslationsResult> {
  const batchSize = options.batchSize ?? defaultBatchSize;

  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error(`batchSize must be a positive integer, got ${batchSize}`);
  }

  const cache = options.cachePath === undefined
    ? new Map<string, string>()
    : await loadTranslationCache(options.cachePath);
  const translated = new Map([...cache].filter(([, value]) => value.trim() !== ""));

  for (const [msgid, msgstr] of options.existing ?? []) {
    if (msgstr !== "" && !translated.has(msgid)) {
      translated.set(msgid, msgstr);
    }
  }

  const pending = [...new Set(options.translations)]
    .filter((text) => text.trim() !== "")
    .filter((text) => !hasTranslation(translated, text));
  const batches = Math.ceil(pending.length / batchSize);
  let newCount = 0;

  for (let index = 0; index < pending.length; index += batchSize) {
    const batch = pending.slice(index, index + batchSize);
    const batchNumber = Math.floor(index / batchSize) + 1;

    options.onProgress?.({ batch: batchNumber, batches, size: batch.length });

    const batchTranslations = await options.translator.translate(batch);

    for (const source of batch) {
      const target = batchTranslations.get(source);

      if (target === undefined) {
        throw new Error(`Translator did not return a translation for: ${source}`);
      }

      if (target.trim() === "") {
        throw new Error(`Translator returned an empty translation for: ${source}`);
      }

      cache.set(source, target);
      translated.set(source, target);
      newCount += 1;
    }
  }

  if (options.cachePath !== undefined && newCount > 0) {
    await saveTranslationCache(options.cachePath, cache);
  }

  return {
    translated,
    newCount,
    cachePath: options.cachePath,
  };
}

function hasTranslation(translations: ReadonlyMap<string, string>, source: string): boolean {
  const target = translations.get(source);

  return target !== undefined && target.trim() !== "";
}
