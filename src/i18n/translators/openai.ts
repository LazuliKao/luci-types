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

		const content = await this.#createCompletion(texts);
		const translations = parseTranslationArray(content, texts.length);

		return new Map(
			texts.map((text, index) => {
				const translation = translations[index];

				if (translation === undefined || translation.trim() === "") {
					throw new Error(
						`Translator returned an empty translation for: ${text}`,
					);
				}

				return [text, translation];
			}),
		);
	}

	async #createCompletion(texts: readonly string[]): Promise<string> {
		const response = await fetch(this.#apiUrl, {
			method: "POST",
			headers: {
				authorization: `Bearer ${this.#apiKey}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				model: this.#model,
				temperature: this.#temperature,
				messages: [
					{
						role: "system",
						content: `You translate LuCI/OpenWrt web UI strings into ${this.#locale}. Return only a JSON array of translated strings. Keep placeholders, HTML tags, code, URLs, and variable names unchanged. The array length and order must match the input exactly.`,
					},
					{
						role: "system",
						content: await this.#loadSystemPrompt(),
					},
					{
						role: "user",
						content: texts
							.map((text, index) => `${index + 1}. ${JSON.stringify(text)}`)
							.join("\n"),
					},
				],
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

function parseTranslationArray(
	content: string,
	expectedLength: number,
): string[] {
	const json = stripMarkdownFence(content.trim());
	const parsed: unknown = JSON.parse(json);

	if (
		!Array.isArray(parsed) ||
		!parsed.every((entry) => typeof entry === "string")
	) {
		throw new Error("Translator response must be a JSON array of strings.");
	}

	if (parsed.length !== expectedLength) {
		throw new Error(
			`Translator returned ${parsed.length} item(s), expected ${expectedLength}.`,
		);
	}

	return parsed;
}

function stripMarkdownFence(value: string): string {
	if (!value.startsWith("```")) {
		return value;
	}

	return value.replace(/^```(?:json)?\s*/u, "").replace(/\s*```$/u, "");
}

const defaultSystemPrompt = `Translation rules:
- Use concise Simplified Chinese for zh_Hans/zh_CN UI text.
- Keep LuCI, OpenWrt, UCI, RPC, HTTP, HTTPS, IPv4, IPv6, TCP, UDP, DNS, DHCP, VLAN, MAC, SSH, JSON, API, URL, ID, and code-like tokens unchanged unless a natural Chinese UI term is standard.
- Preserve placeholders such as %s, %d, {name}, <code>, HTML tags, shell flags, paths, and punctuation that is part of syntax.
- Use common networking terms: Forward = 转发, Listen = 监听, Client = 客户端, Server = 服务端, Traffic In = 入站流量, Traffic Out = 出站流量, Toggle = 切换.
- Return only JSON. Do not add explanations.`;
