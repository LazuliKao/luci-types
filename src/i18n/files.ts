import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_EXCLUDED_SEGMENTS = new Set([
	".git",
	"build",
	"dist",
	"node_modules",
	"out",
]);

export const DEFAULT_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"] as const;

export async function collectSourceFiles(
	inputs: readonly string[],
	extensions: readonly string[] = DEFAULT_EXTENSIONS,
	exclude: readonly string[] = [],
): Promise<string[]> {
	const extensionSet = new Set(
		extensions.map((extension) => extension.toLowerCase()),
	);
	const excludedSegments = new Set([...DEFAULT_EXCLUDED_SEGMENTS, ...exclude]);
	const files = new Set<string>();

	for (const input of inputs) {
		await collect(input, extensionSet, excludedSegments, files);
	}

	return [...files].sort((left, right) => left.localeCompare(right));
}

async function collect(
	targetPath: string,
	extensionSet: ReadonlySet<string>,
	excludedSegments: ReadonlySet<string>,
	files: Set<string>,
): Promise<void> {
	const resolvedPath = path.resolve(targetPath);
	const stat = await fs.stat(resolvedPath);

	if (stat.isFile()) {
		if (extensionSet.has(path.extname(resolvedPath).toLowerCase())) {
			files.add(resolvedPath);
		}
		return;
	}

	if (!stat.isDirectory()) {
		return;
	}

	const directoryName = path.basename(resolvedPath);
	if (excludedSegments.has(directoryName)) {
		return;
	}

	const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
	await Promise.all(
		entries.map((entry) => {
			const entryPath = path.join(resolvedPath, entry.name);

			if (entry.isDirectory() && excludedSegments.has(entry.name)) {
				return Promise.resolve();
			}

			if (entry.isDirectory() || entry.isFile()) {
				return collect(entryPath, extensionSet, excludedSegments, files);
			}

			return Promise.resolve();
		}),
	);
}
