#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadConfigFile } from "../i18n/config.ts";
import { exportTranslations } from "../i18n/export.ts";
import { OpenAICompatibleTranslator } from "../i18n/translators/index.ts";
import type { PoHeaderOptions } from "../i18n/types.ts";

export interface CliOptions {
	config?: string;
	pot?: string;
	extractPot?: boolean;
	input: string[];
	output?: string;
	po?: string;
	locale?: string;
	localeExplicit: boolean;
	poExplicit: boolean;
	packageName?: string;
	merge: boolean;
	json: boolean;
	exclude: string[];
	translate?: boolean;
	translator: "openai";
	translatorExplicit: boolean;
	cache?: string;
	batchSize?: number;
	apiUrl?: string;
	prompt?: string;
	projectIdVersion?: string;
	poRevisionDate?: string;
	lastTranslator?: string;
	languageTeam?: string;
	language?: string;
	mimeVersion?: string;
	contentType?: string;
	contentTransferEncoding?: string;
	pluralForms?: string;
	help: boolean;
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const cliOpts = parseArgs(args);

	if (cliOpts.help) {
		printHelp();
		return;
	}

	const { config: fileConfig, configFile } = await loadConfigFile({
		configFile: cliOpts.config,
	});

	if (configFile) {
		console.log(`Loaded config: ${path.resolve(configFile)}`);
	}

	const input =
		cliOpts.input.length > 0 ? cliOpts.input : (fileConfig.input ?? []);
	if (input.length === 0 && !cliOpts.help) {
		if (args.length === 0) {
			printHelp();
			return;
		}
		throw new Error(
			"Missing --input. Provide one or more source files or directories, or configure 'input' in luci-i18n.config.",
		);
	}

	const packageName = cliOpts.packageName ?? fileConfig.packageName;
	const exclude =
		cliOpts.exclude.length > 0 ? cliOpts.exclude : (fileConfig.exclude ?? []);
	const potPath = cliOpts.pot ?? fileConfig.pot;
	const shouldExtractPot =
		cliOpts.extractPot ?? fileConfig.extractPot ?? potPath !== undefined;

	// 1. Extract POT template first if enabled and pot is defined
	if (shouldExtractPot && potPath) {
		console.log(`Extracting POT template: ${path.resolve(potPath)}`);
		const potResult = await exportTranslations({
			input,
			po: potPath,
			packageName,
			exclude,
			merge: false,
		});
		console.log(
			`Wrote POT template (${potResult.translations.length} string(s)): ${path.resolve(potPath)}`,
		);
	}

	// 2. Determine target locales
	const configLocales = fileConfig.locales ?? [];
	const isMultiLocaleConfig =
		configLocales.length > 0 && !cliOpts.localeExplicit && !cliOpts.poExplicit;

	const targets: Array<{
		locale: string;
		po?: string;
		prompt?: string;
		headers?: PoHeaderOptions;
	}> = [];

	if (isMultiLocaleConfig) {
		for (const loc of configLocales) {
			if (typeof loc === "string") {
				targets.push({ locale: loc });
			} else {
				targets.push(loc);
			}
		}
	} else {
		targets.push({
			locale: cliOpts.locale ?? "zh_Hans",
			po: cliOpts.po,
			prompt: cliOpts.prompt,
		});
	}

	const globalTranslateEnabled =
		cliOpts.translate ?? fileConfig.translate?.enabled ?? false;

	for (const target of targets) {
		const locale = target.locale;
		const po = target.po ?? cliOpts.po;
		const promptTemplate =
			target.prompt ?? cliOpts.prompt ?? fileConfig.translate?.prompt;
		const promptPath = resolvePromptPath(promptTemplate, locale);

		const translateEnabled = globalTranslateEnabled;
		if (translateEnabled && po === undefined) {
			throw new Error(
				`Translation requires --po or configured po path for locale '${locale}'.`,
			);
		}

		let output = cliOpts.output;
		if (
			output === undefined &&
			po === undefined &&
			!cliOpts.json &&
			!isMultiLocaleConfig
		) {
			output = "translations.json";
		}

		const headers = buildHeaders(cliOpts, target.headers);

		const batchSize = cliOpts.batchSize ?? fileConfig.translate?.batchSize;
		const apiUrl = cliOpts.apiUrl ?? fileConfig.translate?.apiUrl;
		const translatorName = cliOpts.translatorExplicit
			? cliOpts.translator
			: (fileConfig.translate?.translator ?? "openai");
		const cachePath = cliOpts.cache ?? fileConfig.translate?.cache;

		const translator = translateEnabled
			? createTranslator({
					translator: translatorName,
					apiUrl,
					locale,
					promptPath,
				})
			: undefined;

		console.log(`\nProcessing locale [${locale}]...`);
		const result = await exportTranslations({
			input,
			output,
			po,
			locale,
			packageName,
			merge: cliOpts.merge,
			json: cliOpts.json,
			exclude,
			headers,
			translator,
			cachePath: translateEnabled ? cachePath : undefined,
			batchSize,
			onTranslateProgress: ({ batch, batches, size }) => {
				console.log(
					`[${locale}] Translating batch ${batch}/${batches} (${size} string(s))...`,
				);
			},
		});

		console.log(
			`Extracted ${result.translations.length} translation string(s) for [${locale}].`,
		);

		if (result.jsonPath !== undefined) {
			console.log(`Wrote JSON: ${path.resolve(result.jsonPath)}`);
		}

		if (result.poPath !== undefined) {
			console.log(`Wrote PO: ${path.resolve(result.poPath)}`);
		}

		if (result.translatedCount !== undefined) {
			console.log(`Translated ${result.translatedCount} new string(s).`);
		}

		if (result.cachePath !== undefined) {
			console.log(`Translation cache: ${path.resolve(result.cachePath)}`);
		}
	}
}

export function parseArgs(args: readonly string[]): CliOptions {
	const options: CliOptions = {
		input: [],
		localeExplicit: false,
		poExplicit: false,
		merge: false,
		json: false,
		exclude: [],
		translator: "openai",
		translatorExplicit: false,
		help: false,
	};

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		switch (arg) {
			case "--help":
			case "-h":
				options.help = true;
				break;
			case "--config":
			case "-c":
				index += 1;
				options.config = readValue(args, index, arg);
				break;
			case "--pot":
				index += 1;
				options.pot = readValue(args, index, arg);
				break;
			case "--extract-pot":
				options.extractPot = true;
				break;
			case "--no-extract-pot":
				options.extractPot = false;
				break;
			case "--input":
			case "-i":
				index += 1;
				options.input.push(readValue(args, index, arg));
				break;
			case "--output":
			case "-o":
				index += 1;
				options.output = readValue(args, index, arg);
				break;
			case "--po":
				index += 1;
				options.po = readValue(args, index, arg);
				options.poExplicit = true;
				break;
			case "--locale":
			case "-l":
				index += 1;
				options.locale = readValue(args, index, arg);
				options.localeExplicit = true;
				break;
			case "--package":
			case "-p":
				index += 1;
				options.packageName = readValue(args, index, arg);
				break;
			case "--exclude":
				index += 1;
				options.exclude.push(readValue(args, index, arg));
				break;
			case "--merge":
			case "-m":
				options.merge = true;
				break;
			case "--json":
				options.json = true;
				break;
			case "--translate":
				options.translate = true;
				break;
			case "--translator":
				index += 1;
				options.translator = readTranslator(readValue(args, index, arg));
				options.translatorExplicit = true;
				break;
			case "--cache":
				index += 1;
				options.cache = readValue(args, index, arg);
				break;
			case "--batch-size":
				index += 1;
				options.batchSize = readPositiveInteger(
					readValue(args, index, arg),
					arg,
				);
				break;
			case "--api-url":
				index += 1;
				options.apiUrl = readValue(args, index, arg);
				break;
			case "--prompt":
				index += 1;
				options.prompt = readValue(args, index, arg);
				break;
			case "--project-id-version":
				index += 1;
				options.projectIdVersion = readValue(args, index, arg);
				break;
			case "--po-revision-date":
				index += 1;
				options.poRevisionDate = readValue(args, index, arg);
				break;
			case "--last-translator":
				index += 1;
				options.lastTranslator = readValue(args, index, arg);
				break;
			case "--language-team":
				index += 1;
				options.languageTeam = readValue(args, index, arg);
				break;
			case "--language":
				index += 1;
				options.language = readValue(args, index, arg);
				break;
			case "--mime-version":
				index += 1;
				options.mimeVersion = readValue(args, index, arg);
				break;
			case "--content-type":
				index += 1;
				options.contentType = readValue(args, index, arg);
				break;
			case "--content-transfer-encoding":
				index += 1;
				options.contentTransferEncoding = readValue(args, index, arg);
				break;
			case "--plural-forms":
				index += 1;
				options.pluralForms = readValue(args, index, arg);
				break;
			default:
				if (arg.startsWith("-")) {
					throw new Error(`Unknown option: ${arg}`);
				}
				options.input.push(arg);
				break;
		}
	}

	return options;
}

function resolvePromptPath(
	template?: string,
	locale?: string,
): string | undefined {
	if (!template) return undefined;
	if (locale && template.includes("${locale}")) {
		const interpolated = template.replace(/\$\{locale\}/g, locale);
		if (fs.existsSync(interpolated)) {
			return interpolated;
		}
		const fallback = template.replace(/\$\{locale\}\.?/g, "");
		if (fs.existsSync(fallback)) {
			return fallback;
		}
		return interpolated;
	}
	return template;
}

function buildHeaders(
	cliOpts: CliOptions,
	targetHeaders?: PoHeaderOptions,
): PoHeaderOptions | undefined {
	const h = {
		projectIdVersion:
			cliOpts.projectIdVersion ?? targetHeaders?.projectIdVersion,
		poRevisionDate: cliOpts.poRevisionDate ?? targetHeaders?.poRevisionDate,
		lastTranslator: cliOpts.lastTranslator ?? targetHeaders?.lastTranslator,
		languageTeam: cliOpts.languageTeam ?? targetHeaders?.languageTeam,
		language: cliOpts.language ?? targetHeaders?.language,
		mimeVersion: cliOpts.mimeVersion ?? targetHeaders?.mimeVersion,
		contentType: cliOpts.contentType ?? targetHeaders?.contentType,
		contentTransferEncoding:
			cliOpts.contentTransferEncoding ?? targetHeaders?.contentTransferEncoding,
		pluralForms: cliOpts.pluralForms ?? targetHeaders?.pluralForms,
	};

	return Object.values(h).some((v) => v !== undefined) ? h : undefined;
}

function createTranslator(options: {
	translator: string;
	apiUrl?: string;
	locale: string;
	promptPath?: string;
}): OpenAICompatibleTranslator {
	if (options.translator !== "openai") {
		throw new Error(`Unsupported translator: ${options.translator}`);
	}

	return new OpenAICompatibleTranslator({
		apiUrl: options.apiUrl,
		locale: options.locale,
		promptPath: options.promptPath,
	});
}

function readTranslator(value: string): "openai" {
	if (value === "openai") {
		return value;
	}

	throw new Error(`Unsupported translator: ${value}`);
}

function readPositiveInteger(value: string, option: string): number {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		throw new Error(`${option} must be a positive integer.`);
	}

	return parsed;
}

function readValue(
	args: readonly string[],
	index: number,
	option: string,
): string {
	const value = args[index];
	if (value === undefined || value.startsWith("-")) {
		throw new Error(`Missing value for ${option}`);
	}
	return value;
}

function printHelp(): void {
	console.log(`Usage: luci-types i18n [options]

Extract LuCI _("...") translation strings from JS/TS/JSX/TSX files.

Options:
  -c, --config <path>      Path to configuration file (luci-i18n.config.ts/js/json).
      --pot <path>         Path to write/update POT template file.
      --extract-pot        Force POT template extraction before locale processing.
      --no-extract-pot     Disable POT template extraction.
  -i, --input <path>       Source file or directory. Repeatable.
  -o, --output <path>      Write extracted strings as JSON. Defaults to translations.json.
      --po <path>          Write a gettext .po file.
  -l, --locale <locale>    Target locale for .po headers. Default: zh_Hans.
  -p, --package <name>     Project/package name for .po metadata.
  -m, --merge              Preserve existing msgstr values when --po already exists.
      --exclude <name>     Directory name to exclude. Repeatable.
      --json               Force JSON output when only --po is provided.
      --translate          Translate extracted strings before writing --po. Requires --po.
      --translator <name>  Translator backend. Currently: openai. Default: openai.
      --cache <path>       Translation cache JSON. Default: none.
      --batch-size <n>     Strings per translation request. Default: 25.
      --api-url <url>      OpenAI-compatible endpoint. Default: OPENAI_API_URL or OpenAI.
      --prompt <path>      Extra system prompt markdown/text file (supports \${locale}).
  -h, --help               Show this help.
`);
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`luci-i18n-export: ${message}`);
	process.exitCode = 1;
});
