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
	askOverwriteConfirmationAsync,
	askPrdPathAsync,
	askNumTasksToGenerateAsync,
	askAdvancedResearchConfirmationAsync,
	askTaskTagAsync,
	askDecompositionConfirmationAsync,
	askStatusSelectionAsync,
	askDisplayOptionsAsync,
	askHierarchicalTaskIdAsync,
	askTaskPromptAsync,
	askTaskIdAsync,
	askNumSubtasksAsync,
	askSubtaskManualParamsAsync,
	askBackupSlotAsync,
	askHybridTaskIdAsync,
	askMultipleTaskIdAsync,
	askLangAsync,
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
	tmaiDepsMenu_prompt,
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
	} else if (choice.tmaiInitMenu === "tmai-lang") {
		const lang = await askLangAsync();
		await tmai.setLangAsync(lang);
	}

	await restartAsync();
}

// TODO: done
export async function tmaiGenAsync() {
	const choice = await inquirer.prompt(tmaiGenDecMenu_prompt);

	if (choice.tmaiGenDecMenu === "tmai-parse") {
		const tasksJsonPath = path.join(".taskmaster", "tasks", "tasks.json");
		if (await existsAsync(tasksJsonPath)) {
			const overwrite = await askOverwriteConfirmationAsync();
			if (!overwrite) {
				return restartAsync();
			}
		}

		const prdPath = await askPrdPathAsync();
		const numTasksToGenerate = await askNumTasksToGenerateAsync();
		const allowAdvancedResearch = await askAdvancedResearchConfirmationAsync();
		const tag = await askTaskTagAsync();

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
		const confirmDecomposition = await askDecompositionConfirmationAsync();
		if (!confirmDecomposition) {
			console.log("Decomposition of tasks cancelled!");
			return restartAsync();
		}

		const tag = await askTaskTagAsync();
		await tmai.decomposeAsync(tag);
	}

	await restartAsync();
}

// TODO: in-progress
export async function tmaiManageAsync() {
	let tasks = await tmai.getTasksContentAsync();
	const { mainIDs, subtasksIDs } = await tmai.getAllTaskIdsAsync(tasks);
	const { tmaiManageMenu } = await inquirer.prompt(tmaiManageMenu_prompt);

	switch (tmaiManageMenu) {
		case "tmai-listnav": {
			const { tmaiListNavMenu } = await inquirer.prompt(tmaiListNavMenu_prompt);
			if (tmaiListNavMenu === "tmai-list") {
				const validatedStatus = await askStatusSelectionAsync();
				const { quickly, withSubtasks } = await askDisplayOptionsAsync();
				await tmai.listAsync(tasks, validatedStatus, quickly, withSubtasks);
			} else if (tmaiListNavMenu === "tmai-show") {
				await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
				const taskId = await askHierarchicalTaskIdAsync(subtasksIDs);
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
			const tag = await askTaskTagAsync();

			switch (tmaiAddTasksMenu) {
				case "tmai-addtaskai": {
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.addTaskByAIAsync(prompt, research, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, false);
					break;
				}
				case "tmai-addtasksprd": {
					const prdPath = await askPrdPathAsync();
					const numTasksToGenerate = await askNumTasksToGenerateAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.parseAsync(
						prdPath,
						numTasksToGenerate,
						research,
						true,
						tag,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-addsubtaskai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const parentId = await askTaskIdAsync(mainIDs);
					const numTasksToGenerate = await askNumSubtasksAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.addSubtasksByAIAsync(
						parentId,
						numTasksToGenerate,
						research,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-addsubtaskmanual": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const parentId = await askTaskIdAsync(mainIDs);
					const { title, description } = await askSubtaskManualParamsAsync();
					await tmai.addSubtaskManuallyAsync(parentId, title, description);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
			}
			break;
		}
		case "tmai-updatetasks": {
			const { tmaiUpdateTasksMenu } = await inquirer.prompt(
				tmaiUpdateTasksMenu_prompt,
			);
			const tag = await askTaskTagAsync();

			switch (tmaiUpdateTasksMenu) {
				case "tmai-updatetaskai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, false);
					const parentId = await askTaskIdAsync(mainIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateTaskByAIAsync(parentId, prompt, research, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, false);
					break;
				}
				case "tmai-updatemultipletasksai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, false);
					const startingId = await askTaskIdAsync(mainIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateMultipleTasksByAIAsync(
						startingId,
						prompt,
						research,
						tag,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, false);
					break;
				}
				case "tmai-updatesubtaskai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const subtaskId = await askHierarchicalTaskIdAsync(subtasksIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateSubtaskByAIAsync(subtaskId, prompt, research, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-converttasktosubtask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const subtaskId = await askTaskIdAsync(
						mainIDs,
						"Enter task ID (to convert):",
					);
					const parentId = await askTaskIdAsync(
						mainIDs,
						"Enter task ID (parent):",
					);
					await tmai.convertTaskToSubtaskAsync(subtaskId, parentId);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
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

// TODO: in-progress
export async function tmaiDependenciesAsync() {
	const { tmaiDepsMenu } = await inquirer.prompt(tmaiDepsMenu_prompt);
	const tasks = await tmai.getTasksContentAsync();
	const { mainIDs, subtasksIDs } = await tmai.getAllTaskIdsAsync(tasks);

	switch (tmaiDepsMenu) {
		case "tmai-adddeps": {
			await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
			const taskId = await askHybridTaskIdAsync(mainIDs, subtasksIDs);
			const multipleTaskIds = await askMultipleTaskIdAsync(
				mainIDs,
				subtasksIDs,
			);
			await tmai.addDependencyAsync(taskId, multipleTaskIds);
			await tmai.listAsync(tasks, TASKS_STATUSES.join(","), false, true);
			break;
		}
		case "tmai-validatedeps": {
			await tmai.validateDependenciesAsync();
			break;
		}
		case "tmai-fixdeps": {
			await tmai.fixDependenciesAsync();
			break;
		}
		case "tmai-clearalldeps": {
			await tmai.listAsync(tasks, TASKS_STATUSES.join(","), false, true);
			const taskId = await askHybridTaskIdAsync(mainIDs, subtasksIDs);
			await tmai.clearAllDependenciesAsync(taskId);
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
			const slot = await askBackupSlotAsync();
			await tmai.backupAsync(slot);
			break;
		}
		case "tmai-restore": {
			const slot = await askBackupSlotAsync();
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
