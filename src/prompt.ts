/* libs */
import inquirer from "inquirer";
import chalk from "chalk";
import * as emoji from "node-emoji";

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
				name: `${emoji.get("page_facing_up")} Generation and Decomposition`,
				value: "tmai-gen",
			},
			{
				name: `${emoji.get("heavy_check_mark")}  Task management (CRUD)`,
				value: "tmai-manage",
			},
			{
				name: `${emoji.get("link")} Dependencies`,
				value: "tmai-deps",
			},
			{
				name: `${emoji.get("bar_chart")} Analysis, Report and Documentation`,
				value: "tmai-analysis",
			},
			new inquirer.Separator("―――――――――――――――――――――――――――――――――――"),
			{
				name: `${emoji.get("floppy_disk")} Backup, Restore and Clear`,
				value: "tmai-bckrestore",
			},
			{
				name: `${emoji.get("door")} Exit`,
				value: "exit",
			},
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
				name: `${emoji.get(
					"wrench",
				)} 3 - Configure AI models (interactive mode)`,
				value: "tmai-interactiveconfig",
			},
			{
				name: `${emoji.get("fast_forward")} 4 - Configure AI models (quickly)`,
				value: "tmai-config",
			},
			{
				name: `${emoji.get(
					"globe_with_meridians",
				)} 5 - Set the response language for AI-generated content in TMAI`,
				value: "tmai-lang",
			},
		],
	},
];

// ==============================
// Generation and Decomposition menu
// ==============================

export const tmaiGenDecMenu_prompt = [
	{
		type: "list",
		name: "tmaiGenDecMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Generation and Decomposition ==="),
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
			new inquirer.Separator("=== Task management (CRUD) ==="),
			{
				name: `${emoji.get("link")} List and Navigation`,
				value: "tmai-listnav",
			},
			{
				name: `${emoji.get("heavy_plus_sign")} Add tasks`,
				value: "tmai-addtasks",
			},
			{
				name: `${emoji.get("pencil2")}  Update tasks`,
				value: "tmai-updatetasks",
			},
			{
				name: `${emoji.get("wastebasket")}  Delete tasks`,
				value: "tmai-deletetasks",
			},
		],
	},
];

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
				name: `${emoji.get("heavy_plus_sign")} Add task (AI)`,
				value: "tmai-addtaskai",
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
				name: `${emoji.get("pencil2")}  Update task (AI)`,
				value: "tmai-updatetaskai",
			},
			{
				name: `${emoji.get("pencil2")}  Update multiple tasks (AI)`,
				value: "tmai-updatemultipletasksai",
			},
			{
				name: `${emoji.get("pencil2")}  Update subtask (AI)`,
				value: "tmai-updatesubtaskai",
			},
			{
				name: `${emoji.get("pencil2")}  Update task or subtask status`,
				value: "tmai-updatestatus",
			},
			{
				name: `${emoji.get("pencil2")}  Convert task to subtask`,
				value: "tmai-converttasktosubtask",
			},
			{
				name: `${emoji.get("pencil2")}  Convert subtask to task`,
				value: "tmai-convertsubtasktotask",
			},
		],
	},
];

// ==============================
// Deleting tasks menu
// ==============================

export const tmaiDeleteTasksMenu_prompt = [
	{
		type: "list",
		name: "tmaiDeleteTasksMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Deleting tasks ==="),
			{
				name: `${emoji.get("wastebasket")} Delete a task (including subtasks)`,
				value: "tmai-deletetask",
			},
			{
				name: `${emoji.get("wastebasket")} Delete a subtask`,
				value: "tmai-deletesubtask",
			},
			{
				name: `${emoji.get("wastebasket")} Delete all subtasks from a task`,
				value: "tmai-deleteallsubtasksfromtask",
			},
			{
				name: `${emoji.get("wastebasket")} Delete all dependencies from a task`,
				value: "tmai-deletealldepssafelyfromtask",
			},
			{
				name: `${emoji.get("wastebasket")} Delete all dependencies from a task (unsafe but fast)`,
				value: "tmai-deletealldepsunsafefromtask",
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
		loop: true,
		pageSize: 7,
		choices: [
			new inquirer.Separator("=== Dependencies ==="),
			{
				name: `${emoji.get("paperclip")} Add dependency`,
				value: "tmai-adddeps",
			},
			{
				name: `${emoji.get("white_check_mark")} Validate dependencies`,
				value: "tmai-validatedeps",
			},
			{
				name: `${emoji.get("wrench")} Fix dependencies`,
				value: "tmai-fixdeps",
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
		name: "tmaiAnalysisReportDocsMenu",
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

// ==============================
// Backup, Restore and Clear menu
// ==============================

export const tmaiBackupRestoreClearClear_prompt = [
	{
		type: "list",
		name: "tmaiBackupRestoreClearMenu",
		message: chalk.bgBlue("Choose an operation"),
		loop: true,
		pageSize: 5,
		choices: [
			new inquirer.Separator("=== Backup, Restore and Clear ==="),
			{
				name: chalk.blue(`${emoji.get("floppy_disk")} Backup tasks`),
				value: "tmai-backup",
			},
			{
				name: chalk.yellow(
					`${emoji.get("arrows_counterclockwise")} Restore tasks`,
				),
				value: "tmai-restore",
			},
			{
				name: chalk.red(
					`${emoji.get("broom")} Clear all dependencies only (for all tasks)`,
				),
				value: "tmai-clearalldeps",
			},
			{
				name: chalk.red(
					`${emoji.get("broom")} Clear all subtasks only (excluding main tasks)`,
				),
				value: "tmai-clearallsubtasks",
			},
			{
				name: chalk.red(
					`${emoji.get("broom")} Clear all current tasks (including subtasks) and all related tmai files`,
				),
				value: "tmai-clearall",
			},
		],
	},
];
