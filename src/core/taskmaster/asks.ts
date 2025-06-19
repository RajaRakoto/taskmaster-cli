/* libs */
import inquirer from "inquirer";
import chalk from "chalk";

/* constants */
import { PRD_PATH, TASKS_STATUSES } from "@/constants";

// ===============================

/**
 * @description Asks the user for confirmation to overwrite the existing tasks.json file.
 */
export async function askOverwriteConfirmation() {
	const { overwrite } = await inquirer.prompt({
		type: "confirm",
		name: "overwrite",
		message: chalk.bgYellow(
			"tasks.json already exists. Do you want to overwrite it?",
		),
		default: false,
	});
	return overwrite;
}

/**
 * @description Asks the user for the path to their PRD file.
 */
export async function askPrdPath() {
	const { prdPath } = await inquirer.prompt({
		type: "input",
		name: "prdPath",
		message: "Enter the path to your PRD file:",
		default: PRD_PATH,
		validate: (input) => {
			const regex = /^[\w\s/]+(?:\.(?:txt|md))$/;
			if (!regex.test(input)) {
				return "Please enter a valid PRD file with .txt or .md extension and without special characters, except for /";
			}
			return true;
		},
	});
	return prdPath;
}

/**
 * @description Asks the user for the number of tasks to generate.
 */
export async function askNumTasksToGenerate() {
	const { numTasksToGenerate } = await inquirer.prompt({
		type: "number",
		name: "numTasksToGenerate",
		message: "Enter the number of tasks to generate:",
		default: 10,
		validate: (input) => {
			const num = Number(input);
			if (Number.isNaN(num) || num < 3 || num > 30) {
				return "Please enter a valid number between 3 and 30";
			}
			return true;
		},
	});
	return numTasksToGenerate;
}

/**
 * @description Asks the user for confirmation to allow advanced research for task generation (using AI).
 */
export async function askAdvancedResearchConfirmation() {
	const { allowAdvancedResearch } = await inquirer.prompt({
		type: "confirm",
		name: "allowAdvancedResearch",
		message: "Allow advanced research for task generation ?",
		default: false,
	});
	return allowAdvancedResearch;
}

/**
 * @description Asks the user to enter a tag for the tasks.
 */
export async function askTaskTag() {
	const { tag } = await inquirer.prompt({
		type: "input",
		name: "tag",
		message: "Enter a tag for the tasks:",
		default: "master",
		validate: (input) => {
			const regex = /^[a-z0_9_]+$/;
			if (!regex.test(input)) {
				return "Please enter a valid tag with only lowercase letters, numbers, and underscores (_).";
			}
			return true;
		},
	});
	return tag;
}

/**
 * @description Asks the user for confirmation to decompose all tasks.
 */
export async function askDecompositionConfirmation() {
	const { confirmDecomposition } = await inquirer.prompt({
		type: "confirm",
		name: "confirmDecomposition",
		message: chalk.yellow(
			"Confirm that you want to expand all tasks? This action will decompose every task into smaller subtasks and may increase the total number of tasks to manage.",
		),
		default: false,
	});
	return confirmDecomposition;
}

/**
 * @description Asks the user to select task statuses.
 */
export async function askStatusSelection() {
	const { status: validatedStatus } = await inquirer.prompt([
		{
			type: "checkbox",
			name: "status",
			message: "Select task statuses:",
			choices: TASKS_STATUSES.map((status) => ({
				name: status,
				value: status,
			})),
			validate: (input) => {
				if (!input.length) return "At least one status is required";
				return true;
			},
			filter: (input) => input.join(","),
		},
	]);
	return validatedStatus;
}

/**
 * @description Asks the user for display options when listing tasks.
 */
export async function askDisplayOptions() {
	const { quickly, withSubtasks } = await inquirer.prompt([
		{
			type: "confirm",
			name: "quickly",
			message: "Show tasks quickly ?",
			default: true,
		},
		{
			type: "confirm",
			name: "withSubtasks",
			message: "Show with subtasks ?",
			default: true,
		},
	]);
	return { quickly, withSubtasks };
}

/**
 * @description Asks the user to enter a tag for the tasks.
 */
export async function askTaskIdInput() {
	const { taskId } = await inquirer.prompt({
		type: "input",
		name: "taskId",
		message: "Enter the task ID:",
		validate: (input) => {
			if (!input || !/^(\d+)(\.\d+)*$/.test(input)) {
				return "Invalid task ID. Must be an integer or hierarchical ID (e.g. 1, 2.1, 5.1.1)";
			}
			return true;
		},
	});
	return taskId;
}
