import { watch, type FSWatcher } from "chokidar";
import { basename } from "node:path";
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
		if (!this.config.uploadExtensions || this.config.uploadExtensions.length === 0) {
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
				const fileName = basename(file);
				const remoteFilePath = `${this.config.remotePath}/${fileName}`;
				await this.uploader.uploadWithRetry(file, remoteFilePath);
			} catch (err) {
				console.error(`❌ Upload failed for ${file}:`, err);
			}
		}
	}

	start(): void {
		console.log(`📂 Watching: ${this.config.localDistPath}`);
		console.log(
			`📤 Upload to: ${this.config.sshUsername}@${this.config.sshHost}:${this.config.remotePath}\n`,
		);

		this.watcher = watch(this.config.localDistPath, {
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
