// dev
export const DEV_MODE = true;

// path
export const FONT_PATH = "fonts/Standard.flf";
export const PRD_PATH = DEV_MODE ? "docs/PRD-todo.md" : "docs/PRD.md";
export const TASKS_PATH = ".taskmaster/tasks/tasks.json";

// tasks
export const TASKS_STATUSES = [
	"todo",
	"in-progress",
	"done",
	"blocked",
	"pending",
];
export const MAX_TITLE_LENGTH = 50;
