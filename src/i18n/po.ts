import { promises as fs } from "node:fs";
import path from "node:path";
import type { GeneratePoOptions, PoHeaderOptions } from "./types.ts";

interface PoEntry {
  msgid: string;
  msgstr: string;
}

type RenderedPoHeaders = Omit<Required<PoHeaderOptions>, "potCreationDate"> & {
  potCreationDate: string;
};

export async function generatePo(options: GeneratePoOptions): Promise<void> {
  const existing = options.merge ? await readExistingPo(options.output) : new Map<string, string>();
  const entries = [...new Set(options.translations)]
    .sort((left, right) => left.localeCompare(right))
    .map<PoEntry>((msgid) => ({ msgid, msgstr: existing.get(msgid) ?? "" }));

  await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
  await fs.writeFile(options.output, renderPo(entries, options), "utf8");
}

export function renderPo(entries: readonly PoEntry[], options: Omit<GeneratePoOptions, "output">): string {
  const headers = createHeaders(options);
  const lines = [renderEntry({ msgid: "", msgstr: formatHeaders(headers) })];

  for (const entry of entries) {
    lines.push(renderEntry(entry));
  }

  return `${lines.join("\n\n")}\n`;
}

async function readExistingPo(filePath: string): Promise<Map<string, string>> {
  try {
    const source = await fs.readFile(filePath, "utf8");
    return parsePo(source);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return new Map();
    }

    throw error;
  }
}

function parsePo(source: string): Map<string, string> {
  const entries = new Map<string, string>();
  const lines = source.split(/\r?\n/);
  let currentKey: "msgid" | "msgstr" | undefined;
  let msgid: string | undefined;
  let msgstr = "";

  const flush = (): void => {
    if (msgid !== undefined && msgid !== "") {
      entries.set(msgid, msgstr);
    }
    currentKey = undefined;
    msgid = undefined;
    msgstr = "";
  };

  for (const line of lines) {
    if (line.startsWith("msgid ")) {
      flush();
      currentKey = "msgid";
      msgid = unquotePoString(line.slice("msgid ".length));
      continue;
    }

    if (line.startsWith("msgstr ")) {
      currentKey = "msgstr";
      msgstr = unquotePoString(line.slice("msgstr ".length));
      continue;
    }

    if (line.startsWith('"')) {
      if (currentKey === "msgid" && msgid !== undefined) {
        msgid += unquotePoString(line);
      } else if (currentKey === "msgstr") {
        msgstr += unquotePoString(line);
      }
    }
  }

  flush();
  return entries;
}

function createHeaders(options: Omit<GeneratePoOptions, "output">): RenderedPoHeaders {
  const date = options.headers?.potCreationDate ?? new Date();
  const locale = options.locale ?? options.headers?.language ?? "zh_Hans";
  const packageName = options.packageName ?? "luci-app";

  return {
    projectIdVersion: options.headers?.projectIdVersion ?? packageName,
    potCreationDate: formatPoDate(date),
    poRevisionDate: options.headers?.poRevisionDate ?? "YEAR-MO-DA HO:MI+ZONE",
    lastTranslator: options.headers?.lastTranslator ?? "FULL NAME <EMAIL@ADDRESS>",
    languageTeam: options.headers?.languageTeam ?? "LANGUAGE <LL@li.org>",
    language: options.headers?.language ?? normalizePoLanguage(locale),
    mimeVersion: options.headers?.mimeVersion ?? "1.0",
    contentType: options.headers?.contentType ?? "text/plain; charset=UTF-8",
    contentTransferEncoding: options.headers?.contentTransferEncoding ?? "8bit",
    pluralForms: options.headers?.pluralForms ?? "nplurals=1; plural=0;",
  };
}

function formatHeaders(headers: RenderedPoHeaders): string {
  return [
    `Project-Id-Version: ${headers.projectIdVersion}\n`,
    `POT-Creation-Date: ${headers.potCreationDate}\n`,
    `PO-Revision-Date: ${headers.poRevisionDate}\n`,
    `Last-Translator: ${headers.lastTranslator}\n`,
    `Language-Team: ${headers.languageTeam}\n`,
    `Language: ${headers.language}\n`,
    `MIME-Version: ${headers.mimeVersion}\n`,
    `Content-Type: ${headers.contentType}\n`,
    `Content-Transfer-Encoding: ${headers.contentTransferEncoding}\n`,
    `Plural-Forms: ${headers.pluralForms}\n`,
  ].join("");
}

function renderEntry(entry: PoEntry): string {
  return `${renderPoValue("msgid", entry.msgid)}\n${renderPoValue("msgstr", entry.msgstr)}`;
}

function renderPoValue(key: "msgid" | "msgstr", value: string): string {
  if (value === "") {
    return `${key} ""`;
  }

  if (value.length <= 80 && !value.includes("\n")) {
    return `${key} ${quotePoString(value)}`;
  }

  const chunks = splitPoMultilineValue(value).flatMap((part) => splitLongLine(part, 80));
  return [`${key} ""`, ...chunks.map((chunk) => quotePoString(chunk))].join("\n");
}

function splitPoMultilineValue(value: string): string[] {
  return value.match(/[^\n]*\n|[^\n]+/g) ?? [value];
}

function splitLongLine(value: string, maxLength: number): string[] {
  if (value.length <= maxLength) {
    return [value];
  }

  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += maxLength) {
    chunks.push(value.slice(index, index + maxLength));
  }
  return chunks;
}

function quotePoString(value: string): string {
  return JSON.stringify(value);
}

function unquotePoString(value: string): string {
  const parsed: unknown = JSON.parse(value);
  return typeof parsed === "string" ? parsed : "";
}

function normalizePoLanguage(locale: string): string {
  return locale === "zh_Hans" ? "zh_CN" : locale.replace("-", "_");
}

function formatPoDate(date: Date): string {
  const pad = (value: number): string => value.toString().padStart(2, "0");
  const timezoneOffset = -date.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(timezoneOffset);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}${sign}${pad(Math.floor(absoluteOffset / 60))}${pad(absoluteOffset % 60)}`;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
