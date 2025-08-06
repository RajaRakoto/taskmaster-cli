export type T_PackageManager = "npm" | "pnpm" | "bun";

export const VALID_PROVIDERS = [
	"openrouter",
	"ollama",
	"bedrock",
	"azure",
	"vertex",
] as const;

export type T_Provider = (typeof VALID_PROVIDERS)[number];

export interface I_AIModel {
	name: string;
	value: string;
	provider: T_Provider | null;
}
