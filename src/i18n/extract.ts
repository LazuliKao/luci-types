import { promises as fs } from "node:fs";
import * as ast from "typescript/unstable/ast";
import { collectSourceFiles, DEFAULT_EXTENSIONS } from "./files.ts";
import type {
	ExtractTranslationsOptions,
	WriteTranslationsOptions,
} from "./types.ts";

export async function extractTranslations(
	options: ExtractTranslationsOptions,
): Promise<string[]> {
	const inputs = Array.isArray(options.input) ? options.input : [options.input];
	const files = await collectSourceFiles(
		inputs,
		options.extensions ?? DEFAULT_EXTENSIONS,
		options.exclude,
	);
	const translations = new Set<string>();

	await Promise.all(
		files.map(async (filePath) => {
			const source = await fs.readFile(filePath, "utf8");
			extractFromSource(source, filePath, translations);
		}),
	);

	return [...translations]
		.filter(
			(translation) =>
				translation.trim() !== "" && translation !== "-" && translation !== "+",
		)
		.sort((left, right) => left.localeCompare(right));
}

export function extractFromSource(
	source: string,
	_fileName = "source.ts",
	translations = new Set<string>(),
): Set<string> {
	const scanner = ast.createScanner(
		true,
		ast.LanguageVariant.Standard,
	);
	scanner.setText(source);

	let token = scanner.scan();
	let expectOpenParen = false;

	while (token !== ast.SyntaxKind.EndOfFile) {
		if (token === ast.SyntaxKind.Identifier && scanner.getTokenText() === "_") {
			expectOpenParen = true;
		} else if (expectOpenParen && token === ast.SyntaxKind.OpenParenToken) {
			expectOpenParen = false;
			token = scanner.scan();
			if (
				token === ast.SyntaxKind.StringLiteral ||
				token === ast.SyntaxKind.NoSubstitutionTemplateLiteral
			) {
				translations.add(scanner.getTokenValue());
			}
			continue;
		} else {
			expectOpenParen = false;
		}
		token = scanner.scan();
	}

	return translations;
}

export async function writeTranslationsJson(
	options: WriteTranslationsOptions,
): Promise<string[]> {
	const translations = await extractTranslations(options);
	await fs.mkdir(dirname(options.output), { recursive: true });
	await fs.writeFile(
		options.output,
		`${JSON.stringify(translations, null, 2)}\n`,
		"utf8",
	);
	return translations;
}

function dirname(filePath: string): string {
	const lastSeparator = Math.max(
		filePath.lastIndexOf("/"),
		filePath.lastIndexOf("\\"),
	);
	return lastSeparator === -1 ? "." : filePath.slice(0, lastSeparator);
}
