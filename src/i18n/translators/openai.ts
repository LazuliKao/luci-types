import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import type { Translator } from "../types.ts";

export interface OpenAICompatibleTranslatorOptions {
	apiKey?: string;
	apiUrl?: string;
	model?: string;
	locale?: string;
	systemPrompt?: string;
	promptPath?: string;
	temperature?: number;
}

interface ChatCompletionResponse {
	choices?: Array<{
		message?: {
			content?: string | null;
		};
	}>;
}

const defaultApiUrl = "https://api.openai.com/v1/chat/completions";
const defaultModel = "gpt-4o-mini";

const maxTranslationAttempts = 2;

export class OpenAICompatibleTranslator implements Translator {
	readonly #apiKey: string;
	readonly #apiUrl: string;
	readonly #model: string;
	readonly #locale: string;
	readonly #systemPrompt: string | undefined;
	readonly #promptPath: string | undefined;
	readonly #temperature: number;

	constructor(options: OpenAICompatibleTranslatorOptions = {}) {
		const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;

		if (apiKey === undefined || apiKey === "") {
			throw new Error(
				"Missing OpenAI API key. Set OPENAI_API_KEY or pass apiKey.",
			);
		}

		this.#apiKey = apiKey;
		this.#apiUrl = normalizeChatCompletionsUrl(
			options.apiUrl ?? process.env.OPENAI_API_URL ?? defaultApiUrl,
		);
		this.#model = options.model ?? process.env.OPENAI_MODEL ?? defaultModel;
		this.#locale = options.locale ?? "zh_Hans";
		this.#systemPrompt = options.systemPrompt;
		this.#promptPath = options.promptPath;
		this.#temperature = options.temperature ?? 0.2;
	}

	async translate(texts: readonly string[]): Promise<Map<string, string>> {
		if (texts.length === 0) {
			return new Map();
		}

		console.error(`[translate] Batch of ${texts.length} string(s).`);

		let retryFeedback: string | undefined;
		let previousResponse: string | undefined;
		const errors: Array<{ attempt: number; reason: string; response: string | undefined }> = [];

		for (let attempt = 1; attempt <= maxTranslationAttempts; attempt += 1) {
			try {
				console.error(`[translate] Attempt ${attempt}/${maxTranslationAttempts}...`);
				const content = await this.#createCompletion(texts, retryFeedback, previousResponse);

				console.error(`[translate] Raw model response:\n${content === "" ? "(empty)" : content}`);

				try {
					const translations = parseTranslationArray(content, texts);
					validateTranslations(texts, translations);

					console.error(`[translate] Attempt ${attempt} succeeded.`);
					return new Map(
						texts.map((text, index) => [text, translations[index] ?? ""]),
					);
				} catch (error) {
					const reason = formatRetryFeedback(error);
					console.error(`[translate] Validation/parse failed: ${reason}`);
					throw new TranslationValidationError(reason, content);
				}
			} catch (error) {
				const reason = formatRetryFeedback(error);
				const response = error instanceof TranslationValidationError ? error.response : undefined;
				errors.push({ attempt, reason, response });

				if (attempt === maxTranslationAttempts) {
					const details = errors
						.map((e) => {
							let msg = `  ─ Attempt ${e.attempt}/${maxTranslationAttempts}: ${e.reason}`;
							if (e.response !== undefined) {
								msg += `\n    Raw model response: ${JSON.stringify(e.response)}`;
							}
							return msg;
						})
						.join("\n");

					throw new Error(
						`Translator exhausted all retry attempts for ${texts.length} string(s).\n` +
							`Source texts: ${JSON.stringify(texts)}\n${details}`,
					);
				}

				console.error(`[translate] Retrying after attempt ${attempt} failure.`);
				retryFeedback = reason;
				previousResponse = error instanceof TranslationValidationError ? error.response : previousResponse;
			}
		}

		throw new Error(`Translator exhausted all retry attempts for ${texts.length} string(s).`);
	}

	async #createCompletion(
		texts: readonly string[],
		retryFeedback?: string,
		previousResponse?: string,
	): Promise<string> {
		const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
			{
				role: "system",
				content: `You translate LuCI/OpenWrt web UI strings into ${this.#locale}. Return only hashline lines in this format: __01_ab12__. "translation". The label separator is an underscore (__NN_xxxx__), never a period. Copy the label exactly, keep the same order. Preserve placeholders, HTML, code, URLs, \\n, whitespace, and newline counts.`,
			},
			{
				role: "system",
				content: await this.#loadSystemPrompt(),
			},
			{
				role: "user",
				content: `Translate these lines. Return hashline lines in the same order. Format: __01_ab12__. ${JSON.stringify("translation")} (underscore between numbers and hex). Copy labels exactly.\n${formatHashlineInput(texts)}`,
			},
		];

		if (retryFeedback !== undefined) {
			if (previousResponse !== undefined) {
				messages.push({
					role: "assistant",
					content: previousResponse,
				});
			}

			messages.push({
				role: "user",
				content: [
					"Invalid. Fix your previous hashline output and return the full corrected hashline response with the same labels and order.",
					"Do not translate, explain, or answer the validator feedback itself.",
					"Use the original source lines below and correct only the affected translations.",
					formatHashlineInput(texts),
					"Validator feedback:",
					retryFeedback,
				].join("\n"),
			});
		}

		const response = await fetch(this.#apiUrl, {
			method: "POST",
			headers: {
				authorization: `Bearer ${this.#apiKey}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				model: this.#model,
				temperature: this.#temperature,
				messages,
			}),
		});

		if (!response.ok) {
			throw new Error(
				`OpenAI-compatible API request failed: ${response.status} ${response.statusText} ${await response.text()}`,
			);
		}

		const data = (await response.json()) as ChatCompletionResponse;
		const content = data.choices?.[0]?.message?.content;

		if (typeof content !== "string" || content.trim() === "") {
			throw new Error("OpenAI-compatible API returned an empty message.");
		}

		return content;
	}

	async #loadSystemPrompt(): Promise<string> {
		if (this.#systemPrompt !== undefined) {
			return this.#systemPrompt;
		}

		if (this.#promptPath !== undefined) {
			return await fs.readFile(this.#promptPath, "utf8");
		}

		return defaultSystemPrompt;
	}
}

function normalizeChatCompletionsUrl(value: string): string {
	const trimmed = value.replace(/\/+$/, "");

	if (trimmed.endsWith("/chat/completions")) {
		return trimmed;
	}

	if (trimmed.endsWith("/v1") || !trimmed.includes("/v1/")) {
		return `${trimmed}/chat/completions`;
	}

	return trimmed;
}

const hashlineHashLength = 4;

function formatHashlineInput(texts: readonly string[]): string {
	const labels = getHashlineLabels(texts);
	return texts
		.map((text, index) => `${labels[index]}. ${JSON.stringify(text)}`)
		.join("\n");
}

function getHashlineLabels(texts: readonly string[]): string[] {
	const ordinalWidth = Math.max(2, String(texts.length).length);
	const hashes = createBatchHashes(texts);
	return texts.map((text, index) => createHashlineLabel(index, hashes[index], ordinalWidth));
}

function createHashlineLabel(index: number, hash: string, width: number): string {
	const ordinal = String(index + 1).padStart(width, "0");
	return `__${ordinal}_${hash}__`;
}

function createBatchHashes(values: readonly string[]): string[] {
	let length = hashlineHashLength;

	for (;;) {
		const hashes = values.map((v) => createHash("sha1").update(v).digest("hex").slice(0, length));
		if (new Set(hashes).size === hashes.length) {
			return hashes;
		}

		length += 1;
	}
}

class TranslationValidationError extends Error {
	readonly response: string;

	constructor(message: string, response: string) {
		super(message);
		this.name = "TranslationValidationError";
		this.response = response;
	}
}

function parseTranslationArray(
	content: string,
	sources: readonly string[],
): string[] {
	const normalized = stripMarkdownFence(content.trim());
	const expectedLabels = getHashlineLabels(sources);
	const parsed = tryParseHashlineList(normalized, expectedLabels);

	if (parsed === undefined) {
		throw new Error(
			"Translator response must be hashline output (__01_ab12__. \"translation\").",
		);
	}

	if (parsed.length !== sources.length) {
		throw new Error(
			`Translator returned ${parsed.length} item(s), expected ${sources.length}.`,
		);
	}

	return parsed;
}

function tryParseHashlineList(
	input: string,
	expectedLabels: readonly string[],
): string[] | undefined {
	const lines = input
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line !== "");

	if (lines.length === 0 || !lines[0]?.startsWith("__")) {
		return undefined;
	}

	if (lines.length !== expectedLabels.length) {
		throw new Error(
			`Translator returned ${lines.length} hashline item(s), expected ${expectedLabels.length}.`,
		);
	}

	return lines.map((line, index) => {
		const match = /^(__\d+[_.][0-9a-f]+__)\.\s*/u.exec(line);
		if (match === null) {
			throw new Error(
				`Translation ${index + 1} is not in hashline format (__01_ab12__. \"translation\").`,
			);
		}

		const label = match[1];
		const normalizedLabel = label.replace(".", "_");
		if (normalizedLabel !== expectedLabels[index]) {
			throw new Error(
				`Translation ${index + 1} used label ${label}, expected ${expectedLabels[index]}.`,
			);
		}

		const payload = line.slice(match[0].length);
		let value: unknown;

		try {
			value = JSON.parse(payload);
		} catch {
			throw new Error(
				`Translation ${index + 1} is not a valid quoted string after ${label}.`,
			);
		}

		if (typeof value !== "string") {
			throw new Error(`Translation ${index + 1} after ${label} must be a string.`);
		}

		return value;
	});
}

function stripMarkdownFence(value: string): string {
	if (!value.startsWith("```")) {
		return value;
	}

	return value.replace(/^```(?:json)?\s*/u, "").replace(/\s*```$/u, "");
}


function countOccurrences(value: string): number {
	return [...value].filter((char) => char === "\n").length;
}

function leadingWhitespace(value: string): string {
	return value.match(/^\s*/u)?.[0] ?? "";
}

function trailingWhitespace(value: string): string {
	return value.match(/\s*$/u)?.[0] ?? "";
}
	
function validateTranslations(
	sources: readonly string[],
	translations: readonly string[],
): void {
	for (const [index, source] of sources.entries()) {
		const target = translations[index];

		if (target === undefined || target.trim() === "") {
			throw new Error(`Translator returned an empty translation for item ${index + 1}.`);
		}

		assertPreservedInvariant(source, target, index, "newline count", countOccurrences);
		assertPreservedInvariant(source, target, index, "leading whitespace", leadingWhitespace);
		assertPreservedInvariant(source, target, index, "trailing whitespace", trailingWhitespace);

		assertSameTokens(source, target, index, "printf-style placeholders", /%(?:\d+\$)?[-+#0 ]*(?:\d+|\*)?(?:\.(?:\d+|\*))?[a-zA-Z%]/gu);
	}
}

function assertPreservedInvariant(
	source: string,
	target: string,
	index: number,
	label: string,
	project: (value: string) => string | number,
): void {
	if (project(source) !== project(target)) {
		throw new Error(
			`Translation ${index + 1} changed ${label}. Source=${JSON.stringify(source)} Target=${JSON.stringify(target)}`,
		);
	}
}

function assertSameTokens(
	source: string,
	target: string,
	index: number,
	label: string,
	pattern: RegExp,
): void {
	const sourceTokens = [...source.matchAll(pattern)].map((match) => match[0]).sort();
	if (sourceTokens.length === 0) {
		return;
	}

	const targetTokens = [...target.matchAll(pattern)].map((match) => match[0]).sort();
	if (sourceTokens.length !== targetTokens.length || !sourceTokens.every((token, i) => token === targetTokens[i])) {
		throw new Error(
			`Translation ${index + 1} changed ${label}. Expected tokens ${JSON.stringify(sourceTokens)} but got ${JSON.stringify(targetTokens)}. Source=${JSON.stringify(source)} Target=${JSON.stringify(target)}`,
		);
	}
}

function formatRetryFeedback(error: unknown): string {
	if (error instanceof TranslationValidationError) {
		return error.message;
	}

	return error instanceof Error ? error.message : String(error);
}

const defaultSystemPrompt = `Translation rules:
- Use concise Simplified Chinese for zh_Hans/zh_CN UI text.
- Keep LuCI, OpenWrt, UCI, RPC, HTTP, HTTPS, IPv4, IPv6, TCP, UDP, DNS, DHCP, VLAN, MAC, SSH, JSON, API, URL, ID, and code-like tokens unchanged unless a natural Chinese UI term is standard.
- Preserve placeholders (%s, %d, {name}), HTML tags, inline code, CLI flags/paths, escaped sequences (\\n, \\t), and newline counts exactly.
- Return only hashline lines: __01_ab12__. "translation" (underscore between numbers and hex, never a period). Reuse each label, keep order. No explanations, bullets, or markdown fences.
- Use common networking terms: Forward = 转发, Listen = 监听, Client = 客户端, Server = 服务端, Traffic In = 入站流量, Traffic Out = 出站流量, Toggle = 切换.`;
