#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tsxCli = require.resolve("tsx/cli");

const subcommands = {
	dev: "src/cli/luci-dev.ts",
	i18n: "src/cli/luci-i18n-export.ts",
};

const subcommand = process.argv[2];

if (
	!subcommand ||
	subcommand === "--help" ||
	subcommand === "-h" ||
	!(subcommand in subcommands)
) {
	console.log(`Usage: luci-types <command>\n`);
	console.log("Commands:");
	console.log("  dev    Start build watch + SSH auto-upload to router");
	console.log("  i18n   Extract and manage LuCI translations");
	console.log("\nRun luci-types <command> --help for command-specific options");
	process.exit(
		subcommand && subcommand !== "--help" && subcommand !== "-h" ? 1 : 0,
	);
}

const cli = path.join(packageRoot, subcommands[subcommand]);
const args = process.argv.slice(3);

const result = spawnSync(process.execPath, [tsxCli, cli, ...args], {
	stdio: "inherit",
});

if (result.error) {
	throw result.error;
}

process.exitCode = result.status ?? 1;
