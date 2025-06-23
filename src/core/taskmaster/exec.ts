/* libs */
import inquirer from "inquirer";
import path from "node:path";

/* constants */
import { MAIN_COMMAND, TASKS_PATH, TASKS_STATUSES } from "@/constants";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";
import { restartAsync } from "@/core/restart";

/* utils */
import { existsAsync } from "@/utils/extras";

/* asks */
import {
	askOverwriteConfirmation,
	askPrdPath,
	askNumTasksToGenerate,
	askAdvancedResearchConfirmation,
	askTaskTag,
	askDecompositionConfirmation,
	askStatusSelection,
	askDisplayOptions,
	askTaskIdInput,
	askTaskPrompt,
	askTaskManualParams,
	askSubtaskParentId,
	askNumSubtasks,
	askSubtaskManualParams,
	askBackupSlot,
} from "@/core/taskmaster/asks";

import chalk from "chalk";

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
	tmaiBackupRestoreClearClear_prompt,
} from "@/prompt";

// ===============================

const tmai = new TaskMaster({
	mainCommand: MAIN_COMMAND,
	tasksFilePath: TASKS_PATH,
	isTestMode: false,
});

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
			const overwrite = await askOverwriteConfirmation();
			if (!overwrite) {
				return restartAsync();
			}
		}

		const prdPath = await askPrdPath();
		const numTasksToGenerate = await askNumTasksToGenerate();
		const allowAdvancedResearch = await askAdvancedResearchConfirmation();
		const tag = await askTaskTag();

		await tmai.parseAsync(
			prdPath,
			numTasksToGenerate,
			allowAdvancedResearch,
			false,
			tag,
		);
	} else if (choice.tmaiGenDecMenu === "tmai-gen") {
		await tmai.genAsync();
	} else if (choice.tmaiGenDecMenu === "tmai-dec") {
		const confirmDecomposition = await askDecompositionConfirmation();
		if (!confirmDecomposition) {
			console.log("Decomposition of tasks cancelled!");
			return restartAsync();
		}

		const tag = await askTaskTag();
		await tmai.decomposeAsync(tag);
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
				const validatedStatus = await askStatusSelection();
				const { quickly, withSubtasks } = await askDisplayOptions();
				await tmai.listAsync(tasks, validatedStatus, quickly, withSubtasks);
			} else if (tmaiListNavMenu === "tmai-show") {
				console.log(
					await tmai.listQuickAsync(tasks, TASKS_STATUSES.join(","), true),
				);
				const taskId = await askTaskIdInput();
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
			const tag = await askTaskTag();

			switch (tmaiAddTasksMenu) {
				case "tmai-addtaskai": {
					const prompt = await askTaskPrompt();
					const research = await askAdvancedResearchConfirmation();
					await tmai.addTaskByAIAsync(prompt, research, tag);
					break;
				}
				case "tmai-addtaskmanual": {
					const {
						title,
						description,
						details,
						priority,
						dependencies,
					} = await askTaskManualParams();
					await tmai.addTaskManuallyAsync(
						title,
						description,
						details,
						priority,
						dependencies,
						tag,
					);
					break;
				}
				case "tmai-addtasksprd": {
					const prdPath = await askPrdPath();
					const numTasksToGenerate = await askNumTasksToGenerate();
					const research = await askAdvancedResearchConfirmation();
					await tmai.parseAsync(
						prdPath,
						numTasksToGenerate,
						research,
						true,
						tag,
					);
					break;
				}
				case "tmai-addsubtaskai": {
					const parentId = await askSubtaskParentId();
					const numTasksToGenerate = await askNumSubtasks();
					const research = await askAdvancedResearchConfirmation();
					await tmai.addSubtasksByAIAsync(
						parentId,
						numTasksToGenerate,
						research,
					);
					break;
				}
				case "tmai-addsubtaskmanual": {
					const parentId = await askSubtaskParentId();
					const {
						title,
						description,
						details,
						priority,
						dependencies,
					} = await askSubtaskManualParams();
					await tmai.addSubtaskManuallyAsync(
						parentId,
						title,
						description,
						details,
						priority,
						dependencies,
					);
					break;
				}
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

// TODO: done
export async function tmaiBackupRestoreClearAsync() {
	const { tmaiBackupRestoreClearMenu } = await inquirer.prompt(
		tmaiBackupRestoreClearClear_prompt,
	);

	switch (tmaiBackupRestoreClearMenu) {
		case "tmai-backup": {
			const slot = await askBackupSlot();
			await tmai.backupAsync(slot);
			break;
		}
		case "tmai-restore": {
			const slot = await askBackupSlot();
			const { confirm } = await inquirer.prompt({
				type: "confirm",
				name: "confirm",
				message: chalk.yellow(
					`Are you sure you want to restore slot ${slot}? This will overwrite current data.`,
				),
				default: false,
			});

			if (confirm) {
				await tmai.restoreAsync(slot);
			} else {
				console.log("Restore operation cancelled!");
			}
			break;
		}
		case "tmai-clear": {
			await tmai.clearTasksAsync();
			break;
		}
		default:
			console.log("Invalid option selected.");
	}

	await restartAsync();
}
