// dev
export const DEV_MODE = true;

// path
export const FONT_PATH = "fonts/Standard.flf";
export const PRD_PATH = DEV_MODE ? "docs/PRD-todo.md" : "docs/PRD.md";
export const TASKS_PATH = ".taskmaster/tasks/tasks.json";

// tasks
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
export const MAX_DESCRIPTION_LENGTH = 250;
export const MAX_DETAILS_LENGTH = 500;
export const MAX_PROMPT_LENGTH = 1024;
export const MIN_PARENT_ID = 1;
export const MAX_PARENT_ID = 50;
