import { Client, type ConnectConfig } from "ssh2";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import type { DevRemoteConfig } from "./config.ts";

export class SshUploader {
	private config: DevRemoteConfig;
	private client: Client | null = null;
	private connecting = false;

	constructor(config: DevRemoteConfig) {
		this.config = config;
	}

	private buildConnectConfig(): ConnectConfig {
		const cfg: ConnectConfig = {
			host: this.config.sshHost,
			port: this.config.sshPort,
			username: this.config.sshUsername,
		};

		if (this.config.sshPrivateKeyPath) {
			cfg.privateKey = readFileSync(this.config.sshPrivateKeyPath);
			if (this.config.sshPassphrase) {
				cfg.passphrase = this.config.sshPassphrase;
			}
		} else if (this.config.sshPassword) {
			cfg.password = this.config.sshPassword;
		}

		return cfg;
	}

	private ensureConnection(): Promise<Client> {
		if (this.client) return Promise.resolve(this.client);
		if (this.connecting) {
			return new Promise((resolve) => {
				const check = () => {
					if (this.client) resolve(this.client);
					else setTimeout(check, 50);
				};
				check();
			});
		}

		this.connecting = true;
		return new Promise((resolve, reject) => {
			const client = new Client();

			client.on("ready", () => {
				console.log("📡 SSH connection established");
				this.client = client;
				this.connecting = false;
				resolve(client);
			});

			client.on("error", (err) => {
				this.client = null;
				this.connecting = false;
				reject(err);
			});

			client.on("close", () => {
				this.client = null;
			});

			client.connect(this.buildConnectConfig());
		});
	}

	async upload(localPath: string, remotePath: string): Promise<void> {
		const client = await this.ensureConnection();

		return new Promise((resolve, reject) => {
			client.sftp((err, sftp) => {
				if (err) {
					this.client = null;
					return reject(err);
				}

				const content = readFileSync(localPath);
				sftp.writeFile(remotePath, content, (writeErr) => {
					if (writeErr) {
						this.client = null;
						return reject(writeErr);
					}
					console.log(`✅ Uploaded: ${basename(localPath)} -> ${remotePath}`);
					resolve();
				});
			});
		});
	}

	async uploadWithRetry(
		localPath: string,
		remotePath: string,
		maxRetries = 1,
	): Promise<void> {
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				await this.upload(localPath, remotePath);
				return;
			} catch (err) {
				if (attempt < maxRetries) {
					console.warn(
						`⚠️  Upload failed, retrying (${attempt + 1}/${maxRetries})...`,
					);
					this.client = null;
				} else {
					throw err;
				}
			}
		}
	}

	close(): void {
		if (this.client) {
			this.client.end();
			this.client = null;
		}
	}
}
