import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { Client, type ConnectConfig, type SFTPWrapper } from "ssh2";
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

	private ensureDir(sftp: SFTPWrapper, dirPath: string): Promise<void> {
		const cleanPath = dirPath.replace(/\/+$/, "");
		if (!cleanPath) return Promise.resolve();

		return new Promise((resolve, reject) => {
			sftp.stat(cleanPath, (statErr, stats) => {
				if (!statErr && stats) {
					if (stats.isDirectory()) {
						return resolve();
					}
					return reject(
						new Error(`${cleanPath} exists but is not a directory`),
					);
				}

				const lastSlash = cleanPath.lastIndexOf("/");
				if (lastSlash > 0) {
					const parent = cleanPath.substring(0, lastSlash);
					this.ensureDir(sftp, parent)
						.then(() => {
							sftp.mkdir(cleanPath, (mkdirErr) => {
								if (mkdirErr) {
									sftp.stat(cleanPath, (statErr2, stats2) => {
										if (!statErr2 && stats2 && stats2.isDirectory()) {
											resolve();
										} else {
											reject(mkdirErr);
										}
									});
								} else {
									resolve();
								}
							});
						})
						.catch(reject);
				} else {
					sftp.mkdir(cleanPath, (mkdirErr) => {
						if (mkdirErr) {
							sftp.stat(cleanPath, (statErr2, stats2) => {
								if (!statErr2 && stats2 && stats2.isDirectory()) {
									resolve();
								} else {
									reject(mkdirErr);
								}
							});
						} else {
							resolve();
						}
					});
				}
			});
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

				const remoteDir = remotePath.includes("/")
					? remotePath.substring(0, remotePath.lastIndexOf("/"))
					: "";

				const doWrite = () => {
					const content = readFileSync(localPath);
					sftp.writeFile(remotePath, content, (writeErr) => {
						if (writeErr) {
							this.client = null;
							return reject(writeErr);
						}
						console.log(`✅ Uploaded: ${basename(localPath)} -> ${remotePath}`);
						resolve();
					});
				};

				if (remoteDir) {
					this.ensureDir(sftp, remoteDir)
						.then(doWrite)
						.catch((mkdirErr) => {
							this.client = null;
							reject(mkdirErr);
						});
				} else {
					doWrite();
				}
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
