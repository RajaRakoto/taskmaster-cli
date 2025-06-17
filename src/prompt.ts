/* libs */
import inquirer from "inquirer";
import chalk from "chalk";
import * as emoji from "node-emoji";

/* constants */
import { DEV_MODE } from "./constants";

// ==============================
// Main menu
// ==============================

export const mainMenu_prompt = [
	{
		type: "list",
		name: "mainMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 15,
		choices: [
			{
				name: `${emoji.get("rocket")} Initialization and Configuration`,
				value: "tmai-init",
			},
			{
				name: `${emoji.get("page_facing_up")} Task generation`,
				value: "tmai-gen",
			},
			{
				name: `${emoji.get("heavy_check_mark")} Task management`,
				value: "tmai-manage",
			},
			{
				name: `${emoji.get("link")} Dependencies`,
				value: "tmai-deps",
			},
			{
				name: `${emoji.get("bar_chart")} Analysis and Decomposition`,
				value: "tmai-analysis",
			},
			{
				name: `${emoji.get("books")} Documentation`,
				value: "tmai-docs",
			},
			...(DEV_MODE
				? [
						{
							name: `${emoji.get("gear")} Development operations`,
							value: "tmai-dev",
						},
					]
				: []),
		],
	},
];

// ==============================
// Initialization and Configuration menu
// ==============================

export const tmaiInitMenu_prompt = [
	{
		type: "list",
		name: "tmaiInitMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 10,
		choices: [
			new inquirer.Separator("=== Installation and Configuration ==="),
			{
				name: `${emoji.get("package")} 1 - Install/Upgrade TMAI (latest version)`,
				value: "tmai-install",
			},
			{
				name: `${emoji.get("sparkles")} 2 - Initialize TMAI | Update/Fix all rules`,
				value: "tmai-init",
			},
			{
				name: `${emoji.get("wrench")} 3 - Configure AI models`,
				value: "tmai-config",
			},
		],
	},
];

// ==============================
// Task generation menu
// ==============================

export const tmaiGenMenu_prompt = [
	{
		type: "list",
		name: "tmaiGenMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Task Generation ==="),
			{
				name: `${emoji.get("page_facing_up")} Generate tasks from PRD`,
				value: "tmai-gen-parse-prd",
			},
			{
				name: `${emoji.get("file_directory")} Generate task files`,
				value: "tmai-gen-generate",
			},
		],
	},
];

// ==============================
// Task management menu
// ==============================

export const tmaiManageMenu_prompt = [
	{
		type: "list",
		name: "tmaiManageMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 30,
		choices: [
			new inquirer.Separator("=== Display and Navigation ==="),
			{
				name: `${emoji.get("clipboard")} List tasks`,
				value: "tmai-manage-list",
			},
			{
				name: `${emoji.get("mag_right")} Show task details`,
				value: "tmai-manage-show",
			},
			{
				name: `${emoji.get("arrow_forward")} Show next task`,
				value: "tmai-manage-next",
			},

			new inquirer.Separator("=== Adding Tasks ==="),
			{
				name: `${emoji.get("heavy_plus_sign")} Add task with AI`,
				value: "tmai-manage-add-task-ai",
			},
			{
				name: `${emoji.get("link")} Add task with dependencies`,
				value: "tmai-manage-add-task-deps",
			},
			{
				name: `${emoji.get("nesting_dolls")} Add existing task as subtask`,
				value: "tmai-manage-add-subtask-existing",
			},
			{
				name: `${emoji.get("baby")} Add manual subtask`,
				value: "tmai-manage-add-subtask-manual",
			},

			new inquirer.Separator("=== Modifying Tasks ==="),
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

			new inquirer.Separator("=== Deleting Tasks ==="),
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

// ==============================
// Dependencies menu
// ==============================

export const tmaiDepsMenu_prompt = [
	{
		type: "list",
		name: "tmaiDepsMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
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

// ==============================
// Analysis and Decomposition menu
// ==============================

export const tmaiAnalysisMenu_prompt = [
	{
		type: "list",
		name: "tmaiAnalysisMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Analysis and Decomposition ==="),
			{
				name: `${emoji.get("bar_chart")} Analyze task complexity`,
				value: "tmai-analysis-complexity",
			},
			{
				name: `${emoji.get("page_with_curl")} Show complexity report`,
				value: "tmai-analysis-complexity-report",
			},
			{
				name: `${emoji.get("fork_and_knife")} Decompose task`,
				value: "tmai-analysis-expand",
			},
			{
				name: `${emoji.get("factory")} Decompose all tasks`,
				value: "tmai-analysis-expand-all",
			},
		],
	},
];

// ==============================
// Documentation menu
// ==============================

export const tmaiDocsMenu_prompt = [
	{
		type: "list",
		name: "tmaiDocsMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: false,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Documentation ==="),
			{
				name: `${emoji.get("books")} Sync tasks with README.md`,
				value: "tmai-docs-sync-readme",
			},
		],
	},
];
