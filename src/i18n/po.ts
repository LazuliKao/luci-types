import { promises as fs } from "node:fs";
import path from "node:path";
import type { GeneratePoOptions, PoHeaderOptions } from "./types.ts";

interface PoEntry {
	msgid: string;
	msgstr: string;
	comments?: string[];
}

interface PoDetails {
	msgstr: string;
	comments?: string[];
}

type RenderedPoHeaders = Omit<Required<PoHeaderOptions>, "potCreationDate"> & {
	potCreationDate: string;
};

export async function generatePo(options: GeneratePoOptions): Promise<void> {
	const existingDetails = options.merge
		? await readPoDetails(options.output)
		: new Map<string, PoDetails>();
	const entries = [...new Set(options.translations)]
		.sort((left, right) => left.localeCompare(right))
		.map<PoEntry>((msgid) => {
			const existing = existingDetails.get(msgid);
			return {
				msgid,
				msgstr:
					readNonEmpty(options.translated, msgid) ?? existing?.msgstr ?? "",
				comments: existing?.comments,
			};
		});

	await fs.mkdir(path.dirname(path.resolve(options.output)), {
		recursive: true,
	});
	await fs.writeFile(options.output, renderPo(entries, options), "utf8");
}

export function renderPo(
	entries: readonly PoEntry[],
	options: Omit<GeneratePoOptions, "output">,
): string {
	const headers = createHeaders(options);
	const lines = [renderEntry({ msgid: "", msgstr: formatHeaders(headers) })];

	for (const entry of entries) {
		lines.push(renderEntry(entry));
	}

	return `${lines.join("\n\n")}\n`;
}

export async function readPoTranslations(
	filePath: string,
): Promise<Map<string, string>> {
	const details = await readPoDetails(filePath);
	const result = new Map<string, string>();
	for (const [msgid, detail] of details) {
		result.set(msgid, detail.msgstr);
	}
	return result;
}

export async function readPoDetails(
	filePath: string,
): Promise<Map<string, PoDetails>> {
	try {
		const source = await fs.readFile(filePath, "utf8");
		return parsePoDetails(source);
	} catch (error) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return new Map();
		}

		throw error;
	}
}

function parsePoDetails(source: string): Map<string, PoDetails> {
	const entries = new Map<string, PoDetails>();
	const lines = source.split(/\r?\n/);
	let currentKey: "msgid" | "msgstr" | undefined;
	let msgid: string | undefined;
	let msgstr = "";
	let currentComments: string[] = [];

	const flush = (): void => {
		if (msgid !== undefined && msgid !== "") {
			entries.set(msgid, {
				msgstr,
				comments: currentComments.length > 0 ? [...currentComments] : undefined,
			});
		}
		currentKey = undefined;
		msgid = undefined;
		msgstr = "";
		currentComments = [];
	};

	for (const line of lines) {
		if (line.startsWith("#")) {
			if (currentKey === "msgstr") {
				flush();
			}
			currentComments.push(line);
			continue;
		}

		if (line.startsWith("msgid ")) {
			if (currentKey === "msgstr") {
				flush();
			}
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

function createHeaders(
	options: Omit<GeneratePoOptions, "output">,
): RenderedPoHeaders {
	const date = options.headers?.potCreationDate ?? new Date();
	const locale = options.locale ?? options.headers?.language ?? "zh_Hans";
	const packageName = options.packageName ?? "luci-app";

	return {
		projectIdVersion: options.headers?.projectIdVersion ?? packageName,
		potCreationDate: formatPoDate(date),
		poRevisionDate: options.headers?.poRevisionDate ?? "",
		lastTranslator: options.headers?.lastTranslator ?? "",
		languageTeam: options.headers?.languageTeam ?? "",
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
	const commentsStr =
		entry.comments && entry.comments.length > 0
			? `${entry.comments.join("\n")}\n`
			: "";
	return `${commentsStr}${renderPoValue("msgid", entry.msgid)}\n${renderPoValue("msgstr", entry.msgstr)}`;
}

function readNonEmpty(
	translations: ReadonlyMap<string, string> | undefined,
	msgid: string,
): string | undefined {
	const value = translations?.get(msgid);

	return value === undefined || value.trim() === "" ? undefined : value;
}

function renderPoValue(key: "msgid" | "msgstr", value: string): string {
	if (value === "") {
		return `${key} ""`;
	}

	if (value.length <= 76 && !value.includes("\n")) {
		return `${key} ${quotePoString(value)}`;
	}

	const chunks = splitPoMultilineValue(value).flatMap((part) =>
		splitLongLine(part, 76),
	);
	return [`${key} ""`, ...chunks.map((chunk) => quotePoString(chunk))].join(
		"\n",
	);
}

function splitPoMultilineValue(value: string): string[] {
	return value.match(/[^\n]*\n|[^\n]+/g) ?? [value];
}

function splitLongLine(value: string, maxLength: number): string[] {
	if (value.length <= maxLength) {
		return [value];
	}

	const chunks: string[] = [];
	let current = value;

	while (current.length > maxLength) {
		let breakIndex = current.lastIndexOf(" ", maxLength);

		if (breakIndex > 0) {
			breakIndex += 1;
			chunks.push(current.slice(0, breakIndex));
			current = current.slice(breakIndex);
		} else {
			chunks.push(current.slice(0, maxLength));
			current = current.slice(maxLength);
		}
	}

	if (current.length > 0) {
		chunks.push(current);
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
