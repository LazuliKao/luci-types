#!/usr/bin/env node
import { loadDevRemoteConfig, devRemote } from "../dev/index.ts";

function printHelp(): void {
	console.log(`Usage: luci-types dev [options]

Start build watch + SSH auto-upload to router.

Reads configuration from .env in the current working directory.

Options:
  --help, -h   Show this help message

Environment variables (in .env):
  SSH_HOST             Router hostname or IP (required)
  SSH_PORT             SSH port, default 22
  SSH_USERNAME         SSH username (required)
  SSH_PASSWORD         SSH password
  SSH_PRIVATE_KEY_PATH Path to SSH private key (overrides password)
  SSH_PASSPHRASE       Passphrase for private key
  SSH_REMOTE_PATH      Remote directory to upload to (required)
  LOCAL_DIST_PATH      Local build output directory, default ./dist
  BUILD_COMMAND        Build command to run in watch mode (required)
  UPLOAD_EXTENSIONS    Comma-separated file extensions to upload, e.g. ".js,.css"
`);
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);

	if (args.includes("--help") || args.includes("-h")) {
		printHelp();
		process.exit(0);
	}

	const config = loadDevRemoteConfig();
	await devRemote(config);
}

main().catch((error: unknown) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
