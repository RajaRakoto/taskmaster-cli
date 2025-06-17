/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";

/* extras */
import { existsAsync, runCommandAsync } from "@/utils/extras";

/* types */
import type { T_PackageManager } from "@/@types/index";

// ===============================

/**
 * TaskMaster - Core class for managing task-master AI operations
 * Provides methods to install, initialize, configure, manage, and more ...
 * Handles user interactions and system operations related to task-master setup.
 * @class
 */
export class TaskMaster {
	constructor() {
		console.log(chalk.bgMagenta("TMAI Core initialized !"));
	}

	// ==============================================
	// Method for Installation and Configuration
	// ==============================================

	/**
	 * @description - Installs or updates task-master AI using the chosen package manager
	 */
	async installAsync(): Promise<void> {
		const packageManagerChoices: T_PackageManager[] = ["npm", "pnpm", "bun"];

		const { packageManagerChoice } = await inquirer.prompt<{
			packageManagerChoice: T_PackageManager;
		}>({
			type: "list",
			name: "packageManagerChoice",
			message: "Choose your package manager for installation:",
			loop: false,
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

	/**
	 * @description - Initializes the task-master AI by creating a PRD file
	 * @note - This function doesn't use oraPromise as it is not a long-running task
	 * @throws Will throw an error if file operations fail
	 */
	async initAsync(): Promise<void> {
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

	/**
	 * @description - Configures AI models for task-master by running the interactive setup
	 */
	async configAsync(): Promise<void> {
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
	// Method for Task Generation
	// ==============================================

	/**
	 * @description - Parses a PRD file to generate tasks
	 * @param inputFile - Path to the PRD file
	 */
	async parseAsync(inputFile: string): Promise<void> {
		const oraOptions = {
			text: `Parsing PRD file: ${chalk.bold(inputFile)}...`,
			successText: chalk.bgGreen("PRD parsed successfully!"),
			failText: chalk.bgRed("Failed to parse PRD file"),
		};

		await oraPromise(
			runCommandAsync(
				"task-master",
				["parse-prd", `--input=${inputFile}`],
				false,
				false,
			),
			oraOptions,
		);
	}

	/**
	 * @description - Generates task files from parsed data
	 */
	async genAsync(): Promise<void> {
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
}
