// dev
export const DEV_MODE = true;

// path
export const FONT_PATH = "fonts/Standard.flf";
export const PRD_PATH = DEV_MODE ? "docs/PRD-todo.md" : "docs/PRD.md";
export const TASKS_PATH = ".taskmaster/tasks/tasks.json";

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
export const DEFAULT_TAG = "master";
export const DEFAULT_STATUS = "pending";
export const DEFAULT_TASKS_TO_GENERATE = 10;
export const DEFAULT_SUBTASKS_TO_GENERATE = 5;
export const MIN_TASKS_TO_GENERATE = 3;
export const MAX_TASKS_TO_GENERATE = 30;
export const MIN_SUBTASKS_TO_GENERATE = 1;
export const MAX_SUBTASKS_TO_GENERATE = 10;
export const MAX_TITLE_LENGTH = 100;
export const MAX_TITLE_TRUNC_LENGTH = 40;
export const MAX_DESCRIPTION_LENGTH = 250;
export const MAX_DETAILS_LENGTH = 500;
export const MAX_PROMPT_LENGTH = 1024;
export const MIN_PARENT_ID = 1;
export const MAX_PARENT_ID = 50;

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
