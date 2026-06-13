import { spawn, type ChildProcess } from "node:child_process";
import type { DevRemoteConfig } from "./config.ts";
import { SshUploader } from "./uploader.ts";
import { FileWatcher } from "./watcher.ts";

export interface DevRemoteOptions {
	projectRoot?: string;
}

export async function devRemote(config: DevRemoteConfig): Promise<void> {
	let buildProcess: ChildProcess | null = null;
	const uploader = new SshUploader(config);
	const watcher = new FileWatcher(config, uploader);

	const cleanup = async () => {
		console.log("\n\n👋 Shutting down...");
		if (buildProcess) buildProcess.kill();
		await watcher.stop();
		uploader.close();
		process.exit(0);
	};

	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	// Start build process in watch mode
	console.log(`📦 Starting build: ${config.buildCommand}`);
	buildProcess = spawn(config.buildCommand, {
		stdio: "inherit",
		shell: true,
		cwd: process.cwd(),
	});

	buildProcess.on("error", (err) => {
		console.error("❌ Build process error:", err);
	});

	buildProcess.on("exit", (code) => {
		if (code !== 0 && code !== null) {
			console.error(`❌ Build process exited with code ${code}`);
		}
	});

	// Delay watcher start to let build output settle
	await new Promise<void>((resolve) => {
		setTimeout(resolve, 2000);
	});

	watcher.start();
}
