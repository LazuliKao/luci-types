#!/usr/bin/env node
import path from "node:path";
import { exportTranslations } from "../i18n/export.ts";
import { OpenAICompatibleTranslator } from "../i18n/translators/index.ts";

interface CliOptions {
	input: string[];
	output?: string;
	po?: string;
	locale: string;
	packageName?: string;
	merge: boolean;
	json: boolean;
	exclude: string[];
	translate: boolean;
	translator: "openai";
	cache?: string;
	batchSize?: number;
	apiUrl?: string;
	prompt?: string;
	help: boolean;
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2));

	if (options.help) {
		printHelp();
		return;
	}

	if (options.input.length === 0) {
		throw new Error(
			"Missing --input. Provide one or more source files or directories.",
		);
	}

	if (options.translate && options.po === undefined) {
		throw new Error("--translate requires --po because translated values are written to PO msgstr entries.");
	}

	if (
		options.output === undefined &&
		options.po === undefined &&
		!options.json
	) {
		options.output = "translations.json";
	}

	const result = await exportTranslations({
		input: options.input,
		output: options.output,
		po: options.po,
		locale: options.locale,
		packageName: options.packageName,
		merge: options.merge,
		json: options.json,
		exclude: options.exclude,
		translator: options.translate ? createTranslator(options) : undefined,
		cachePath: options.translate ? options.cache : undefined,
		batchSize: options.batchSize,
		onTranslateProgress: ({ batch, batches, size }) => {
			console.log(`Translating batch ${batch}/${batches} (${size} string(s))...`);
		},
	});

	console.log(`Extracted ${result.translations.length} translation string(s).`);

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

function parseArgs(args: readonly string[]): CliOptions {
	const options: CliOptions = {
		input: [],
		locale: "zh_Hans",
		merge: false,
		json: false,
		exclude: [],
		translate: false,
		translator: "openai",
		help: false,
	};

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		switch (arg) {
			case "--help":
			case "-h":
				options.help = true;
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
				break;
			case "--locale":
			case "-l":
				index += 1;
				options.locale = readValue(args, index, arg);
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
				break;
			case "--cache":
				index += 1;
				options.cache = readValue(args, index, arg);
				break;
			case "--batch-size":
				index += 1;
				options.batchSize = readPositiveInteger(readValue(args, index, arg), arg);
				break;
			case "--api-url":
				index += 1;
				options.apiUrl = readValue(args, index, arg);
				break;
			case "--prompt":
				index += 1;
				options.prompt = readValue(args, index, arg);
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

function createTranslator(options: CliOptions): OpenAICompatibleTranslator {
	if (options.translator !== "openai") {
		throw new Error(`Unsupported translator: ${options.translator}`);
	}

	return new OpenAICompatibleTranslator({
		apiUrl: options.apiUrl,
		locale: options.locale,
		promptPath: options.prompt,
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
	console.log(`Usage: luci-i18n-export --input <path> [options]

Extract LuCI _("...") translation strings from JS/TS/JSX/TSX files.

Options:
  -i, --input <path>     Source file or directory. Repeatable.
  -o, --output <path>    Write extracted strings as JSON. Defaults to translations.json.
      --po <path>        Write a gettext .po file.
  -l, --locale <locale>  Target locale for .po headers. Default: zh_Hans.
  -p, --package <name>   Project/package name for .po metadata.
  -m, --merge            Preserve existing msgstr values when --po already exists.
      --exclude <name>   Directory name to exclude. Repeatable.
      --json             Force JSON output when only --po is provided.
      --translate        Translate extracted strings before writing --po. Requires --po.
      --translator <name> Translator backend. Currently: openai. Default: openai.
      --cache <path>     Translation cache JSON. Default: none.
      --batch-size <n>   Strings per translation request. Default: 25.
      OPENAI_MODEL       Environment variable for the model. Default: gpt-4o-mini.
      --api-url <url>    OpenAI-compatible endpoint. Default: OPENAI_API_URL or OpenAI.
      --prompt <path>    Extra system prompt markdown/text file.
  -h, --help             Show this help.

Examples:
  luci-i18n-export -i ./htdocs -o ./translations.json
  luci-i18n-export -i ./frontend-src/src --po ./po/zh_Hans/app.po --merge -p luci-app-example
  OPENAI_MODEL=gpt-4o-mini luci-i18n-export -i ./htdocs --po ./po/zh_Hans/app.po --translate
`);
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`luci-i18n-export: ${message}`);
	process.exitCode = 1;
});
