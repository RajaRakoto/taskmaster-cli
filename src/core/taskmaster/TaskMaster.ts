/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile } from "node:fs/promises";
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";

/* constants */
import { DEV_MODE } from "@/constants";

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
			successText: "Task-master AI installed successfully !",
			failText: `Failed to install task-master AI with ${chalk.bold(
				packageManagerChoice,
			)}.`,
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
	 * @note1 - This function doesn't use oraPromise as it is not a long-running task
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
			successText: "AI models configured successfully!",
			failText: "AI model configuration failed",
		};

		await oraPromise(
			runCommandAsync("task-master", ["models", "--setup"], true, false),
			oraOptions,
		);
	}
}
