/* libs */
import inquirer from "inquirer";
import chalk from "chalk";
import path from "node:path";
import * as emoji from "node-emoji";
import fs from "node:fs";

/* constants */
import {
	DEFAULT_SUBTASKS_TO_GENERATE,
	DEFAULT_TAG,
	DEFAULT_TASKS_TO_GENERATE,
	MAX_DESCRIPTION_LENGTH,
	MAX_PROMPT_LENGTH,
	MAX_SUBTASKS_TO_GENERATE,
	MAX_TASKS_TO_GENERATE,
	MAX_TITLE_LENGTH,
	MIN_PARENT_ID,
	MIN_SUBTASKS_TO_GENERATE,
	MIN_TASKS_TO_GENERATE,
	PRD_PATH,
	TASKS_STATUSES,
	TASKS_BCK_DEST_PATH,
} from "@/constants";

/* utils */
import { existsAsync } from "@/utils/extras";

// ===============================

/**
 * @description Asks the user for confirmation to overwrite the existing tasks.json file.
 */
export async function askOverwriteConfirmation(): Promise<boolean> {
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
export async function askPrdPath(): Promise<string> {
	const { prdPath } = await inquirer.prompt({
		type: "input",
		name: "prdPath",
		message: "Enter the path to your PRD file:",
		default: PRD_PATH,
		validate: (input) => {
			const regex = /^[\w\s/_-]+(?:\.(?:txt|md))$/;
			if (!regex.test(input)) {
				return "Please enter a valid PRD file with .txt or .md extension and without special characters, except for /, -, and _";
			}
			return true;
		},
	});
	return prdPath;
}

/**
 * @description Asks the user for the number of tasks to generate.
 */
export async function askNumTasksToGenerate(): Promise<number> {
	const { numTasksToGenerate } = await inquirer.prompt({
		type: "number",
		name: "numTasksToGenerate",
		message: "Enter the number of tasks to generate:",
		default: DEFAULT_TASKS_TO_GENERATE,
		validate: (input) => {
			const num = Number(input);
			if (
				Number.isNaN(num) ||
				num < MIN_TASKS_TO_GENERATE ||
				num > MAX_TASKS_TO_GENERATE
			) {
				return `Please enter a valid number between ${MIN_TASKS_TO_GENERATE} and ${MAX_TASKS_TO_GENERATE}`;
			}
			return true;
		},
	});
	return Number(numTasksToGenerate);
}

/**
 * @description Asks the user for confirmation to allow advanced research for task generation (using AI).
 */
export async function askAdvancedResearchConfirmation(): Promise<boolean> {
	const { allowAdvancedResearch } = await inquirer.prompt({
		type: "confirm",
		name: "allowAdvancedResearch",
		message: "Allow advanced research for task generation?",
		default: false,
	});
	return allowAdvancedResearch;
}

/**
 * @description Asks the user to enter a tag for the tasks.
 */
export async function askTaskTag(): Promise<string> {
	const { tag } = await inquirer.prompt({
		type: "input",
		name: "tag",
		message: "Enter a tag for the tasks:",
		default: DEFAULT_TAG,
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
export async function askDecompositionConfirmation(): Promise<boolean> {
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
export async function askStatusSelection(): Promise<string> {
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
export async function askDisplayOptions(): Promise<{
	quickly: boolean;
	withSubtasks: boolean;
}> {
	const { quickly, withSubtasks } = await inquirer.prompt([
		{
			type: "confirm",
			name: "quickly",
			message: "Show tasks quickly?",
			default: true,
		},
		{
			type: "confirm",
			name: "withSubtasks",
			message: "Show with subtasks?",
			default: true,
		},
	]);
	return { quickly, withSubtasks };
}

/**
 * @description Asks the user for the parent task ID
 */
export async function askTaskId(tasksLength: number): Promise<number> {
	const { parentId } = await inquirer.prompt({
		type: "number",
		name: "parentId",
		message: "Enter task ID:",
		validate: (input) => {
			const num = Number(input);
			if (
				Number.isNaN(num) ||
				!Number.isInteger(num) ||
				num < MIN_PARENT_ID ||
				num > tasksLength
			) {
				return `Please enter a valid integer between ${MIN_PARENT_ID} and ${tasksLength}`;
			}
			return true;
		},
	});
	return Number(parentId);
}

/**
 * @description Asks the user to enter subtask ID
 */
export async function askHierarchicalTaskId(): Promise<string> {
	const { taskId } = await inquirer.prompt({
		type: "input",
		name: "taskId",
		message: "Enter the hierarchical task ID:",
		validate: (input) => {
			if (!input || !/^(\d+(\.\d+)*\.\d+)$/.test(input)) {
				return "Invalid subtask ID. Must be a hierarchical ID (e.g: 1.1, 2.1.1)";
			}
			return true;
		},
	});
	return taskId;
}

/**
 * @description Asks the user for the task creation prompt
 */
export async function askTaskPrompt(): Promise<string> {
	const { prompt } = await inquirer.prompt({
		type: "input",
		name: "prompt",
		message: "Enter prompt:",
		validate: (input) => {
			if (!input || input.trim().length > MAX_PROMPT_LENGTH) {
				return `Prompt must be at least ${MAX_PROMPT_LENGTH} characters`;
			}
			return true;
		},
	});
	return prompt;
}

/**
 * @description Asks the user for the number of subtasks to generate
 */
export async function askNumSubtasks(): Promise<number> {
	const { num } = await inquirer.prompt({
		type: "number",
		name: "num",
		message: "Number of subtasks to generate:",
		default: DEFAULT_SUBTASKS_TO_GENERATE,
		validate: (input) => {
			if (
				Number.isNaN(input) ||
				input < MIN_SUBTASKS_TO_GENERATE ||
				input > MAX_SUBTASKS_TO_GENERATE
			) {
				return `Please enter a number between ${MIN_SUBTASKS_TO_GENERATE} and ${MAX_SUBTASKS_TO_GENERATE}`;
			}
			return true;
		},
	});
	return Number(num);
}

/**
 * @description Asks the user for manual subtask parameters
 */
export async function askBackupSlot(): Promise<string> {
	const slots = [1, 2, 3];
	const slotChoices = [];

	for (const slot of slots) {
		const backupPath = path.join(TASKS_BCK_DEST_PATH, `slot_${slot}.zip`);
		const exists = await existsAsync(backupPath);

		let slotInfo = "";
		if (exists) {
			const stats = fs.statSync(backupPath);
			const date = new Date(stats.mtime);
			const formattedDate = date.toLocaleDateString("fr-FR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
			slotInfo = `${emoji.get("floppy_disk")} ${formattedDate}`;
		} else {
			slotInfo = `${emoji.get("open_file_folder")} Empty`;
		}

		slotChoices.push({
			name: `Slot ${slot}: ${slotInfo}`,
			value: slot.toString(),
		});
	}

	const { selectedSlot } = await inquirer.prompt({
		type: "list",
		name: "selectedSlot",
		message: "Choisissez un slot de sauvegarde :",
		choices: slotChoices,
	});

	return selectedSlot;
}

export async function askSubtaskManualParams(): Promise<{
	title: string;
	description: string;
}> {
	return await inquirer.prompt([
		{
			type: "input",
			name: "title",
			message: "Enter subtask title:",
			validate: (input) => {
				if (!input || input.trim().length > MAX_TITLE_LENGTH) {
					return `Title must be at least ${MAX_TITLE_LENGTH} characters`;
				}
				return true;
			},
		},
		{
			type: "input",
			name: "description",
			message: "Enter subtask description:",
			validate: (input) => {
				if (!input || input.trim().length > MAX_DESCRIPTION_LENGTH) {
					return `Description must be at least ${MAX_DESCRIPTION_LENGTH} characters`;
				}
				return true;
			},
		},
	]);
}
