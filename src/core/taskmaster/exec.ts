/* libs */
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";

/* constants */
import { PRD_PATH, TASKS_PATH, TASKS_STATUSES } from "@/constants";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";
import { restartAsync } from "@/core/restart";

/* utils */
import { existsAsync } from "@/utils/extras";

/* prompt */
import {
	tmaiInitMenu_prompt,
	tmaiGenDecMenu_prompt,
	tmaiManageMenu_prompt,
	tmaiListNavMenu_prompt,
	tmaiAddTasksMenu_prompt,
	tmaiUpdateTasksMenu_prompt,
	tmaiDeleteTasksMenu_prompt,
	tmaiStatusTrackingMenu_prompt,
} from "@/prompt";

// ===============================

const tmai = new TaskMaster({
	tasksFilePath: TASKS_PATH,
	isTestMode: false,
});

/*******  be6e15c7-9970-4578-baf6-d31421004679  *******/
// TODO: done
export async function tmaiInitAsync() {
	const choice = await inquirer.prompt(tmaiInitMenu_prompt);

	if (choice.tmaiInitMenu === "tmai-install") {
		await tmai.installAsync();
	} else if (choice.tmaiInitMenu === "tmai-init") {
		await tmai.initAsync();
	} else if (choice.tmaiInitMenu === "tmai-config") {
		await tmai.configAsync();
	}

	await restartAsync();
}

// TODO: done
export async function tmaiGenAsync() {
	const choice = await inquirer.prompt(tmaiGenDecMenu_prompt);

	if (choice.tmaiGenDecMenu === "tmai-parse") {
		const tasksJsonPath = path.join(".taskmaster", "tasks", "tasks.json");

		if (await existsAsync(tasksJsonPath)) {
			const { overwrite } = await inquirer.prompt({
				type: "confirm",
				name: "overwrite",
				message: chalk.bgYellow(
					"tasks.json already exists. Do you want to overwrite it?",
				),
			});

			if (!overwrite) {
				return restartAsync();
			}
		}

		const { prdPath } = await inquirer.prompt({
			type: "input",
			name: "prdPath",
			message: "Enter the path to your PRD file:",
			default: PRD_PATH,
			validate: (input) => {
				const extension = path.extname(input).toLowerCase();
				if (extension !== ".txt" && extension !== ".md") {
					return "Please enter a valid PRD file with .txt or .md extension";
				}
				return true;
			},
		});

		const { numTasksToGenerate } = await inquirer.prompt({
			type: "number",
			name: "numTasksToGenerate",
			message: "Enter the number of tasks to generate:",
			validate: (input) => {
				const num = Number(input);
				if (Number.isNaN(num) || num < 3 || num > 30) {
					return "Please enter a valid number between 3 and 30";
				}
				return true;
			},
			default: 10,
		});

		const { allowAdvancedResearch } = await inquirer.prompt({
			type: "confirm",
			name: "allowAdvancedResearch",
			message: "Allow advanced research for task generation ?",
			default: false,
		});

		await tmai.parseAsync(
			prdPath,
			numTasksToGenerate,
			allowAdvancedResearch,
			false,
		);
	} else if (choice.tmaiGenDecMenu === "tmai-gen") {
		await tmai.genAsync();
	} else if (choice.tmaiGenDecMenu === "tmai-dec") {
		const { confirmDecomposition } = await inquirer.prompt({
			type: "confirm",
			name: "confirmDecomposition",
			message: chalk.yellow(
				"Confirm that you want to expand all tasks? This action will decompose every task into smaller subtasks and may increase the total number of tasks to manage.",
			),
			default: false,
		});
		if (!confirmDecomposition) {
			console.log("Decomposition of tasks cancelled!");
			return restartAsync();
		}
		await tmai.decomposeAsync();
	}

	await restartAsync();
}

// TODO: in-progress
export async function tmaiManageAsync() {
	const tasks = await tmai.getTasksContentAsync();
	const { tmaiManageMenu } = await inquirer.prompt(tmaiManageMenu_prompt);

	switch (tmaiManageMenu) {
		case "tmai-listnav": {
			const { tmaiListNavMenu } = await inquirer.prompt(tmaiListNavMenu_prompt);
			if (tmaiListNavMenu === "tmai-list") {
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
				await tmai.listAsync(tasks, validatedStatus, quickly, withSubtasks);
			} else if (tmaiListNavMenu === "tmai-show") {
				console.log(
					await tmai.listQuickAsync(tasks, TASKS_STATUSES.join(","), true),
				);
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
				await tmai.showAsync(taskId);
			} else if (tmaiListNavMenu === "tmai-next") {
				await tmai.nextAsync();
			}
			break;
		}
		case "tmai-addtasks": {
			const { tmaiAddTasksMenu } = await inquirer.prompt(
				tmaiAddTasksMenu_prompt,
			);
			if (tmaiAddTasksMenu === "tmai-addtasks") {
				console.log("Executing task addition...");
			}
			break;
		}
		case "tmai-updatetasks": {
			const { tmaiUpdateTasksMenu } = await inquirer.prompt(
				tmaiUpdateTasksMenu_prompt,
			);
			if (tmaiUpdateTasksMenu === "tmai-updatetasks") {
				console.log("Executing task update...");
			}
			break;
		}
		case "tmai-deletetasks": {
			const { tmaiDeleteTasksMenu } = await inquirer.prompt(
				tmaiDeleteTasksMenu_prompt,
			);
			if (tmaiDeleteTasksMenu === "tmai-deletetasks") {
				console.log("Executing task deletion...");
			}
			break;
		}
		case "tmai-statustracking": {
			const { tmaiStatusTrackingMenu } = await inquirer.prompt(
				tmaiStatusTrackingMenu_prompt,
			);
			if (tmaiStatusTrackingMenu === "tmai-statustracking") {
				console.log("Executing status tracking...");
			}
			break;
		}
		default:
			console.log("Invalid option selected.");
	}

	await restartAsync();
}
