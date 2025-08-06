/* libs */
import chalk from "chalk";

/* types */
import type { I_AIModel } from "@/@types/index";

// ===============================

// dev
export const DEV_MODE = true;

// path
export const FONT_PATH = "fonts/Standard.flf";
export const PRD_PATH = DEV_MODE ? "docs/PRD-todo.md" : "docs/PRD.md";
export const TASKS_PATH = ".taskmaster/tasks/tasks.json";
export const TASKS_SRC_PATH = ".taskmaster";
export const TASKS_BCK_DEST_PATH = "backups/tmai-backup";
export const REPORT_PATH = ".taskmaster/reports/task-complexity-report.json";
export const README_PATH = "README.md";

// tasks
export const MAIN_COMMAND = "task-master";
export const TASKS_PRIORITIES = ["low", "medium", "high"];
export const TASKS_STATUSES = [
	"pending",
	"in-progress",
	"done",
	"review",
	"deferred",
	"cancelled",
	"todo",
	"blocked",
];
export const TASKS_FILES = [
	"windsurfrules",
	".cursor",
	".roo",
	".roomodes",
	".taskmaster",
];
export const DEFAULT_TAG = "master";
export const DEFAULT_STATUS = "pending";
export const DEFAULT_TASKS_TO_GENERATE = 10;
export const DEFAULT_SUBTASKS_TO_GENERATE = 5;
export const MIN_TASKS_TO_GENERATE = 3;
export const MAX_TASKS_TO_GENERATE = 30;
export const MIN_SUBTASKS_TO_GENERATE = 1;
export const MAX_SUBTASKS_TO_GENERATE = 15;
export const MAX_TITLE_LENGTH = 100;
export const MAX_TITLE_TRUNC_LENGTH = 40;
export const MAX_DESCRIPTION_LENGTH = 250;
export const MAX_PROMPT_LENGTH = 1024;

// common messages
export const TASKMASTER_INIT_MSG = "TaskMaster AI Core initialized";
export const TASKS_FILE_WARN: (path: string) => string = (path: string) =>
	`tasks.json not found at "${path}". Please generate tasks from PRD first.`;

// ai models configuration
const MODELS_COMPATIBILITY = {
	high: "🟢",
	medium: "🟡",
	low: "🟣",
};
export const AI_MODELS: I_AIModel[] = [
	{
		name: `${MODELS_COMPATIBILITY.high} Gemini 2.5 Flash (free) ${chalk.gray("(google > free | 1M context)")}`,
		value: "gemini-2.5-flash",
		provider: null,
	},
	{
		name: `${MODELS_COMPATIBILITY.high} Gemini 2.5 Pro (free) ${chalk.gray("(google > free | 1M context)")}`,
		value: "gemini-2.5-pro",
		provider: null,
	},
	{
		name: `${MODELS_COMPATIBILITY.medium} Qwen 3 Coder ${chalk.gray("(openrouter > $0.20/M input | $0.80/M output | 262k context)")}`,
		value: "qwen/qwen3-coder",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.high} Qwen Turbo ${chalk.gray("(openrouter > $0.05/M input | $0.20/M output | 1M context)")}`,
		value: "qwen/qwen-turbo",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.medium} DeepSeek R1‑0528 ${chalk.gray("(openrouter > $0.18/M input | $0.72/M output | 163k context)")}`,
		value: "deepseek/deepseek-r1-0528",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.low} DeepSeek R1‑0528 (free) ${chalk.gray("(openrouter > free | 163k context)")}`,
		value: "deepseek/deepseek-r1-0528:free",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.high} DeepSeek Chat V3‑0324 ${chalk.gray("(openrouter > $0.18/M input | $0.72/M output | 163k context)")}`,
		value: "deepseek/deepseek-chat-v3-0324",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.low} DeepSeek Chat V3‑0324 (free) ${chalk.gray("(openrouter > fre | 163k context)")}`,
		value: "deepseek/deepseek-chat-v3-0324:free",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.high} Mistral DevStral Small 1.1 ${chalk.gray("(openrouter > $0.07/M input | $0.28/M output | 128k context)")}`,
		value: "mistralai/devstral-small",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.medium} Horizon Beta (free) ${chalk.gray("(openrouter > free | 256k context | training)")}`,
		value: "openrouter/horizon-beta",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.medium} Kimi K2 ${chalk.gray("(openrouter > $0.14/M input | $2.49/M output | 63k context)")}`,
		value: "moonshotai/kimi-k2",
		provider: "openrouter",
	},
	{
		name: `${MODELS_COMPATIBILITY.low} Kimi K2 (free) ${chalk.gray("(openrouter > free | 32k context)")}`,
		value: "moonshotai/kimi-k2:free",
		provider: "openrouter",
	},
];

// task conversion rules
export const TASK_TO_SUBTASK_RULES = [
	{
		rule: "The task must not already be a subtask",
		example:
			"Task #3 cannot be converted to a subtask if it's already Task #1.2",
	},
	{
		rule: "The target task must not depend on its future parent task",
		example:
			"Task #3 cannot depend on Task #1 if converting to subtask of Task #1",
	},
	{
		rule: "The task must not depend on subtasks from other groups",
		example:
			"Task #3 cannot depend on Task #2.1 if converting to subtask of Task #1",
	},
	{
		rule: "The conversion must not create circular dependencies",
		example:
			"Cannot convert Task #3 to subtask of Task #1 if Task #1 depends on Task #3",
	},
	{
		rule: "All existing dependencies will be preserved",
		example:
			"If Task #3 depends on Task #2, it will still depend on Task #2 after conversion",
	},
];

export const SUBTASK_TO_TASK_RULES = [
	{
		rule: "The subtask will be converted to a standalone task",
		example: "Subtask #1.2 becomes Task #4 (new sequential ID)",
	},
	{
		rule: "Dependencies on other tasks will be preserved",
		example: "If #1.2 depends on #3, new Task #4 will still depend on #3",
	},
	{
		rule: "Dependencies on other subtasks from the same group will be removed",
		example: "If #1.2 depends on #1.1, this dependency is removed",
	},
	{
		rule: "Dependent subtasks will be updated",
		example:
			"If #1.3 depends on #1.2, it will be updated to depend on new Task #4",
	},
	{
		rule: "The new task will have a unique sequential ID",
		example: "Subtask #1.2 becomes Task #4 (next available ID)",
	},
];

// notes
export const NOTE_MODELS = `Note: Model compatibility levels are indicated by: ${MODELS_COMPATIBILITY.high} high (most reliable), ${MODELS_COMPATIBILITY.medium} medium, ${MODELS_COMPATIBILITY.low} low. Higher compatibility means more reliable TMAI operations with fewer errors. While all models can perform tasks, those with higher compatibility are recommended for critical operations. Additional models — including popular paid options with competitive pricing — are available, mostly via OpenRouter.`;
export const NOTE_LANGS =
	"Note: Make sure the LLM used by TMAI supports the language you choose!";

// extras
export const GITHUB_URL = "https://github.com/RajaRakoto/taskmaster-cli";
export const DEFAULT_COUNTDOWN = 10;
export const PACKAGE_MANAGERS = ["npm", "pnpm", "bun"] as const;
export const LANGS = [
	"English",
	"Chinese",
	"Japanese",
	"French",
	"Spanish",
	"German",
	"Portuguese",
	"Italian",
] as const;
export const STATUS_CONFIG = {
	todo: { icon: "○", color: "gray" },
	"in-progress": { icon: "▶", color: "yellow" },
	done: { icon: "✓", color: "green" },
	blocked: { icon: "✗", color: "red" },
	pending: { icon: "…", color: "gray" },
	review: { icon: "★", color: "blue" },
	deferred: { icon: "↓", color: "magenta" },
	cancelled: { icon: "✗", color: "redBright" },
};
