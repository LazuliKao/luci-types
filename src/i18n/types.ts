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
}

export interface ExportTranslationsOptions extends ExtractTranslationsOptions {
  output?: string;
  po?: string;
  locale?: string;
  packageName?: string;
  merge?: boolean;
  json?: boolean;
  headers?: PoHeaderOptions;
}

export interface ExportTranslationsResult {
  translations: string[];
  jsonPath?: string;
  poPath?: string;
}
