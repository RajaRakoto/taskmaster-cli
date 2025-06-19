/* libs */
import inquirer from "inquirer";
import chalk from "chalk";
import * as emoji from "node-emoji";

/* constants */
import { DEV_MODE } from "./constants";

// TODO: done
// ==============================
// Main menu
// ==============================

export const mainMenu_prompt = [
	{
		type: "list",
		name: "mainMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 15,
		choices: [
			{
				name: `${emoji.get("rocket")} Initialization and Configuration`,
				value: "tmai-init",
			},
			new inquirer.Separator("―――――――――――――――――――――――――――――――――――"),
			{
				name: `${emoji.get("page_facing_up")} Task generation (AI)`,
				value: "tmai-gen",
			},
			{
				name: `${emoji.get("heavy_check_mark")}  Task management (AI)`,
				value: "tmai-manage",
			},
			{
				name: `${emoji.get("link")} Dependencies (AI)`,
				value: "tmai-deps",
			},
			{
				name: `${emoji.get("bar_chart")} Analysis and Decomposition (AI)`,
				value: "tmai-analysis",
			},
			new inquirer.Separator("―――――――――――――――――――――――――――――――――――"),
			{
				name: `${emoji.get("books")} Documentation`,
				value: "tmai-docs",
			},
			...(DEV_MODE
				? [
						{
							name: `${emoji.get("gear")}  Dev mode`,
							value: "tmai-dev",
						},
					]
				: []),
			{
				name: `${emoji.get("door")} Exit`,
				value: "exit",
			},
		],
	},
];

// TODO: done
// ==============================
// Initialization and Configuration menu
// ==============================

export const tmaiInitMenu_prompt = [
	{
		type: "list",
		name: "tmaiInitMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 10,
		choices: [
			new inquirer.Separator("=== Installation and Configuration ==="),
			{
				name: `${emoji.get(
					"package",
				)} 1 - Install/Upgrade TMAI (latest version)`,
				value: "tmai-install",
			},
			{
				name: `${emoji.get(
					"sparkles",
				)} 2 - Initialize TMAI | Update/Fix all rules`,
				value: "tmai-init",
			},
			{
				name: `${emoji.get("wrench")} 3 - Configure AI models`,
				value: "tmai-config",
			},
		],
	},
];

// TODO: in-progress
// ==============================
// Task generation and Decomposition menu
// ==============================

export const tmaiGenDecMenu_prompt = [
	{
		type: "list",
		name: "tmaiGenDecMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Task generation and Decomposition ==="),
			{
				name: `${emoji.get("notebook")} Generate tasks from PRD (AI)`,
				value: "tmai-parse",
			},
			{
				name: `${emoji.get(
					"page_facing_up",
				)} Generate task files (from tasks.json) `,
				value: "tmai-gen",
			},
			{
				name: `${emoji.get("factory")} Decompose all tasks (AI)`,
				value: "tmai-dec",
			},
		],
	},
];

// TODO: validate
// ==============================
// Task management menu
// ==============================

export const tmaiManageMenu_prompt = [
	{
		type: "list",
		name: "tmaiManageMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 10,
		choices: [
			new inquirer.Separator("=== Task management ==="),
			{
				name: `${emoji.get("link")} List and Navigation`,
				value: "tmai-listnav",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add tasks (AI)`,
				value: "tmai-addtasks",
			},
			{
				name: `${emoji.get("pencil2")}  Update tasks (AI)`,
				value: "tmai-updatetasks",
			},
			{
				name: `${emoji.get("wastebasket")}  Delete tasks`,
				value: "tmai-deletetasks",
			},
			{
				name: `${emoji.get("hourglass")} Status tracking`,
				value: "tmai-statustracking",
			},
		],
	},
];

// TODO: done
// ==============================
// Task list and navigation menu
// ==============================

export const tmaiListNavMenu_prompt = [
	{
		type: "list",
		name: "tmaiListNavMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 5,
		choices: [
			new inquirer.Separator("=== List and Navigation ==="),
			{
				name: `${emoji.get("clipboard")} List tasks`,
				value: "tmai-list",
			},
			{
				name: `${emoji.get("mag_right")} Show task details`,
				value: "tmai-show",
			},
			{
				name: `${emoji.get("arrow_forward")}  Show next task`,
				value: "tmai-next",
			},
		],
	},
];

// TODO: in-progress
// ==============================
// Adding tasks menu
// ==============================

export const tmaiAddTasksMenu_prompt = [
	{
		type: "list",
		name: "tmaiAddTasksMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 10,
		choices: [
			new inquirer.Separator("=== Adding tasks ==="),
			{
				name: `${emoji.get("heavy_plus_sign")} Add task with (AI)`,
				value: "tmai-addtaskai",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add task (manually)`,
				value: "tmai-addtaskmanual",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add tasks from PRD (AI)`,
				value: "tmai-addtasksprd",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add subtask (AI)`,
				value: "tmai-addsubtaskai",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add subtask (manually)`,
				value: "tmai-addsubtaskmanual",
			},
		],
	},
];

// TODO: pending
// ==============================
// Modifying tasks menu
// ==============================

export const tmaiUpdateTasksMenu_prompt = [
	{
		type: "list",
		name: "tmaiUpdateTasksMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Updating tasks ==="),
			{
				name: `${emoji.get("pencil2")} Update task`,
				value: "tmai-manage-update-task",
			},
			{
				name: `${emoji.get("arrows_counterclockwise")} Update multiple tasks`,
				value: "tmai-manage-update-multiple",
			},
			{
				name: `${emoji.get("memo")} Update subtask`,
				value: "tmai-manage-update-subtask",
			},
		],
	},
];

// TODO: pending
// ==============================
// Deleting tasks menu
// ==============================

export const tmaiDeleteTasksMenu_prompt = [
	{
		type: "list",
		name: "tmaiDeleteTasksMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 15,
		choices: [
			new inquirer.Separator("=== Deleting tasks ==="),
			{
				name: `${emoji.get("wastebasket")} Delete task`,
				value: "tmai-manage-remove-task",
			},
			{
				name: `${emoji.get("boom")} Delete task permanently`,
				value: "tmai-manage-remove-task-permanent",
			},
			{
				name: `${emoji.get("scissors")} Delete subtask`,
				value: "tmai-manage-remove-subtask",
			},
			{
				name: `${emoji.get("recycle")} Convert subtask to task`,
				value: "tmai-manage-remove-subtask-convert",
			},
			{
				name: `${emoji.get("broom")} Clear subtasks from task`,
				value: "tmai-manage-clear-subtasks",
			},
			{
				name: `${emoji.get("fire")} Clear all subtasks`,
				value: "tmai-manage-clear-subtasks-all",
			},
		],
	},
];

// TODO: pending
// ==============================
// Status tracking menu
// ==============================

export const tmaiStatusTrackingMenu_prompt = [
	{
		type: "list",
		name: "tmaiStatusTrackingMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Status Tracking ==="),
			{
				name: `${emoji.get("hourglass")} Mark as pending`,
				value: "tmai-manage-set-status-pending",
			},
			{
				name: `${emoji.get("hammer_and_wrench")} Mark as in progress`,
				value: "tmai-manage-set-status-in-progress",
			},
			{
				name: `${emoji.get("white_check_mark")} Mark as done`,
				value: "tmai-manage-set-status-done",
			},
			{
				name: `${emoji.get("eye")} Mark for review`,
				value: "tmai-manage-set-status-review",
			},
			{
				name: `${emoji.get("x")} Mark as cancelled`,
				value: "tmai-manage-set-status-cancelled",
			},
			{
				name: `${emoji.get("calendar")} Mark as deferred`,
				value: "tmai-manage-set-status-deferred",
			},
		],
	},
];

// TODO: pending
// ==============================
// Dependencies menu
// ==============================

export const tmaiDepsMenu_prompt = [
	{
		type: "list",
		name: "tmaiDepsMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Dependencies ==="),
			{
				name: `${emoji.get("paperclip")} Add dependency`,
				value: "tmai-deps-add",
			},
			{
				name: `${emoji.get("broken_heart")} Remove dependency`,
				value: "tmai-deps-remove",
			},
			{
				name: `${emoji.get(
					"magnifying_glass_tilted_left",
				)} Validate dependencies`,
				value: "tmai-deps-validate",
			},
			{
				name: `${emoji.get("wrench")} Fix dependencies`,
				value: "tmai-deps-fix",
			},
		],
	},
];

// TODO: pending
// ==============================
// Analysis menu
// ==============================

export const tmaiAnalysisReportDocs_prompt = [
	{
		type: "list",
		name: "tmaiAnalysisReportDocs",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Analysis, Report and Documentation ==="),
			{
				name: `${emoji.get("bar_chart")} Analyze task complexity`,
				value: "tmai-analysis-complexity",
			},
			{
				name: `${emoji.get("page_with_curl")} Show complexity report`,
				value: "tmai-analysis-complexity-report",
			},
			{
				name: `${emoji.get("books")} Sync tasks with README.md`,
				value: "tmai-docs-sync-readme",
			},
		],
	},
];
