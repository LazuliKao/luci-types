import { loadConfig } from "c12";
import type { LuciI18nConfig } from "./types.ts";

export function defineConfig(config: LuciI18nConfig): LuciI18nConfig {
	return config;
}

export interface LoadConfigFileOptions {
	configFile?: string;
	cwd?: string;
}

export interface LoadConfigFileResult {
	config: LuciI18nConfig;
	configFile?: string;
}

export async function loadConfigFile(
	options?: LoadConfigFileOptions,
): Promise<LoadConfigFileResult> {
	const { config, configFile } = await loadConfig<LuciI18nConfig>({
		name: "luci-i18n",
		configFile: options?.configFile,
		cwd: options?.cwd ?? process.cwd(),
		defaults: {},
	});

	return {
		config: config || {},
		configFile,
	};
}
