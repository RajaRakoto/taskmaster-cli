/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile, rm } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import readline from "node:readline";
import chalk from "chalk";
import fs from "node:fs";
import figures from "figures";
import compressing from "compressing";

/* constants */
import {
	MAX_TITLE_TRUNC_LENGTH,
	STATUS_CONFIG,
	PACKAGE_MANAGERS,
	TASKMASTER_INIT_MSG,
	TASKS_FILE_WARN,
	TASKS_BCK_DEST_PATH,
	TASKS_SRC_PATH,
	TASKS_FILES,
} from "@/constants";

/* extras */
import {
	existsAsync,
	runCommandAsync,
	readJsonFileAsync,
} from "@/utils/extras";

/* types */
import type { T_PackageManager } from "@/@types/index";
import type { I_Tasks, Status, Priority } from "@/@types/tasks";

// ===============================

/**
 * TaskMaster - Core class for managing task-master AI operations
 * Provides methods to install, initialize, configure, manage, and more ...
 * Handles user interactions and system operations related to task-master setup.
 * @class
 */
export class TaskMaster {
	private _mainCommand: string;
	private _tasksFilePath: string;
	private _isTestMode: boolean;

	constructor({
		mainCommand,
		tasksFilePath,
		isTestMode,
	}: {
		mainCommand: string;
		tasksFilePath: string;
		isTestMode: boolean;
	}) {
		this._mainCommand = mainCommand;
		this._tasksFilePath = tasksFilePath;
		this._isTestMode = isTestMode;

		console.info(chalk.bgMagenta(TASKMASTER_INIT_MSG));

		if (!this._isTestMode) {
			if (!fs.existsSync(this._tasksFilePath)) {
				console.warn(chalk.bgYellow(TASKS_FILE_WARN(this._tasksFilePath)));
			} else {
				console.info(
					chalk.bgGreen(`Found tasks.json at "${this._tasksFilePath}"`),
				);
			}
		}
	}

	// ==============================================
	// Getters and Setters
	// ==============================================

	// TODO: done
	/**
	 * @description Retrieves the contents of the tasks.json file
	 */
	public async getTasksContentAsync(): Promise<I_Tasks> {
		const oraOptions = {
			text: `Fetching tasks from ${chalk.bold(this._tasksFilePath)}...`,
			successText: chalk.bgGreen("Fetched tasks successfully!"),
			failText: chalk.bgRed("Failed to retrieve tasks from tasks.json"),
		};

		return oraPromise(
			readJsonFileAsync<I_Tasks>(this._tasksFilePath),
			oraOptions,
		);
	}

	// TODO: done
	/**
	 * @description Extracts all main task IDs and subtask IDs from the tasks data
	 * @param tasks Tasks data to process
	 * @returns Object containing two arrays: mainIDs (numbers) and subtasksIDs (strings in the format "parentId.subtaskId")
	 */
	public async getAllTaskIdsAsync(tasks: I_Tasks): Promise<{
		mainIDs: number[];
		subtasksIDs: string[];
	}> {
		const mainIDs: number[] = [];
		const subtasksIDs: string[] = [];

		for (const task of tasks.master.tasks) {
			mainIDs.push(task.id);
			if (task.subtasks && task.subtasks.length > 0) {
				for (const subtask of task.subtasks) {
					subtasksIDs.push(`${task.id}.${subtask.id}`);
				}
			}
		}

		return { mainIDs, subtasksIDs };
	}

	// TODO: done
	/**
	 * @description Retrieves all dependencies for a given task or subtask.
	 * @param tasks The tasks data structure
	 * @param taskId The task ID (either a simple number as string or hierarchical like "1.2")
	 */
	private async _getAllDependenciesAsync(
		tasks: I_Tasks,
		taskId: string,
	): Promise<number[]> {
		if (!taskId.includes(".")) {
			const idNum = Number.parseInt(taskId, 10);
			const task = tasks.master.tasks.find((t) => t.id === idNum);
			if (!task) {
				throw new Error(`Task not found: ${taskId}`);
			}
			return task.dependencies;
		}

		const parts = taskId.split(".");
		if (parts.length < 2) {
			throw new Error(`Invalid hierarchical task ID: ${taskId}`);
		}
		const parentId = Number.parseInt(parts[0], 10);
		const subtaskIndex = Number.parseInt(parts[1], 10) - 1;
		const parentTask = tasks.master.tasks.find((t) => t.id === parentId);
		if (!parentTask) {
			throw new Error(`Parent task not found for subtask: ${taskId}`);
		}

		if (
			!parentTask.subtasks ||
			subtaskIndex < 0 ||
			subtaskIndex >= parentTask.subtasks.length
		) {
			throw new Error(`Subtask not found: ${taskId}`);
		}

		const subtask = parentTask.subtasks[subtaskIndex];
		return subtask.dependencies;
	}

	// ==============================================
	// Helpers
	// ==============================================

	// TODO: done
	/**
	 * @description Helper method to execute commands with consistent ora handling
	 * @param text Loading text for ora spinner
	 * @param successText Success message
	 * @param failText Failure message
	 * @param command Main command to execute
	 * @param args Command arguments
	 * @note Escapes command arguments to prevent shell injection
	 * Handles both quotes and dollar signs which could be dangerous in shell commands
	 */
	private async _executeCommandAsync(
		text: string,
		successText: string,
		failText: string,
		command: string,
		args: string[] = [],
	): Promise<void> {
		// Escape the arguments to prevent injections
		const escapedArgs = args.map((arg) =>
			arg.replace(/"/g, '\\"').replace(/\$/g, "\\$"),
		);

		const oraOptions = {
			text: text,
			successText: chalk.bgGreen(successText),
			failText: chalk.bgRed(failText),
		};

		await oraPromise(
			runCommandAsync(command, escapedArgs, false, false),
			oraOptions,
		);
	}

	// TODO: done
	/**
	 * @description Fixes the IDs of all tasks and subtasks in tasks.json to be sequential
	 * by reorganizing them incrementally starting from 1.
	 * This method ensures better organization and readability of the task list.
	 */
	public async _fixIdsToSequentialAsync(): Promise<void> {
		const oraOptions = {
			text: "Fixing task IDs...",
			successText: chalk.bgGreen("Task IDs fixed successfully!"),
			failText: chalk.bgRed("Failed to fix task IDs"),
		};

		await oraPromise(async () => {
			// Read the current tasks
			const tasks = await this.getTasksContentAsync();

			// Sort tasks by their current ID to maintain logical order
			tasks.master.tasks.sort((a, b) => a.id - b.id);

			// Fix main task IDs
			const idMap = new Map<number, number>();
			for (const [index, task] of tasks.master.tasks.entries()) {
				const oldId = task.id;
				const newId = index + 1;
				if (oldId !== newId) {
					idMap.set(oldId, newId);
					task.id = newId;
				}
			}

			// Fix subtask IDs and update dependencies
			for (const task of tasks.master.tasks) {
				if (task.subtasks && task.subtasks.length > 0) {
					for (const [index, subtask] of task.subtasks.entries()) {
						subtask.id = index + 1;
					}
				}
			}

			// Write the updated tasks back to the file
			await writeFile(this._tasksFilePath, JSON.stringify(tasks, null, 2));

			// Update the internal tasks file path if needed
			this._tasksFilePath = this._tasksFilePath;
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Fixes the format of the tasks.json file if necessary
	 * by encapsulating the 'tasks' and 'metadata' keys under a 'master' key
	 */
	public async _fixTasksFileFormatAsync(): Promise<void> {
		const oraOptions = {
			text: "Verifying tasks.json file format...",
			successText: chalk.bgGreen("tasks.json format validated successfully!"),
			failText: chalk.bgRed("Failed to validate tasks.json format"),
		};

		await oraPromise(async () => {
			const currentContent = await readJsonFileAsync<Record<string, unknown>>(
				this._tasksFilePath,
			);

			interface MasterStructure {
				tasks?: unknown;
				metadata?: unknown;
			}

			let tasksToSave: unknown[] | null = null;
			let metadataToSave: object | null = null;
			let masterKey: string | null = null;

			if (currentContent.master) {
				const masterData = currentContent.master as MasterStructure;
				if (
					Array.isArray(masterData.tasks) &&
					typeof masterData.metadata === "object"
				) {
					masterKey = "master";
					tasksToSave = masterData.tasks;
					metadataToSave = masterData.metadata;
				}
			}

			if (!masterKey) {
				for (const key of Object.keys(currentContent)) {
					const value = currentContent[key];
					if (typeof value === "object" && !Array.isArray(value)) {
						const data = value as MasterStructure;
						if (
							Array.isArray(data.tasks) &&
							typeof data.metadata === "object"
						) {
							masterKey = key;
							tasksToSave = data.tasks;
							metadataToSave = data.metadata;
							break;
						}
					}
				}
			}

			if (!masterKey) {
				if (
					Array.isArray(currentContent?.tasks) &&
					typeof currentContent?.metadata === "object"
				) {
					tasksToSave = currentContent.tasks;
					metadataToSave = currentContent.metadata;
				}
			}

			if (tasksToSave !== null && metadataToSave !== null) {
				const correctedContent = {
					master: {
						tasks: tasksToSave,
						metadata: metadataToSave,
					},
				};

				await writeFile(
					this._tasksFilePath,
					JSON.stringify(correctedContent, null, 2),
				);
				return;
			}

			throw new Error(
				"Invalid tasks.json format. Could not find valid tasks and metadata to correct the file.",
			);
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Validates conversion rules for task/subtask conversion
	 * @param tasks The tasks data structure
	 * @param taskId ID of the task to convert
	 * @param targetParentId ID of the parent task if applicable
	 * @param mode Type of conversion
	 * @returns Validation result with validity status, error message, and affected task IDs
	 */
	public _validateConversionRules(
		tasks: I_Tasks,
		taskId: string,
		targetParentId?: string,
		mode: "toSubtask" | "toTask" = "toSubtask",
	): { valid: boolean; message?: string; affectedTaskIds?: string[] } {
		const affectedTaskIds: string[] = [];

		// Helper function to check if a task ID is a subtask
		const isSubtask = (id: string): boolean => id.includes(".");

		// Helper function to get parent ID from hierarchical ID
		const getParentId = (id: string): number => {
			if (isSubtask(id)) {
				return Number.parseInt(id.split(".")[0], 10);
			}
			return Number.parseInt(id, 10);
		};

		// Helper function to get task by ID
		const getTask = (id: string) => {
			if (isSubtask(id)) {
				const [parentIdStr, subtaskIdStr] = id.split(".");
				const parentId = Number.parseInt(parentIdStr, 10);
				const subtaskIndex = Number.parseInt(subtaskIdStr, 10) - 1;
				const parentTask = tasks.master.tasks.find((t) => t.id === parentId);
				if (
					!parentTask ||
					!parentTask.subtasks ||
					subtaskIndex < 0 ||
					subtaskIndex >= parentTask.subtasks.length
				) {
					return null;
				}
				return parentTask.subtasks[subtaskIndex];
			}

			const idNum = Number.parseInt(id, 10);
			return tasks.master.tasks.find((t) => t.id === idNum) || null;
		};

		// Helper function to get all dependencies for a task
		const getAllDependencies = (id: string): string[] => {
			const task = getTask(id);
			if (!task) return [];

			return task.dependencies.map((depId) => depId.toString());
		};

		// Check if parent is already a subtask (no nested subtasks allowed)
		if (mode === "toSubtask" && targetParentId) {
			if (isSubtask(targetParentId)) {
				return {
					valid: false,
					message: `Cannot convert task to subtask of another subtask (${targetParentId}). Nested subtasks are not allowed.`,
					affectedTaskIds,
				};
			}
		}

		// Check if task has dependencies
		const taskDeps = getAllDependencies(taskId);
		if (taskDeps.length > 0) {
			affectedTaskIds.push(taskId);
		}

		if (mode === "toSubtask") {
			// Validate task to subtask conversion
			if (!targetParentId) {
				return {
					valid: false,
					message:
						"Target parent ID is required for task to subtask conversion.",
					affectedTaskIds,
				};
			}

			// Check if task depends on its future parent
			if (taskDeps.includes(targetParentId)) {
				return {
					valid: false,
					message: `Task ${taskId} cannot depend on its future parent ${targetParentId}. This would create a circular dependency.`,
					affectedTaskIds,
				};
			}

			// Check if task depends on subtasks of different groups
			for (const depId of taskDeps) {
				if (isSubtask(depId)) {
					const depParentId = getParentId(depId);
					const taskParentId = Number.parseInt(targetParentId, 10);
					if (depParentId !== taskParentId) {
						return {
							valid: false,
							message: `Task ${taskId} cannot depend on subtask ${depId} from different task group. This would create invalid cross-group dependencies.`,
							affectedTaskIds,
						};
					}
				}
			}

			// Check for circular dependencies
			const visited = new Set<string>();
			const checkCircular = (currentId: string, targetId: string): boolean => {
				if (currentId === targetId) return true;
				if (visited.has(currentId)) return false;

				visited.add(currentId);
				const deps = getAllDependencies(currentId);
				for (const dep of deps) {
					if (checkCircular(dep, targetId)) return true;
				}
				visited.delete(currentId);
				return false;
			};

			// Check if converting would create circular dependency
			// A circular dependency would be created if the target parent depends on the task being converted
			if (checkCircular(targetParentId, taskId)) {
				return {
					valid: false,
					message: `Converting task ${taskId} to subtask of ${targetParentId} would create circular dependency.`,
					affectedTaskIds,
				};
			}
		} else {
			// Check if subtask depends on future tasks in order
			if (isSubtask(taskId)) {
				const [parentIdStr, subtaskIdStr] = taskId.split(".");
				const parentId = Number.parseInt(parentIdStr, 10);
				const subtaskId = Number.parseInt(subtaskIdStr, 10);
				const parentTask = tasks.master.tasks.find((t) => t.id === parentId);

				if (parentTask?.subtasks) {
					// Check if any subtask in the same group depends on this subtask
					for (const subtask of parentTask.subtasks) {
						if (subtask.dependencies.includes(subtaskId)) {
							return {
								valid: false,
								message: `Subtask ${subtask.id} depends on subtask ${subtaskId}. Converting ${taskId} to task would leave ${subtask.id} with dangling dependency.`,
								affectedTaskIds,
							};
						}
					}

					// Check if this subtask depends on future subtasks in the same group
					for (const depId of taskDeps) {
						if (isSubtask(depId)) {
							const [depParentIdStr, depSubtaskIdStr] = depId.split(".");
							const depParentId = Number.parseInt(depParentIdStr, 10);
							const depSubtaskId = Number.parseInt(depSubtaskIdStr, 10);

							// If dependency is in same parent task and has higher or equal ID
							if (depParentId === parentId && depSubtaskId >= subtaskId) {
								return {
									valid: false,
									message: `Subtask ${taskId} cannot depend on future subtask ${depId} in logical order. This would create invalid dependency ordering.`,
									affectedTaskIds,
								};
							}
						}
					}
				}
			}
		}

		// If we have dependencies and validation passes, include affected task IDs
		return {
			valid: true,
			affectedTaskIds: affectedTaskIds.length > 0 ? affectedTaskIds : undefined,
		};
	}

	// TODO: done
	private _countdown(seconds: number) {
		return new Promise((resolve) => {
			let remaining = seconds;
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
			process.stdout.write(`Waiting ${remaining}s (press ENTER to skip)`);
			const interval = setInterval(() => {
				remaining--;
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write(`Waiting ${remaining}s (press ENTER to skip)`);
				if (remaining <= 0) {
					clearInterval(interval);
					rl.close();
					resolve(undefined);
				}
			}, 1000);
			rl.on("line", () => {
				clearInterval(interval);
				rl.close();
				resolve(undefined);
			});
		});
	}

	// ==============================================
	// Method for Installation and Configuration
	// ==============================================

	// TODO: done
	/**
	 * @description Installs or updates task-master AI using the chosen package manager
	 */
	public async installAsync(): Promise<void> {
		const packageManagerChoices: T_PackageManager[] = [
			...PACKAGE_MANAGERS,
		] as T_PackageManager[];

		const { packageManagerChoice } = await inquirer.prompt<{
			packageManagerChoice: T_PackageManager;
		}>({
			type: "list",
			name: "packageManagerChoice",
			message: "Choose your package manager for installation:",
			loop: true,
			pageSize: 4,
			choices: packageManagerChoices,
			default: "npm",
		});

		const oraOptions = {
			text: `Installing task-master AI with ${chalk.bold(
				packageManagerChoice,
			)} ...`,
			successText: chalk.bgGreen("Task-master AI installed successfully!"),
			failText: chalk.bgRed(`Failed to install task-master AI with
      ${packageManagerChoice}.`),
		};

		await oraPromise(async () => {
			let command: string;
			let args: string[] = [];

			switch (packageManagerChoice) {
				case "npm":
					command = "npm";
					args = ["install", "-g", "task-master-ai@latest"];
					break;
				case "pnpm":
					command = "pnpm";
					args = ["add", "-g", "task-master-ai@latest"];
					break;
				case "bun":
					command = "bun";
					args = ["add", "-g", "task-master-ai@latest"];
					break;
				default:
					throw new Error("Invalid package manager");
			}

			await runCommandAsync(command, args, false, false);
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Initializes the task-master AI by creating a PRD file
	 * @note This function doesn't use oraPromise as it is not a long-running task
	 * @throws Will throw an error if file operations fail
	 */
	public async initAsync(): Promise<void> {
		const prdFilePath = path.join("docs", "PRD.md");

		if (await existsAsync(prdFilePath)) {
			console.log(
				chalk.yellow(
					`PRD file already exists at ${prdFilePath}, skipping generation.`,
				),
			);
		} else {
			await mkdir("docs", { recursive: true });
			await writeFile(prdFilePath, "# Product Requirements Document\n\n");
			console.log(chalk.bgGreen(`PRD file created at ${prdFilePath}.`));
		}

		await runCommandAsync(this._mainCommand, ["init"], false, false);
		console.log(chalk.bgGreen("Task-master project initialized successfully!"));
	}

	// TODO: done
	/**
	 * @description Configures AI models for task-master by running the interactive setup
	 */
	public async interactiveConfigModelAsync(): Promise<void> {
		await this._executeCommandAsync(
			"Configuring AI models...",
			"AI models configured successfully!",
			"AI model configuration failed",
			this._mainCommand,
			["models", "--setup"],
		);
	}

	// TODO: done
	/**
	 * @description Configures AI models with specified models
	 * @param mainModel The main AI model to use
	 * @param researchModel The research AI model to use
	 * @param fallbackModel The fallback AI model to use
	 * @param provider Optional provider for the models
	 */
	public async configModelsAsync(
		mainModel: string,
		researchModel: string,
		fallbackModel: string,
		provider?: string,
	): Promise<void> {
		const oraOptions = {
			text: "Configuring AI models...",
			successText: chalk.bgGreen("AI models configured successfully!"),
			failText: chalk.bgRed("AI model configuration failed"),
		};

		await oraPromise(async () => {
			const mainArgs = provider
				? ["models", "--set-main", mainModel, `--${provider}`]
				: ["models", "--set-main", mainModel];

			const researchArgs = provider
				? ["models", "--set-research", researchModel, `--${provider}`]
				: ["models", "--set-research", researchModel];

			const fallbackArgs = provider
				? ["models", "--set-fallback", fallbackModel, `--${provider}`]
				: ["models", "--set-fallback", fallbackModel];

			await runCommandAsync(this._mainCommand, mainArgs, false, false);
			await runCommandAsync(this._mainCommand, researchArgs, false, false);
			await runCommandAsync(this._mainCommand, fallbackArgs, false, false);
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Sets the response language for TMAI
	 * @param lang Language to set for TMAI responses
	 */
	public async setLangAsync(lang: string): Promise<void> {
		console.log(
			chalk.yellow(
				"Note: Make sure the LLM used by TMAI supports the language you choose!",
			),
		);
		await this._executeCommandAsync(
			`Setting TMAI response language to ${chalk.bold(lang)}...`,
			`Language set to ${lang} successfully!`,
			`Failed to set language to ${lang}`,
			this._mainCommand,
			["lang", `--response=${lang}`],
		);
	}

	// ==============================================
	// Method for Generation and Decomposition
	// ==============================================

	// TODO: done
	/**
	 * @description Parses a PRD file to generate tasks
	 * @param inputFilePath Path to the PRD file
	 * @param numTasksToGenerate Number of tasks to generate (default: 10)
	 * @param allowAdvancedResearch Allow advanced research for task generation
	 * @param appendToExistingTasks Whether to append to existing tasks
	 * @param tag Context tag
	 */
	public async parseAsync(
		inputFilePath: string,
		numTasksToGenerate: number,
		allowAdvancedResearch: boolean,
		appendToExistingTasks: boolean,
		tag: string,
	): Promise<void> {
		await this._executeCommandAsync(
			`Parsing PRD file: ${chalk.bold(inputFilePath)}...`,
			"PRD parsed successfully!",
			"Failed to parse PRD file",
			this._mainCommand,
			[
				"parse-prd",
				`--input=${inputFilePath}`,
				`--num-tasks=${numTasksToGenerate}`,
				allowAdvancedResearch ? "--research" : "",
				appendToExistingTasks ? "--append" : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Generates task files from parsed data
	 */
	public async genAsync(): Promise<void> {
		const tasksJsonPath = path.join(".taskmaster", "tasks", "tasks.json");

		if (!(await existsAsync(tasksJsonPath))) {
			console.log(
				chalk.yellow(
					`"${tasksJsonPath}" required file not found, aborting generation.`,
				),
			);
		} else {
			await this._executeCommandAsync(
				"Generating task files...",
				"Task files generated successfully!",
				"Task file generation failed",
				this._mainCommand,
				["generate"],
			);
		}
	}

	// TODO: done
	/**
	 * @description Decomposes all tasks using AI
	 * @param tag Context tag
	 */
	public async decomposeAsync(tag: string): Promise<void> {
		await this._executeCommandAsync(
			"Decomposing tasks ...",
			"Tasks decomposed successfully!",
			"Failed to decompose tasks",
			this._mainCommand,
			["expand", "--all", tag ? `--tag=${tag}` : ""].filter(Boolean),
		);
	}

	// ==============================================
	// Method for Task Listing and Viewing
	// ==============================================

	// TODO: done
	/**
	 * @description Lists tasks in a visually formatted tree structure
	 * @param tasks Tasks data to render
	 * @param status Filter tasks by status (comma-separated values)
	 * @param withSubtasks Whether to include subtasks in the output
	 */
	public async listQuickAsync(
		tasks: I_Tasks,
		status: string,
		withSubtasks = true,
	): Promise<string> {
		// Helper to truncate text with ellipsis at MAX_TITLE_LENGTH characters
		const truncate = (text: string, maxLength: number): string => {
			if (text.length <= maxLength) return text;
			return `${text.slice(0, maxLength - 1)}…`;
		};

		// Format status with icons and colors for all statuses
		const formatStatus = (status: Status): string => {
			const config = STATUS_CONFIG[status] || {
				icon: figures.circle,
				color: chalk.gray,
			};
			const colorFn =
				typeof config.color === "function" ? config.color : chalk.gray;
			return colorFn(`${config.icon} ${status}`);
		};

		// Format priority with colors
		const formatPriority = (priority: Priority): string => {
			const colorMap = {
				high: chalk.red.bold,
				medium: chalk.yellow.bold,
				low: chalk.cyan.bold,
			};

			const colorFn = colorMap[priority] || chalk.white.bold;
			return colorFn(priority);
		};

		// Parse status filter
		const statusFilters = status
			? status.split(",").map((s) => s.trim() as Status)
			: null;

		// Build task tree output manually
		let output = `\n${chalk.bold.underline("TASKS LIST")}\n`;
		let hasTasks = false;

		for (const task of tasks.master.tasks) {
			let hasMatchingSubtasks = false;
			const matchingSubtasks = [];

			// Check subtasks first to see if any match the filter
			if (withSubtasks && task.subtasks && task.subtasks.length > 0) {
				for (let i = 0; i < task.subtasks.length; i++) {
					const subtask = task.subtasks[i];
					if (!statusFilters || statusFilters.includes(subtask.status)) {
						matchingSubtasks.push({ index: i, subtask });
						hasMatchingSubtasks = true;
					}
				}
			}

			// Show parent if it matches filter OR has matching subtasks
			const showParent =
				!statusFilters ||
				statusFilters.includes(task.status) ||
				hasMatchingSubtasks;

			if (showParent) {
				hasTasks = true;
				const title = truncate(task.title, MAX_TITLE_TRUNC_LENGTH);
				const dependencies =
					task.dependencies.length > 0
						? `deps: ${chalk.cyan(task.dependencies.join(","))}`
						: `deps: ${chalk.gray("none")}`;
				output +=
					`${chalk.bgGreen.bold(`#${task.id}`)} ${chalk.magenta(title)} ` +
					`[status: ${formatStatus(task.status)}] - ` +
					`[priority: ${formatPriority(task.priority)}] - ` +
					`[${dependencies}]\n`;

				// Only show matching subtasks
				if (withSubtasks && matchingSubtasks.length > 0) {
					for (const { subtask } of matchingSubtasks) {
						const subTitle = truncate(subtask.title, MAX_TITLE_TRUNC_LENGTH);
						const hierarchicalId = `${task.id}.${subtask.id}`;
						const subDependencies =
							subtask.dependencies.length > 0
								? `deps: ${chalk.cyan(subtask.dependencies.join(","))}`
								: `deps: ${chalk.gray("none")}`;
						output +=
							`  ${chalk.dim("↳")} ${chalk.bold(`#${hierarchicalId}`)} ` +
							`${chalk.magenta(subTitle)} [status: ${formatStatus(
								subtask.status,
							)}] - [${subDependencies}]\n`;
					}
				}
			}
		}

		if (!hasTasks) {
			output += chalk.yellow("No tasks to display.\n");
		}

		return output;
	}

	// TODO: done
	/**
	 * @description Lists tasks with optional status filtering and subtask display
	 * @param quickly List tasks quickly
	 * @param status Filter tasks by status (todo, in-progress, done, blocked, pending)
	 * @param withSubtasks Whether to include subtasks in the output
	 */
	public async listAsync(
		tasks: I_Tasks,
		status: string,
		quickly: boolean,
		withSubtasks: boolean,
	): Promise<void> {
		const args = ["list"];
		if (status) args.push(`--status=${status}`);
		if (withSubtasks) args.push("--with-subtasks");

		if (quickly) {
			console.log(await this.listQuickAsync(tasks, status, withSubtasks));
		} else {
			await this._executeCommandAsync(
				"Listing tasks...",
				"Tasks listed successfully!",
				"Failed to list tasks",
				this._mainCommand,
				args,
			);
		}
	}

	// TODO: done
	/**
	 * @description Shows details of a specific task by ID
	 * @param id Task ID (integer or hierarchical ID like 1.1, 2.3, etc.)
	 */
	public async showAsync(id: string): Promise<void> {
		await this._executeCommandAsync(
			`Fetching details for task ${chalk.bold(id)}...`,
			"Task details retrieved successfully!",
			"Failed to retrieve task details",
			this._mainCommand,
			["show", id],
		);
	}

	// TODO: done
	/**
	 * @description Shows the next available task to work on
	 */
	public async nextAsync(): Promise<void> {
		await this._executeCommandAsync(
			"Finding next available task...",
			"Next task retrieved successfully!",
			"Failed to determine next task",
			this._mainCommand,
			["next"],
		);
	}

	// ==============================================
	// Method for Task Addition
	// ==============================================

	// TODO: done
	/**
	 * @description Adds a new task using AI
	 * @param prompt Description of the task to create
	 * @param allowAdvancedResearch Use research capabilities
	 * @param tag Context tag
	 */
	public async addTaskByAIAsync(
		prompt: string,
		allowAdvancedResearch: boolean,
		tag: string,
	): Promise<void> {
		await this._executeCommandAsync(
			`Adding AI-generated task: "${chalk.bold(prompt)}"...`,
			"Task added successfully!",
			"Failed to add AI-generated task",
			this._mainCommand,
			[
				"add-task",
				`--prompt=${prompt}`,
				allowAdvancedResearch ? "--research" : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Adds subtasks using AI
	 * @param parentId Parent task ID
	 * @param numTasksToGenerate Number of subtasks to generate
	 * @param allowAdvancedResearch Use research capabilities
	 */
	public async addSubtasksByAIAsync(
		parentId: number,
		numTasksToGenerate: number,
		allowAdvancedResearch: boolean,
	): Promise<void> {
		await this._executeCommandAsync(
			`Adding AI-generated subtasks to task ${chalk.bold(parentId)}...`,
			"Subtasks added successfully!",
			"Failed to add AI-generated subtasks",
			this._mainCommand,
			[
				"expand",
				`--id=${parentId}`,
				`--num=${numTasksToGenerate}`,
				allowAdvancedResearch ? "--research" : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Adds a subtask manually
	 * @param parentId Parent task ID
	 * @param title Subtask title
	 * @param description Subtask description
	 */
	public async addSubtaskManuallyAsync(
		parentId: number,
		title: string,
		description: string,
	): Promise<void> {
		await this._executeCommandAsync(
			`Adding manual subtask to task ${chalk.bold(parentId)}...`,
			"Subtask added successfully!",
			"Failed to add manual subtask",
			this._mainCommand,
			[
				"add-subtask",
				`--parent=${parentId}`,
				`--title=${title}`,
				`--description=${description}`,
			].filter(Boolean),
		);
	}

	// ==============================================
	// Updating Methods
	// ==============================================

	// TODO: done
	/**
	 * @description Modifies a task using AI
	 * @param id ID of the task to modify
	 * @param prompt Modification prompt
	 * @param allowAdvancedResearch Use advanced research
	 * @param tag Context tag
	 * @param tasks Current tasks data to check and potentially update status
	 */
	public async updateTaskByAIAsync(
		id: number,
		prompt: string,
		allowAdvancedResearch: boolean,
		tag: string,
		tasks: I_Tasks,
	): Promise<void> {
		const task = tasks.master.tasks.find((t) => t.id === id);
		if (task && task.status !== "pending" && task.status !== "in-progress") {
			await this.updateTaskStatusAsync([id.toString()], "pending", tag);
		}

		await this._executeCommandAsync(
			`Modifying task ${id} with AI...`,
			`Task ${id} modified successfully!`,
			`Failed to modify task ${id}`,
			this._mainCommand,
			[
				"update-task",
				`--id=${id}`,
				`--prompt=${prompt}`,
				allowAdvancedResearch ? "--research" : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Updates multiple tasks using AI from a starting ID
	 * @param startingId Starting ID for the update
	 * @param prompt Global modification prompt
	 * @param allowAdvancedResearch Use advanced research
	 * @param tag Context tag
	 * @param tasks Current tasks data to check and potentially update status
	 */
	public async updateMultipleTasksByAIAsync(
		startingId: number,
		prompt: string,
		allowAdvancedResearch: boolean,
		tag: string,
		tasks: I_Tasks,
	): Promise<void> {
		const task = tasks.master.tasks.find((t) => t.id === startingId);
		if (task && task.status !== "pending" && task.status !== "in-progress") {
			await this.updateTaskStatusAsync([startingId.toString()], "pending", tag);
		}

		await this._executeCommandAsync(
			`Updating tasks from ${startingId} with AI...`,
			"Tasks updated successfully!",
			"Failed to update tasks",
			this._mainCommand,
			[
				"update",
				`--from=${startingId}`,
				`--prompt=${prompt}`,
				allowAdvancedResearch ? "--research" : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Modifies a subtask using AI
	 * @param hierarchicalId Hierarchical ID of the subtask
	 * @param prompt Modification prompt
	 * @param allowAdvancedResearch Use advanced research
	 * @param tag Context tag
	 * @param tasks Current tasks data to check and potentially update status
	 */
	public async updateSubtaskByAIAsync(
		hierarchicalId: string,
		prompt: string,
		allowAdvancedResearch: boolean,
		tag: string,
		tasks: I_Tasks,
	): Promise<void> {
		const [parentIdStr, subtaskIndexStr] = hierarchicalId.split(".");
		const parentId = Number.parseInt(parentIdStr, 10);
		const subtaskIndex = Number.parseInt(subtaskIndexStr, 10) - 1;
		const parentTask = tasks.master.tasks.find((t) => t.id === parentId);
		const subtask = parentTask?.subtasks?.[subtaskIndex];
		if (subtask?.status !== "pending" && subtask?.status !== "in-progress") {
			await this.updateTaskStatusAsync([hierarchicalId], "pending", tag);
		}

		await this._executeCommandAsync(
			`Modifying subtask ${hierarchicalId} with AI...`,
			`Subtask ${hierarchicalId} modified successfully!`,
			`Failed to modify subtask ${hierarchicalId}`,
			this._mainCommand,
			[
				"update-subtask",
				`--id=${hierarchicalId}`,
				`--prompt=${prompt}`,
				allowAdvancedResearch ? "--research" : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: done
	/**
	 * @description Updates the status of one or more tasks
	 * @param ids Array of task IDs (can be main tasks or hierarchical subtask IDs)
	 * @param status The new status to set for the tasks
	 * @param tag Context tag
	 */
	public async updateTaskStatusAsync(
		ids: string[],
		status: string,
		tag: string,
	): Promise<void> {
		const formatedIds = ids.length > 1 ? ids.join(",") : ids[0];
		await this._executeCommandAsync(
			`Updating status of task(s) ${formatedIds} to ${status}...`,
			`Status of task(s) ${formatedIds} updated successfully!`,
			`Failed to update status of task(s) ${formatedIds}`,
			this._mainCommand,
			[
				"set-status",
				`--id=${formatedIds}`,
				`--status=${status}`,
				`--tag=${tag}`,
			],
		);
	}

	// TODO: done
	/**
	 * @description Converts an existing task to a subtask
	 * @param subtaskId ID of the task to convert into a subtask
	 * @param parentId ID of the task to which the converted task should be added as a subtask
	 */
	public async convertTaskToSubtaskAsync(
		subtaskId: number,
		parentId: number,
	): Promise<void> {
		const { TASK_TO_SUBTASK_RULES } = await import("@/constants");

		console.log(chalk.bold.blue("\nTask to Subtask Conversion Rules:"));
		TASK_TO_SUBTASK_RULES.forEach((rule, index) => {
			console.log(chalk.yellow(`  ${index + 1}. ${rule.rule}`));
			console.log(chalk.gray(`     Example: ${rule.example}`));
		});

		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message:
				"Have you read and understood the rules above? Do you confirm the conversion?",
			default: false,
		});

		if (!confirm) {
			console.log(chalk.yellow("Conversion cancelled!"));
			return;
		}

		const tasks = await this.getTasksContentAsync();
		const validation = this._validateConversionRules(
			tasks,
			subtaskId.toString(),
			parentId.toString(),
			"toSubtask",
		);

		if (!validation.valid) {
			console.error(
				chalk.red(`Conversion validation failed: ${validation.message}`),
			);
			console.log(
				chalk.yellow(
					"You can force conversion by manually removing dependencies, but this is not recommended unless absolutely necessary. Consider if the conversion is truly important for your workflow.",
				),
			);
			await this._countdown(20);
			return;
		}

		await this._executeCommandAsync(
			`Converting task ${subtaskId} to subtask of ${parentId}...`,
			`Task ${subtaskId} converted to subtask successfully!`,
			`Failed to convert task ${subtaskId} to subtask`,
			this._mainCommand,
			["add-subtask", `--parent=${parentId}`, `--task-id=${subtaskId}`],
		);
	}

	// TODO: done
	/**
	 * @description Converts an existing subtask to a task
	 * @param hierarchicalId Hierarchical ID of the subtask to convert to a task
	 */
	public async convertSubtaskToTaskAsync(
		hierarchicalId: string,
	): Promise<void> {
		const { SUBTASK_TO_TASK_RULES } = await import("@/constants");

		console.log(chalk.bold.blue("\nSubtask to Task Conversion Rules:"));
		SUBTASK_TO_TASK_RULES.forEach((rule, index) => {
			console.log(chalk.yellow(`  ${index + 1}. ${rule.rule}`));
			console.log(chalk.gray(`     Example: ${rule.example}`));
		});

		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message:
				"Have you read and understood the rules above? Do you confirm the conversion?",
			default: false,
		});

		if (!confirm) {
			console.log(chalk.yellow("Conversion cancelled!"));
			return;
		}

		const tasks = await this.getTasksContentAsync();
		const validation = this._validateConversionRules(
			tasks,
			hierarchicalId,
			undefined,
			"toTask",
		);

		if (!validation.valid) {
			console.error(
				chalk.red(`Conversion validation failed: ${validation.message}`),
			);
			console.log(
				chalk.yellow(
					"You can force conversion by manually removing dependencies, but this is not recommended unless absolutely necessary. Consider if the conversion is truly important for your workflow.",
				),
			);
			await this._countdown(20);
			return;
		}

		await this._executeCommandAsync(
			`Converting subtask ${hierarchicalId} to task...`,
			`Subtask ${hierarchicalId} converted to task successfully!`,
			`Failed to convert subtask ${hierarchicalId} to task`,
			this._mainCommand,
			["remove-subtask", `--id=${hierarchicalId}`, "--convert"],
		);
	}

	// ==============================================
	// Deleting Methods
	// ==============================================

	// TODO: done
	/**
	 * @description Delete a task by ID (including subtasks)
	 * @param id The ID of the task to remove
	 * @param tag Context tag
	 */
	public async deleteTaskAsync(id: number, tag: string): Promise<void> {
		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: chalk.red(`Are you sure you want to delete task ${id}?`),
			default: false,
		});

		if (confirm) {
			await this._executeCommandAsync(
				`Deleting task ${id}...`,
				`Task ${id} deleted successfully!`,
				`Failed to delete task ${id}`,
				this._mainCommand,
				["remove-task", `--id=${id}`, `--tag=${tag}`, "-y"],
			);
		}
	}

	// TODO: done
	/**
	 * @description Delete a specific subtask
	 * @param hierarchicalId The hierarchical ID of the subtask
	 * @param tag Context tag
	 */
	public async deleteSubtaskAsync(
		hierarchicalId: string,
		tag: string,
	): Promise<void> {
		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: chalk.red(
				`Are you sure you want to delete subtask ${hierarchicalId}?`,
			),
			default: false,
		});

		if (confirm) {
			await this._executeCommandAsync(
				`Deleting subtask ${hierarchicalId}...`,
				`Subtask ${hierarchicalId} deleted successfully!`,
				`Failed to delete subtask ${hierarchicalId}`,
				this._mainCommand,
				["remove-subtask", `--id=${hierarchicalId}`, `--tag=${tag}`],
			);
		}
	}

	// TODO: done
	/**
	 * @description Deletes all subtasks from a specific task
	 * @param id The ID of the task to clear subtasks from
	 * @param tag Context tag
	 */
	public async deleteAllSubtasksFromTaskAsync(
		id: number,
		tag: string,
	): Promise<void> {
		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: chalk.red(
				`Are you sure you want to delete all subtasks from task ${id}?`,
			),
			default: false,
		});

		if (confirm) {
			await this._executeCommandAsync(
				`Deleting all subtasks from task ${id}...`,
				`All subtasks deleted from task ${id} successfully!`,
				`Failed to delete subtasks from task ${id}`,
				this._mainCommand,
				["clear-subtasks", `--id=${id}`, `--tag=${tag}`],
			);
		}
	}

	// TODO: done
	/**
	 * @description Clears all dependencies for the specified task or subtask.
	 * @param taskId The task ID or hierarchical ID of the subtask
	 */
	public async deleteAllDepsSafelyFromTaskAsync(taskId: string): Promise<void> {
		const tasks = await this.getTasksContentAsync();
		const dependencyIds = await this._getAllDependenciesAsync(tasks, taskId);

		if (dependencyIds.length === 0) {
			console.log(chalk.yellow(`No dependencies found for task ${taskId}.`));
			return;
		}

		const isSubtask = taskId.includes(".");

		for (const dependencyId of dependencyIds) {
			const dependsOnId = isSubtask
				? dependencyId.toString()
				: dependencyId.toString();

			await this._executeCommandAsync(
				`Removing dependency ${dependsOnId} from task ${taskId}...`,
				`Dependency ${dependsOnId} removed successfully from task ${taskId}!`,
				`Failed to remove dependency ${dependsOnId} from task ${taskId}`,
				this._mainCommand,
				["remove-dependency", `--id=${taskId}`, `--depends-on=${dependsOnId}`],
			);
		}
	}

	// TODO: done
	/**
	 * @description Deletes all dependencies for the specified task or subtask without using external commands.
	 * This is a faster but less safe method that directly modifies the tasks.json file.
	 * @param taskId The task ID or hierarchical ID of the subtask
	 */
	public async deleteAllDepsUnsafeFromTaskAsync(taskId: string): Promise<void> {
		const oraOptions = {
			text: `Clearing dependencies from task ${taskId}...`,
			successText: chalk.bgGreen(
				`Dependencies cleared from task ${taskId} successfully!`,
			),
			failText: chalk.bgRed(`Failed to clear dependencies from task ${taskId}`),
		};

		await oraPromise(async () => {
			const tasks = await this.getTasksContentAsync();
			if (!taskId.includes(".")) {
				// It's a main task
				const idNum = Number.parseInt(taskId, 10);
				const task = tasks.master.tasks.find((t) => t.id === idNum);
				if (!task) {
					throw new Error(`Task not found: ${taskId}`);
				}
				task.dependencies = [];
			} else {
				// It's a subtask
				const parts = taskId.split(".");
				const parentId = Number.parseInt(parts[0], 10);
				const subtaskIndex = Number.parseInt(parts[1], 10) - 1;
				const parentTask = tasks.master.tasks.find((t) => t.id === parentId);
				if (!parentTask) {
					throw new Error(`Parent task not found for subtask: ${taskId}`);
				}

				if (
					!parentTask.subtasks ||
					subtaskIndex < 0 ||
					subtaskIndex >= parentTask.subtasks.length
				) {
					throw new Error(`Subtask not found: ${taskId}`);
				}

				const subtask = parentTask.subtasks[subtaskIndex];
				subtask.dependencies = [];
			}

			await writeFile(this._tasksFilePath, JSON.stringify(tasks, null, 2));
		}, oraOptions);
	}

	// ==============================================
	// Dependencies Methods
	// ==============================================

	// TODO: in-progress
	/**
	 * @description Adds a dependency to a task
	 * @param taskId ID of the task to modify
	 * @param dependencyIds IDs of the dependencies to add
	 */
	public async addDependencyAsync(
		taskId: string,
		dependencyIds: string[],
	): Promise<void> {
		const formatedDepsIds =
			dependencyIds.length > 1 ? dependencyIds.join(",") : dependencyIds[0];
		await this._executeCommandAsync(
			`Adding dependency ${formatedDepsIds} to task ${taskId}...`,
			`Dependency ${formatedDepsIds} added successfully to task ${taskId}!`,
			`Failed to add dependency ${formatedDepsIds} to task ${taskId}`,
			this._mainCommand,
			["add-dependency", `--id=${taskId}`, `--depends-on=${formatedDepsIds}`],
		);
	}

	// TODO: done
	/**
	 * @description Validates task dependencies
	 */
	public async validateDependenciesAsync(): Promise<void> {
		await this._executeCommandAsync(
			"Validating dependencies...",
			"Dependencies validated successfully!",
			"Failed to validate dependencies",
			this._mainCommand,
			["validate-dependencies"],
		);
	}

	// TODO: done
	/**
	 * @description Automatically fixes dependency issues
	 */
	public async fixDependenciesAsync(): Promise<void> {
		await this._executeCommandAsync(
			"Fixing dependencies...",
			"Dependencies fixed successfully!",
			"Failed to fix dependencies",
			this._mainCommand,
			["fix-dependencies"],
		);
	}

	// ==============================================
	// Backup, Restore and Clear Methods
	// ==============================================

	// TODO: done
	/**
	 * @description Creates a backup of the .taskmaster directory
	 * @param slot Slot number (1-3) for the backup
	 */
	public async backupAsync(slot: string): Promise<void> {
		const backupPath = path.join(TASKS_BCK_DEST_PATH, `slot_${slot}.zip`);
		const backupDir = path.dirname(backupPath);

		if (!fs.existsSync(backupDir)) {
			await mkdir(backupDir, { recursive: true });
		}

		// Vérifier si le répertoire source existe
		if (!fs.existsSync(TASKS_SRC_PATH)) {
			console.warn(
				chalk.yellow(
					`Source directory ${TASKS_SRC_PATH} does not exist. Skipping backup.`,
				),
			);
			return;
		}

		const oraOptions = {
			text: `Creating backup in slot ${slot}...`,
			successText: chalk.bgGreen(
				`Backup created successfully in slot ${slot}!`,
			),
			failText: chalk.bgRed(`Failed to create backup in slot ${slot}`),
		};

		await oraPromise(async () => {
			await compressing.zip.compressDir(TASKS_SRC_PATH, backupPath);
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Restores a backup from the specified slot
	 * @param slot Slot number (1-3) to restore from
	 */
	public async restoreAsync(slot: string): Promise<void> {
		const backupPath = path.join(TASKS_BCK_DEST_PATH, `slot_${slot}.zip`);

		if (!fs.existsSync(backupPath)) {
			console.warn(
				chalk.yellow(`No backup found in slot ${slot}. Skipping restore.`),
			);
			return;
		}

		const oraOptions = {
			text: `Restoring backup from slot ${slot}...`,
			successText: chalk.bgGreen(
				`Backup restored successfully from slot ${slot}!`,
			),
			failText: chalk.bgRed(`Failed to restore backup from slot ${slot}`),
		};

		await oraPromise(async () => {
			if (fs.existsSync(TASKS_SRC_PATH)) {
				await rm(TASKS_SRC_PATH, { recursive: true, force: true });
			}

			const parentDir = path.dirname(TASKS_SRC_PATH);
			if (!fs.existsSync(parentDir)) {
				await mkdir(parentDir, { recursive: true });
			}

			await compressing.zip.uncompress(backupPath, parentDir);
		}, oraOptions);
	}

	// TODO: done
	/**
	 * @description Clears all subtasks from all tasks
	 */
	public async clearAllSubtasksAsync(): Promise<void> {
		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: chalk.red("Clear all subtasks from all tasks? ..."),
			default: false,
		});

		if (confirm) {
			await this._executeCommandAsync(
				"Clearing all subtasks...",
				"All subtasks cleared successfully!",
				"Failed to clear all subtasks",
				this._mainCommand,
				["clear-subtasks", "--all"],
			);
		}
	}

	// TODO: done
	/**
	 * @description Clears all task-related files and directories
	 */
	public async clearAllTasksAsync(): Promise<void> {
		for (const filePath of TASKS_FILES) {
			if (!fs.existsSync(filePath)) continue;

			const { confirm } = await inquirer.prompt({
				type: "confirm",
				name: "confirm",
				message: chalk.red(`Delete ${filePath}?`),
				default: false,
			});

			if (confirm) {
				const oraOptions = {
					text: `Deleting ${filePath}...`,
					successText: chalk.bgGreen(`${filePath} deleted successfully!`),
					failText: chalk.bgRed(`Failed to delete ${filePath}`),
				};

				await oraPromise(async () => {
					await rm(filePath, { recursive: true, force: true });
				}, oraOptions);
			}
		}

		const allFilesCleared = TASKS_FILES.every(
			(filePath) => !fs.existsSync(filePath),
		);

		if (allFilesCleared)
			console.log(chalk.green("All task-related files are cleared!"));
	}

	// TODO: done
	/**
	 * @description Clears all dependencies from all tasks and subtasks
	 */
	public async clearAllDepsAsync(): Promise<void> {
		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: chalk.red("Clear all dependencies from all tasks and subtasks?"),
			default: false,
		});

		if (confirm) {
			const oraOptions = {
				text: "Clearing all dependencies...",
				successText: chalk.bgGreen("All dependencies cleared successfully!"),
				failText: chalk.bgRed("Failed to clear all dependencies"),
			};

			await oraPromise(async () => {
				const tasks = await this.getTasksContentAsync();

				for (const task of tasks.master.tasks) {
					task.dependencies = [];
					if (task.subtasks && task.subtasks.length > 0) {
						for (const subtask of task.subtasks) {
							subtask.dependencies = [];
						}
					}
				}

				await writeFile(this._tasksFilePath, JSON.stringify(tasks, null, 2));
			}, oraOptions);
		}
	}
}
