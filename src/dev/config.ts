import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { homedir } from "node:os";

export interface DevRemoteConfig {
	sshHost: string;
	sshPort: number;
	sshUsername: string;
	sshPassword?: string;
	sshPrivateKeyPath?: string;
	sshPassphrase?: string;
	remotePath: string;
	localDistPath: string;
	buildCommand: string;
	uploadExtensions?: string[];
}

function parseEnvFile(envPath: string): Record<string, string> {
	const content = readFileSync(envPath, "utf-8");
	const env: Record<string, string> = {};

	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;

		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed.slice(eqIndex + 1).trim();
		if (key) env[key] = value;
	}

	return env;
}

function resolveKeyPath(keyPath: string): string {
	if (keyPath.startsWith("~")) {
		return join(homedir(), keyPath.slice(1));
	}
	return keyPath;
}

export function loadDevRemoteConfig(projectRoot?: string): DevRemoteConfig {
	const root = projectRoot ?? process.cwd();
	const envPath = resolve(root, ".env");

	if (!existsSync(envPath)) {
		throw new Error(
			`.env file not found at ${envPath}. Copy .env.example to .env and configure it.`,
		);
	}

	const env = parseEnvFile(envPath);

	const sshHost = env.SSH_HOST;
	if (!sshHost) throw new Error("SSH_HOST is required in .env");

	const sshUsername = env.SSH_USERNAME;
	if (!sshUsername) throw new Error("SSH_USERNAME is required in .env");

	const remotePath = env.SSH_REMOTE_PATH;
	if (!remotePath) throw new Error("SSH_REMOTE_PATH is required in .env");

	const buildCommand = env.BUILD_COMMAND;
	if (!buildCommand) throw new Error("BUILD_COMMAND is required in .env");

	if (!env.SSH_PASSWORD && !env.SSH_PRIVATE_KEY_PATH) {
		throw new Error(
			"Either SSH_PASSWORD or SSH_PRIVATE_KEY_PATH must be set in .env",
		);
	}

	let sshPrivateKeyPath: string | undefined;
	if (env.SSH_PRIVATE_KEY_PATH) {
		const resolved = resolveKeyPath(env.SSH_PRIVATE_KEY_PATH);
		if (!existsSync(resolved)) {
			console.warn(`⚠️  Private key not found at ${resolved}, falling back to password`);
		} else {
			sshPrivateKeyPath = resolved;
		}
	}

	let uploadExtensions: string[] | undefined;
	if (env.UPLOAD_EXTENSIONS) {
		uploadExtensions = env.UPLOAD_EXTENSIONS.split(",")
			.map((ext) => ext.trim())
			.filter(Boolean);
	}

	return {
		sshHost,
		sshPort: parseInt(env.SSH_PORT || "22", 10),
		sshUsername,
		sshPassword: env.SSH_PASSWORD,
		sshPrivateKeyPath,
		sshPassphrase: env.SSH_PASSPHRASE,
		remotePath,
		localDistPath: resolve(root, env.LOCAL_DIST_PATH || "./dist"),
		buildCommand,
		uploadExtensions,
	};
}
