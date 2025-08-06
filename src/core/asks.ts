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
	LANGS,
	MAX_DESCRIPTION_LENGTH,
	MAX_PROMPT_LENGTH,
	MAX_SUBTASKS_TO_GENERATE,
	MAX_TASKS_TO_GENERATE,
	MAX_TITLE_LENGTH,
	MIN_SUBTASKS_TO_GENERATE,
	MIN_TASKS_TO_GENERATE,
	PRD_PATH,
	TASKS_STATUSES,
	TASKS_BCK_DEST_PATH,
	AI_MODELS,
	NOTE_MODELS,
} from "@/constants";

/* utils */
import { existsAsync } from "@/utils/extras";

// ===============================

/**
 * @description Validates a standard task ID
 */
export function isValidTaskId(
	input: string,
	mainIDs: number[],
): { isValid: boolean; errorMessage: string } {
	const num = Number(input);
	if (Number.isNaN(num) || !Number.isInteger(num)) {
		return {
			isValid: false,
			errorMessage: "Please enter a valid integer",
		};
	}
	if (!mainIDs.includes(num)) {
		return {
			isValid: false,
			errorMessage: `Unknown task ID. Available IDs: ${mainIDs.join(", ")}`,
		};
	}
	return { isValid: true, errorMessage: "" };
}

/**
 * @description Validates a hierarchical task ID
 */
export function isValidHierarchicalTaskId(
	input: string,
	subtasksIDs: string[],
): { isValid: boolean; errorMessage: string } {
	if (!/^\d+\.\d+$/.test(input)) {
		return {
			isValid: false,
			errorMessage: `Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
		};
	}

	if (!subtasksIDs.includes(input)) {
		return {
			isValid: false,
			errorMessage: `Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
		};
	}

	return { isValid: true, errorMessage: "" };
}

// ===============================

/**
 * @description Asks the user to enter the number of tasks to generate
 */
export async function askNumTasksToGenerateAsync(): Promise<number> {
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
 * @description Asks the user for confirmation to overwrite the existing tasks.json file.
 */
export async function askOverwriteConfirmationAsync(): Promise<boolean> {
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
export async function askPrdPathAsync(): Promise<string> {
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
 * @description Asks the user for confirmation to allow advanced research for task generation (using AI).
 */
export async function askAdvancedResearchConfirmationAsync(): Promise<boolean> {
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
export async function askTaskTagAsync(): Promise<string> {
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
export async function askDecompositionConfirmationAsync(): Promise<boolean> {
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
export async function askStatusSelectionAsync(): Promise<string> {
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
 * @description Asks the user to select a single task status.
 */
export async function askStatusAsync(): Promise<string> {
	const { status } = await inquirer.prompt({
		type: "list",
		name: "status",
		message: "Select task status:",
		choices: TASKS_STATUSES.map((status) => ({
			name: status,
			value: status,
		})),
	});
	return status;
}

/**
 * @description Asks the user for display options when listing tasks.
 */
export async function askDisplayOptionsAsync(): Promise<{
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
export async function askTaskIdAsync(
	mainIDs: number[],
	customMessage?: string,
): Promise<number> {
	const { parentId } = await inquirer.prompt({
		type: "input",
		name: "parentId",
		message: customMessage || "Enter task ID:",
		validate: (input: string) => {
			const { isValid, errorMessage } = isValidTaskId(input, mainIDs);
			return isValid || errorMessage;
		},
	});
	return Number(parentId);
}

/**
 * @description Asks the user to enter subtask ID
 */
export async function askHierarchicalTaskIdAsync(
	subtasksIDs: string[],
	customMessage?: string,
): Promise<string> {
	const { taskId } = await inquirer.prompt({
		type: "input",
		name: "taskId",
		message: customMessage || "Enter the hierarchical task ID:",
		validate: (input) => {
			const { isValid, errorMessage } = isValidHierarchicalTaskId(
				input,
				subtasksIDs,
			);
			return isValid || errorMessage;
		},
	});
	return taskId;
}

/**
 * @description Asks the user for a task ID that can be an integer or hierarchical.
 */
export async function askHybridTaskIdAsync(
	mainIDs: number[],
	subtasksIDs: string[],
	customMessage?: string,
): Promise<string> {
	const { taskId } = await inquirer.prompt({
		type: "input",
		name: "taskId",
		message: customMessage || "Enter task ID (integer or hierarchical):",
		validate: (input) => {
			const taskValidation = isValidTaskId(input, mainIDs);
			if (taskValidation.isValid) return true;

			const hierarchicalValidation = isValidHierarchicalTaskId(
				input,
				subtasksIDs,
			);
			if (hierarchicalValidation.isValid) return true;

			return `Invalid ID. Valid main IDs: ${mainIDs.join(", ")} | valid subtask IDs: ${subtasksIDs.join(", ")}`;
		},
	});
	return taskId;
}

/**
 * @description Asks the user for multiple task IDs (either tasks or subtasks) and returns them as an array.
 */
export async function askMultipleTaskIdAsync(
	mainIDs: number[],
	subtasksIDs: string[],
	customMessage?: string,
): Promise<string[]> {
	const { idType } = await inquirer.prompt({
		type: "list",
		name: "idType",
		message: "Select the type of task IDs to enter:",
		choices: ["tasks", "subtasks"],
		default: "tasks",
	});

	const { ids } = await inquirer.prompt({
		type: "input",
		name: "ids",
		message: customMessage || `Enter ${idType} IDs (comma-separated):`,
		validate: (input: string) => {
			if (!input) {
				return "At least one ID is required";
			}

			const idList = input.split(",").map((id: string) => id.trim());

			if (idType === "tasks") {
				for (const idStr of idList) {
					const { isValid, errorMessage } = isValidTaskId(idStr, mainIDs);
					if (!isValid) return errorMessage;
				}
			} else {
				for (const idStr of idList) {
					const { isValid, errorMessage } = isValidHierarchicalTaskId(
						idStr,
						subtasksIDs,
					);
					if (!isValid) return errorMessage;
				}
			}

			return true;
		},
	});

	return ids.split(",").map((id: string) => id.trim());
}

/**
 * @description Asks the user for the task creation prompt
 */
export async function askTaskPromptAsync(): Promise<string> {
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
export async function askNumSubtasksAsync(): Promise<number> {
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
export async function askBackupSlotAsync(): Promise<string> {
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
		message: "Choose a backup slot:",
		choices: slotChoices,
	});

	return selectedSlot;
}

/**
 * @description Prompts the user to enter the title and description for a subtask.
 */
export async function askSubtaskManualParamsAsync(): Promise<{
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

/**
 * @description Prompts the user to select a language for TMAI responses
 */
export async function askLangAsync(): Promise<string> {
	const { lang } = await inquirer.prompt({
		type: "list",
		name: "lang",
		message: "Select the language for TMAI responses:",
		choices: LANGS,
	});
	return lang;
}

/**
 * @description Prompts the user to select AI models for main, research, and fallback
 * This list is designed for faster TMAI testing using free or generously quota'd models.
 * For a wider selection, use the standard interactive configuration mode.
 */
export async function askModelsAsync(): Promise<{
	mainModel: string;
	researchModel: string;
	fallbackModel: string;
}> {
	console.log(chalk.blue(NOTE_MODELS));

	const { mainModel, researchModel, fallbackModel } = await inquirer.prompt<{
		mainModel: string;
		researchModel: string;
		fallbackModel: string;
	}>([
		{
			type: "list",
			name: "mainModel",
			message: "Select the main AI model:",
			choices: AI_MODELS,
		},
		{
			type: "list",
			name: "researchModel",
			message: "Select the research AI model:",
			choices: AI_MODELS,
		},
		{
			type: "list",
			name: "fallbackModel",
			message: "Select the fallback AI model:",
			choices: AI_MODELS,
		},
	]);

	return {
		mainModel,
		researchModel,
		fallbackModel,
	};
}

/**
 * @description Asks the user for confirmation to include subtasks
 */
export async function askWithSubtasksAsync(): Promise<boolean> {
	const { withSubtasks } = await inquirer.prompt({
		type: "confirm",
		name: "withSubtasks",
		message: "Include subtasks?",
		default: false,
	});
	return withSubtasks;
}
