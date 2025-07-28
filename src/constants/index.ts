// dev
export const DEV_MODE = true;

// path
export const FONT_PATH = "fonts/Standard.flf";
export const PRD_PATH = DEV_MODE ? "docs/PRD-todo.md" : "docs/PRD.md";
export const TASKS_PATH = ".taskmaster/tasks/tasks.json";
export const TASKS_SRC_PATH = ".taskmaster";
export const TASKS_BCK_DEST_PATH = "backups/tmai-backup";

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

// status configuration
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

// package managers
export const PACKAGE_MANAGERS = ["npm", "pnpm", "bun"] as const;

// common messages
export const TASKMASTER_INIT_MSG = "TaskMaster AI Core initialized";
export const TASKS_FILE_WARN: (path: string) => string = (path: string) =>
	`tasks.json not found at "${path}". Please generate tasks from PRD first.`;

// supported languages for TMAI responses
export const LANG = [
	"English",
	"Chinese",
	"Japanese",
	"French",
	"Spanish",
	"German",
	"Portuguese",
	"Italian",
] as const;

// ai models configuration
export const AI_MODELS = [
	{ name: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
	{ name: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
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
