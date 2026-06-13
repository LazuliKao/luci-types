import { watch, type FSWatcher } from "chokidar";
import { basename, resolve } from "node:path";
import type { DevRemoteConfig } from "./config.ts";
import { SshUploader } from "./uploader.ts";

export class FileWatcher {
	private watcher: FSWatcher | null = null;
	private uploader: SshUploader;
	private config: DevRemoteConfig;
	private uploadQueue: Set<string> = new Set();
	private uploadTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(config: DevRemoteConfig, uploader: SshUploader) {
		this.config = config;
		this.uploader = uploader;
	}

	private shouldUpload(filePath: string): boolean {
		if (
			!this.config.uploadExtensions ||
			this.config.uploadExtensions.length === 0
		) {
			return true;
		}
		return this.config.uploadExtensions.some((ext) => filePath.endsWith(ext));
	}

	private enqueue(filePath: string): void {
		if (!this.shouldUpload(filePath)) return;

		const fileName = basename(filePath);
		console.log(`📝 File changed: ${fileName}`);
		this.uploadQueue.add(filePath);

		if (this.uploadTimer) clearTimeout(this.uploadTimer);
		this.uploadTimer = setTimeout(() => this.processQueue(), 1000);
	}

	private async processQueue(): Promise<void> {
		if (this.uploadQueue.size === 0) return;

		const files = Array.from(this.uploadQueue);
		this.uploadQueue.clear();

		for (const file of files) {
			try {
				const absoluteFile = resolve(file);
				let matchIndex = -1;
				// Match the longest path to handle nested paths correctly if they overlap
				let longestMatchLen = -1;
				for (let i = 0; i < this.config.localDistPaths.length; i++) {
					const localPath = this.config.localDistPaths[i];
					if (
						absoluteFile.startsWith(localPath) &&
						localPath.length > longestMatchLen
					) {
						matchIndex = i;
						longestMatchLen = localPath.length;
					}
				}

				if (matchIndex === -1) {
					console.warn(`⚠️  Cannot determine remote path for ${file}`);
					continue;
				}

				const fileName = basename(file);
				const remotePathDir = this.config.remotePaths[matchIndex];
				const remoteFilePath = `${remotePathDir}/${fileName}`;
				await this.uploader.uploadWithRetry(file, remoteFilePath);
			} catch (err) {
				console.error(`❌ Upload failed for ${file}:`, err);
			}
		}
	}

	start(): void {
		console.log(`📂 Watching:\n  ${this.config.localDistPaths.join("\n  ")}`);
		console.log(
			`📤 Uploading to:\n  ${this.config.remotePaths.map((p) => `${this.config.sshUsername}@${this.config.sshHost}:${p}`).join("\n  ")}\n`,
		);

		this.watcher = watch(this.config.localDistPaths, {
			persistent: true,
			ignoreInitial: false,
			awaitWriteFinish: {
				stabilityThreshold: 500,
				pollInterval: 100,
			},
		});

		this.watcher.on("add", (path) => this.enqueue(path));
		this.watcher.on("change", (path) => this.enqueue(path));
		this.watcher.on("error", (err) => console.error("❌ Watcher error:", err));

		console.log("👀 Watching for changes... (Press Ctrl+C to stop)\n");
	}

	async stop(): Promise<void> {
		if (this.uploadTimer) {
			clearTimeout(this.uploadTimer);
			this.uploadTimer = null;
		}
		if (this.watcher) {
			await this.watcher.close();
			this.watcher = null;
		}
	}
}
