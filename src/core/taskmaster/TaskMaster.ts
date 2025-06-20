/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";
import fs from "node:fs";
import figures from "figures";

/* constants */
import {
	MAX_TITLE_TRUNC_LENGTH,
	STATUS_CONFIG,
	PACKAGE_MANAGERS,
	TASKMASTER_INIT_MSG,
	TASKS_FILE_WARN,
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
	// Helpers
	// ==============================================

	// TODO: validate
	/**
	 * @description Helper method to execute commands with consistent ora handling
	 * @param text Loading text for ora spinner
	 * @param successText Success message
	 * @param failText Failure message
	 * @param command Main command to execute
	 * @param args Command arguments
	 */
	private async executeCommandAsync(
		text: string,
		successText: string,
		failText: string,
		command: string,
		args: string[] = [],
	): Promise<void> {
		// Escape the arguments to prevent injections
		const escapedArgs = args.map(arg =>
			`"${arg.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`
		);

		const oraOptions = {
			text: text,
			successText: chalk.bgGreen(successText),
			failText: chalk.bgRed(failText),
		};

		await oraPromise(runCommandAsync(command, escapedArgs, false, false), oraOptions);
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
	public async configAsync(): Promise<void> {
		await this.executeCommandAsync(
			"Configuring AI models...",
			"AI models configured successfully!",
			"AI model configuration failed",
			this._mainCommand,
			["models", "--setup"],
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
	 * @param tag tag for the generated tasks
	 */
	public async parseAsync(
		inputFilePath: string,
		numTasksToGenerate: number,
		allowAdvancedResearch: boolean,
		appendToExistingTasks: boolean,
		tag: string,
	): Promise<void> {
		await this.executeCommandAsync(
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
			await this.executeCommandAsync(
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
	 * @param tag tag for the tasks to decompose
	 */
	public async decomposeAsync(tag: string): Promise<void> {
		await this.executeCommandAsync(
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
				output +=
					`${chalk.bgGreen.bold(`#${task.id}`)} ${chalk.magenta(title)} ` +
					`[status: ${formatStatus(task.status)}] - ` +
					`[priority: ${formatPriority(task.priority)}]\n`;

				// Only show matching subtasks
				if (withSubtasks && matchingSubtasks.length > 0) {
					for (const { index, subtask } of matchingSubtasks) {
						const subTitle = truncate(subtask.title, MAX_TITLE_TRUNC_LENGTH);
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
			await this.executeCommandAsync(
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
		await this.executeCommandAsync(
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
		await this.executeCommandAsync(
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

	// TODO: validate
	/**
	 * @description Adds a new task using AI
	 * @param prompt Description of the task to create
	 * @param allowAdvancedResearch Use research capabilities
	 * @param tag Tag context for the task
	 */
	public async addTaskByAIAsync(
		prompt: string,
		allowAdvancedResearch: boolean,
		tag: string,
	): Promise<void> {
		await this.executeCommandAsync(
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

	// TODO: validate
	/**
	 * @description Adds a new task manually
	 * @param title Task title
	 * @param description Task description
	 * @param details Implementation details
	 * @param priority Task priority level (low, medium, high)
	 * @param status Task status (pending, in-progress, done, review, deferred, cancelled, todo, blocked)
	 * @param dependencies Comma-separated dependency IDs (1,2,3)
	 * @param tag Tag context for the task
	 */
	public async addTaskManuallyAsync(
		title: string,
		description: string,
		details: string,
		priority: Priority,
		status: Status,
		dependencies: string,
		tag: string,
	): Promise<void> {
		await this.executeCommandAsync(
			`Adding manual task: "${chalk.bold(title)}"...`,
			"Task added successfully!",
			"Failed to add manual task",
			this._mainCommand,
			[
				"add-task",
				`--title="${title}"`,
				`--description="${description}"`,
				`--details="${details}"`,
				`--priority=${priority}`,
				`--status=${status}`,
				dependencies ? `--dependencies=${dependencies}` : "",
				tag ? `--tag=${tag}` : "",
			].filter(Boolean),
		);
	}

	// TODO: validate
	/**
	 * @description Adds subtasks using AI
	 * @param parentId Parent task ID
	 * @param numTasksToGenerate Number of subtasks to generate
	 * @param allowAdvancedResearch Use research capabilities
	 */
	public async addSubtasksByAIAsync(
		parentId: string,
		numTasksToGenerate: number,
		allowAdvancedResearch: boolean,
	): Promise<void> {
		await this.executeCommandAsync(
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

	// TODO: validate
	/**
	 * @description Adds a subtask manually
	 * @param parentId Parent task ID
	 * @param title Subtask title
	 * @param description Subtask description
	 * @param details Implementation details
	 * @param priority Subtask priority level (low, medium, high)
	 * @param status Subtask status (pending, in-progress, done, review, deferred, cancelled, todo, blocked)
	 * @param dependencies Comma-separated dependency IDs
	 * @note This methode does not use tag context as subtasks are usually tied to their parent task
	 */
	public async addSubtaskManuallyAsync(
		parentId: string,
		title: string,
		description: string,
		details: string,
		priority: Priority,
		status: Status,
		dependencies: string,
	): Promise<void> {
		await this.executeCommandAsync(
			`Adding manual subtask to task ${chalk.bold(parentId)}...`,
			"Subtask added successfully!",
			"Failed to add manual subtask",
			this._mainCommand,
			[
				"add-subtask",
				`--id=${parentId}`,
				`--title="${title}"`,
				`--description="${description}"`,
				`--details="${details}"`,
				`--priority=${priority}`,
				`--status=${status}`,
				dependencies ? `--dependencies=${dependencies}` : "",
			].filter(Boolean),
		);
	}
}
