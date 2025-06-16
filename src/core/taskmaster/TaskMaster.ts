/* libs */
import { oraPromise } from "ora";
import { mkdir, writeFile } from "node:fs/promises";
import { execa } from "execa";
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";

/* constants */
import { DEV_MODE } from "@/constants";

/* extras */
import { existsAsync } from "@/utils/extras";

/* types */
import type { T_PackageManager } from "@/@types/index";

// ===============================

/**
 * Principal Class for interacting with the task-master tool
 */
export class TaskMaster {
	constructor() {
		console.log("TaskMaster initialized !");
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

			await execa(command, args, {
				stdio: "inherit",
				env: process.env,
			});
		}, oraOptions);
	}

	/**
	 * @description - Initializes the task-master AI by creating a PRD file
	 */
	async initAsync() {
		const prdFile = DEV_MODE ? "PRD-test.md" : "PRD.md";
		const prdDestination = DEV_MODE ? "tests" : "docs";
		const prdFilePath = path.join(prdDestination, prdFile);

		if (await existsAsync(prdFilePath)) {
			console.log(chalk.yellow(`PRD file already exists at ${prdFilePath}.`));
			await execa("task-master", ["init"], { stdio: "inherit" });
		}

		try {
			await oraPromise(
				async () => {
					await mkdir(prdDestination, { recursive: true });
					await writeFile(prdFilePath, "");
				},
				{
					text: "Generating PRD file ...",
					successText: `PRD file created at ${prdFilePath}`,
					failText: (error) => `Failed to create PRD file: ${error.message}`,
				},
			);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(chalk.red(`Error creating PRD file: ${errorMessage}`));
			throw error;
		}

		await execa("task-master", ["init"], { stdio: "inherit" });
	}

	/**
	 * @description - Configures the AI models for task-master AI
	 */
	async configAsync() {
		await execa("task-master", ["models", "--setup"], { stdio: "inherit" });
	}
}
