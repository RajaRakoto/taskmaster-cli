/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";
import fs from "node:fs";
import figures from "figures";

/* constants */
import { MAX_TITLE_LENGTH } from "@/constants";

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
	private _tasksFilePath: string;
	private _isTestMode: boolean;

	constructor({
		tasksFilePath,
		isTestMode,
	}: {
		tasksFilePath: string;
		isTestMode: boolean;
	}) {
		this._tasksFilePath = tasksFilePath;
		this._isTestMode = isTestMode;

		console.info(chalk.bgMagenta("TaskMaster AI Core initialized"));

		if (!this._isTestMode) {
			if (!fs.existsSync(this._tasksFilePath)) {
				console.warn(
					chalk.bgYellow(
						"tasks.json not found. Please set up TaskMaster and generate tasks.json from the PRD file.",
					),
				);
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

	public async getTasksContentAsync(): Promise<I_Tasks> {
		const oraOptions = {
			text: `Fetching tasks from ${chalk.bold(this._tasksFilePath)}...`,
			successText: chalk.green("Fetched tasks successfully!"),
			failText: chalk.red("Failed to retrieve tasks from tasks.json"),
		};

		return oraPromise(
			readJsonFileAsync<I_Tasks>(this._tasksFilePath),
			oraOptions,
		);
	}

	public setTasksFilePath(tasksFilePath: string): void {
		this._tasksFilePath = tasksFilePath;
	}

	// ==============================================
	// Method for Installation and Configuration
	// ==============================================

	// TODO: done
	/**
	 * @description Installs or updates task-master AI using the chosen package manager
	 */
	public async installAsync(): Promise<void> {
		const packageManagerChoices: T_PackageManager[] = ["npm", "pnpm", "bun"];

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

		await runCommandAsync("task-master", ["init"], false, false);
		console.log(chalk.bgGreen("Task-master project initialized successfully!"));
	}

	// TODO: done
	/**
	 * @description Configures AI models for task-master by running the interactive setup
	 */
	public async configAsync(): Promise<void> {
		const oraOptions = {
			text: "Configuring AI models...",
			successText: chalk.bgGreen("AI models configured successfully!"),
			failText: chalk.bgRed("AI model configuration failed"),
		};

		await oraPromise(
			runCommandAsync("task-master", ["models", "--setup"], true, false),
			oraOptions,
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
	 * @param tag Optional tag for the generated tasks
	 */
	public async parseAsync(
		inputFilePath: string,
		numTasksToGenerate: number,
		allowAdvancedResearch: boolean,
		appendToExistingTasks: boolean,
		tag?: string,
	): Promise<void> {
		const oraOptions = {
			text: `Parsing PRD file: ${chalk.bold(inputFilePath)}...`,
			successText: chalk.bgGreen("PRD parsed successfully!"),
			failText: chalk.bgRed("Failed to parse PRD file"),
		};

		const argv = [
			"parse-prd",
			`--input=${inputFilePath}`,
			`--num-tasks=${numTasksToGenerate}`,
			allowAdvancedResearch ? "--research" : "",
			appendToExistingTasks ? "--append" : "",
			tag ? `--tag=${tag}` : "",
		].filter(Boolean);

		await oraPromise(
			runCommandAsync("task-master", argv, false, false),
			oraOptions,
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
			const oraOptions = {
				text: "Generating task files...",
				successText: chalk.bgGreen("Task files generated successfully!"),
				failText: chalk.bgRed("Task file generation failed"),
			};

			await oraPromise(
				runCommandAsync("task-master", ["generate"], false, false),
				oraOptions,
			);
		}
	}

	// TODO: done
	/**
	 * @description Decomposes all tasks using AI
	 */
	public async decomposeAsync(): Promise<void> {
		const oraOptions = {
			text: "Decomposing tasks ...",
			successText: chalk.bgGreen("Tasks decomposed successfully!"),
			failText: chalk.bgRed("Failed to decompose tasks"),
		};

		await oraPromise(
			runCommandAsync("task-master", ["expand", "--all"], false, false),
			oraOptions,
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
		// Helper to truncate text with ellipsis
		const truncate = (text: string, maxLength: number): string =>
			text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;

		// Format status with icons and colors for all statuses
		const formatStatus = (status: Status): string => {
			const statusMap = {
				todo: { icon: figures.circle, color: chalk.gray },
				"in-progress": { icon: figures.play, color: chalk.yellow },
				done: { icon: figures.tick, color: chalk.green },
				blocked: { icon: figures.cross, color: chalk.red },
				pending: { icon: figures.ellipsis, color: chalk.gray },
				review: { icon: figures.star, color: chalk.blue },
				deferred: { icon: figures.arrowDown, color: chalk.magenta },
				cancelled: { icon: figures.cross, color: chalk.redBright },
			};

			const config = statusMap[status] || {
				icon: figures.circle,
				color: chalk.gray,
			};
			return config.color(`${config.icon} ${status}`);
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
				const title = truncate(task.title, MAX_TITLE_LENGTH);
				output +=
					`${chalk.bgGreen.bold(`#${task.id}`)} ${chalk.magenta(title)} ` +
					`[status: ${formatStatus(task.status)}] - ` +
					`[priority: ${formatPriority(task.priority)}]\n`;

				// Only show matching subtasks
				if (withSubtasks && matchingSubtasks.length > 0) {
					for (const { index, subtask } of matchingSubtasks) {
						const subTitle = truncate(subtask.title, MAX_TITLE_LENGTH);
						const hierarchicalId = `${task.id}.${index + 1}`;
						output +=
							`  ${chalk.dim("↳")} ${chalk.bold(`#${hierarchicalId}`)} ` +
							`${chalk.magenta(subTitle)} [status: ${formatStatus(
								subtask.status,
							)}]\n`;
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
			const oraOptions = {
				text: "Listing tasks...",
				successText: chalk.bgGreen("Tasks listed successfully!"),
				failText: chalk.bgRed("Failed to list tasks"),
			};

			await oraPromise(
				runCommandAsync("task-master", args, false, false),
				oraOptions,
			);
		}
	}

	// TODO: done
	/**
	 * @description Shows details of a specific task by ID
	 * @param id Task ID (integer or hierarchical ID like 1.1, 2.3, etc.)
	 */
	public async showAsync(id: string): Promise<void> {
		const oraOptions = {
			text: `Fetching details for task ${chalk.bold(id)}...`,
			successText: chalk.bgGreen("Task details retrieved successfully!"),
			failText: chalk.bgRed("Failed to retrieve task details"),
		};

		await oraPromise(
			runCommandAsync("task-master", ["show", id], false, false),
			oraOptions,
		);
	}

	// TODO: done
	/**
	 * @description Shows the next available task to work on
	 */
	public async nextAsync(): Promise<void> {
		const oraOptions = {
			text: "Finding next available task...",
			successText: chalk.bgGreen("Next task retrieved successfully!"),
			failText: chalk.bgRed("Failed to determine next task"),
		};

		await oraPromise(
			runCommandAsync("task-master", ["next"], false, false),
			oraOptions,
		);
	}
}
