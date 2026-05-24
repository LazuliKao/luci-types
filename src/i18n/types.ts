export interface ExtractTranslationsOptions {
  input: string | string[];
  extensions?: readonly string[];
  exclude?: readonly string[];
}

export interface WriteTranslationsOptions extends ExtractTranslationsOptions {
  output: string;
}

export interface PoHeaderOptions {
  projectIdVersion?: string;
  potCreationDate?: Date;
  poRevisionDate?: string;
  lastTranslator?: string;
  languageTeam?: string;
  language?: string;
  mimeVersion?: string;
  contentType?: string;
  contentTransferEncoding?: string;
  pluralForms?: string;
}

export interface GeneratePoOptions {
  translations: readonly string[];
  output: string;
  locale?: string;
  packageName?: string;
  merge?: boolean;
  headers?: PoHeaderOptions;
  translated?: ReadonlyMap<string, string>;
}

export interface Translator {
  translate(texts: readonly string[]): Promise<Map<string, string>>;
}

export interface TranslateTranslationsOptions {
  translations: readonly string[];
  translator: Translator;
  cachePath?: string;
  batchSize?: number;
  existing?: ReadonlyMap<string, string>;
  onProgress?: (progress: TranslateProgress) => void;
}

export interface TranslateProgress {
  batch: number;
  batches: number;
  size: number;
}

export interface TranslateTranslationsResult {
  translated: Map<string, string>;
  newCount: number;
  cachePath?: string;
}

export interface ExportTranslationsOptions extends ExtractTranslationsOptions {
  output?: string;
  po?: string;
  locale?: string;
  packageName?: string;
  merge?: boolean;
  json?: boolean;
  headers?: PoHeaderOptions;
  translator?: Translator;
  cachePath?: string;
  batchSize?: number;
  onTranslateProgress?: (progress: TranslateProgress) => void;
}

export interface ExportTranslationsResult {
  translations: string[];
  jsonPath?: string;
  poPath?: string;
  translated?: Map<string, string>;
  translatedCount?: number;
  cachePath?: string;
}
