#!/usr/bin/env node
import path from "node:path";
import { exportTranslations } from "../i18n/export.ts";

interface CliOptions {
	input: string[];
	output?: string;
	po?: string;
	locale: string;
	packageName?: string;
	merge: boolean;
	json: boolean;
	exclude: string[];
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
	});

	console.log(`Extracted ${result.translations.length} translation string(s).`);

	if (result.jsonPath !== undefined) {
		console.log(`Wrote JSON: ${path.resolve(result.jsonPath)}`);
	}

	if (result.poPath !== undefined) {
		console.log(`Wrote PO: ${path.resolve(result.poPath)}`);
	}
}

function parseArgs(args: readonly string[]): CliOptions {
	const options: CliOptions = {
		input: [],
		locale: "zh_Hans",
		merge: false,
		json: false,
		exclude: [],
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
  -h, --help             Show this help.

Examples:
  luci-i18n-export -i ./htdocs -o ./translations.json
  luci-i18n-export -i ./frontend-src/src --po ./po/zh_Hans/app.po --merge -p luci-app-example
`);
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`luci-i18n-export: ${message}`);
	process.exitCode = 1;
});
