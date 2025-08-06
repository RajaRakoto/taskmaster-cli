/* libs */
import inquirer from "inquirer";
import path from "node:path";

/* index */
import { taskmasterCLI } from "@/index";

/* constants */
import {
	AI_MODELS,
	MAIN_COMMAND,
	TASKS_PATH,
	TASKS_STATUSES,
	DEFAULT_COUNTDOWN,
} from "@/constants";

/* core */
import { TaskMaster } from "@/core/TaskMaster";
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
	askModelsAsync,
	askStatusAsync,
	askWithSubtasksAsync,
} from "@/core/asks";

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
	tmaiDepsMenu_prompt,
	tmaiAnalysisReportDocs_prompt,
	tmaiBackupRestoreClearClear_prompt,
} from "@/prompt";

// ===============================

const tmai = new TaskMaster({
	mainCommand: MAIN_COMMAND,
	tasksFilePath: TASKS_PATH,
	isTestMode: false,
});

/**
 * @description Handles the initialization menu for TMAI, providing options for installation,
 * configuration, and language setting. Depending on the user's choice, it executes the corresponding
 * action such as installing/upgrading TMAI, initializing TMAI with updated rules, configuring AI models
 * interactively or quickly, and setting the response language for AI-generated content.
 * If the "back" option is selected, it returns to the main CLI menu.
 * After executing the selected action, it continues to prompt the user for further actions.
 */
export async function tmaiInitAsync() {
	const choice = await inquirer.prompt(tmaiInitMenu_prompt);

	if (choice.tmaiInitMenu === "back") {
		return taskmasterCLI();
	}

	if (choice.tmaiInitMenu === "tmai-install") {
		await tmai.installAsync();
	} else if (choice.tmaiInitMenu === "tmai-init") {
		await tmai.initAsync();
	} else if (choice.tmaiInitMenu === "tmai-interactiveconfig") {
		await tmai.interactiveConfigModelAsync();
	} else if (choice.tmaiInitMenu === "tmai-config") {
		const { mainModel, researchModel, fallbackModel } = await askModelsAsync();

		// Get provider from AI_MODELS configuration
		const mainModelObj = AI_MODELS.find((model) => model.value === mainModel);
		const researchModelObj = AI_MODELS.find(
			(model) => model.value === researchModel,
		);
		const fallbackModelObj = AI_MODELS.find(
			(model) => model.value === fallbackModel,
		);

		// Use the first provider that is defined and not null
		const provider =
			mainModelObj?.provider ||
			researchModelObj?.provider ||
			fallbackModelObj?.provider ||
			undefined;

		await tmai.configModelsAsync(
			mainModel,
			researchModel,
			fallbackModel,
			provider,
		);
	} else if (choice.tmaiInitMenu === "tmai-lang") {
		const lang = await askLangAsync();
		await tmai.setLangAsync(lang);
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiInitAsync();
}

/**
 * @description The main entry point for the generation and decomposition menu.
 * It will prompt the user to select one of the following options:
 * - Generate tasks from a PRD file
 * - Generate task files
 * - Decompose all tasks
 */
export async function tmaiGenAsync() {
	const choice = await inquirer.prompt(tmaiGenDecMenu_prompt);

	if (choice.tmaiGenDecMenu === "back") {
		return taskmasterCLI();
	}

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
			await tmai.countdownAsync(DEFAULT_COUNTDOWN);
			return await tmaiGenAsync();
		}

		const tag = await askTaskTagAsync();
		await tmai.decomposeAsync(tag);
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiGenAsync();
}

/**
 * @description The main entry point for the task management menu (CRUD).
 * It will prompt the user to select one of the following options:
 * - List and navigation
 * - Add tasks
 * - Update tasks
 * - Delete tasks
 */
export async function tmaiManageAsync() {
	let tasks = await tmai.getTasksContentAsync();
	const { mainIDs, subtasksIDs } = await tmai.getAllTaskIdsAsync(tasks);
	const { tmaiManageMenu } = await inquirer.prompt(tmaiManageMenu_prompt);

	if (tmaiManageMenu === "back") {
		return taskmasterCLI();
	}

	switch (tmaiManageMenu) {
		case "tmai-listnav": {
			const { tmaiListNavMenu } = await inquirer.prompt(tmaiListNavMenu_prompt);

			if (tmaiListNavMenu === "back") {
				return await tmaiManageAsync();
			}

			if (tmaiListNavMenu === "tmai-list") {
				const validatedStatus = await askStatusSelectionAsync();
				const { quickly, withSubtasks } = await askDisplayOptionsAsync();
				await tmai.listAsync(tasks, validatedStatus, quickly, withSubtasks);
			} else if (tmaiListNavMenu === "tmai-show") {
				await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
				const taskId = await askHybridTaskIdAsync(mainIDs, subtasksIDs);
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

			if (tmaiAddTasksMenu === "back") {
				return await tmaiManageAsync();
			}

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

			if (tmaiUpdateTasksMenu === "back") {
				return await tmaiManageAsync();
			}

			const tag = await askTaskTagAsync();

			switch (tmaiUpdateTasksMenu) {
				case "tmai-updatetaskai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const parentId = await askTaskIdAsync(mainIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateTaskByAIAsync(
						parentId,
						prompt,
						research,
						tag,
						tasks,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-updatemultipletasksai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const startingId = await askTaskIdAsync(mainIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateMultipleTasksByAIAsync(
						startingId,
						prompt,
						research,
						tag,
						tasks,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-updatesubtaskai": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const subtaskId = await askHierarchicalTaskIdAsync(subtasksIDs);
					const prompt = await askTaskPromptAsync();
					const research = await askAdvancedResearchConfirmationAsync();
					await tmai.updateSubtaskByAIAsync(
						subtaskId,
						prompt,
						research,
						tag,
						tasks,
					);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-updatestatus": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const ids = await askMultipleTaskIdAsync(mainIDs, subtasksIDs);
					const status = await askStatusAsync();
					await tmai.updateTaskStatusAsync(ids, status, tag);
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
				case "tmai-convertsubtasktotask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const subtaskId = await askHierarchicalTaskIdAsync(subtasksIDs);
					await tmai.convertSubtaskToTaskAsync(subtaskId);
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

			if (tmaiDeleteTasksMenu === "back") {
				return await tmaiManageAsync();
			}

			const { mainIDs, subtasksIDs } = await tmai.getAllTaskIdsAsync(tasks);
			const tag = await askTaskTagAsync();

			switch (tmaiDeleteTasksMenu) {
				case "tmai-deletetask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const taskId = await askTaskIdAsync(mainIDs);
					await tmai.deleteTaskAsync(taskId, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-deletesubtask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const subtaskId = await askHierarchicalTaskIdAsync(subtasksIDs);
					await tmai.deleteSubtaskAsync(subtaskId, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-deleteallsubtasksfromtask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const taskId = await askTaskIdAsync(mainIDs);
					await tmai.deleteAllSubtasksFromTaskAsync(taskId, tag);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-deletealldepssafelyfromtask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const taskId = await askHybridTaskIdAsync(mainIDs, subtasksIDs);
					await tmai.deleteAllDepsSafelyFromTaskAsync(taskId);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
				case "tmai-deletealldepsunsafefromtask": {
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					const taskId = await askHybridTaskIdAsync(mainIDs, subtasksIDs);
					await tmai.deleteAllDepsUnsafeFromTaskAsync(taskId);
					tasks = await tmai.getTasksContentAsync();
					await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
					break;
				}
			}
			break;
		}
		default:
			console.log("Invalid option selected.");
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiManageAsync();
}

/**
 * @description Handles the dependencies menu for task management. This function prompts the user to
 * select an operation related to task dependencies, such as adding, validating, or fixing
 * dependencies. Based on the user's choice, it executes the corresponding operation.
 */
export async function tmaiDependenciesAsync() {
	let tasks = await tmai.getTasksContentAsync();
	const { tmaiDepsMenu } = await inquirer.prompt(tmaiDepsMenu_prompt);

	if (tmaiDepsMenu === "back") {
		return taskmasterCLI();
	}

	const { mainIDs, subtasksIDs } = await tmai.getAllTaskIdsAsync(tasks);

	switch (tmaiDepsMenu) {
		case "tmai-adddeps": {
			await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
			const taskId = await askHybridTaskIdAsync(
				mainIDs,
				subtasksIDs,
				"Select the task ID to which you want to add dependencies (integer or hierarchical):",
			);
			const multipleTaskIds = await askMultipleTaskIdAsync(
				mainIDs,
				subtasksIDs,
				"Select the dependencies IDs to add (comma-separated):",
			);
			await tmai.addDependencyAsync(taskId, multipleTaskIds);
			tasks = await tmai.getTasksContentAsync();
			await tmai.listAsync(tasks, TASKS_STATUSES.join(","), true, true);
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
		default:
			console.log("Invalid option selected.");
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiDependenciesAsync();
}

/**
 * @description Handles the analysis, report and documentation menu for task management.
 * This function prompts the user to select an operation related to task complexity
 * analysis, report, and documentation, such as analyzing task complexity, showing
 * the complexity report, or synchronizing the README file. Based on the user's
 * choice, it executes the corresponding operation.
 */
export async function tmaiAnalysisReportDocsAsync() {
	const { tmaiAnalysisReportDocsMenu } = await inquirer.prompt(
		tmaiAnalysisReportDocs_prompt,
	);

	if (tmaiAnalysisReportDocsMenu === "back") {
		return taskmasterCLI();
	}

	switch (tmaiAnalysisReportDocsMenu) {
		case "tmai-analyze": {
			const research = await askAdvancedResearchConfirmationAsync();
			const tag = await askTaskTagAsync();
			await tmai.analyzeComplexityAsync(research, tag);
			break;
		}
		case "tmai-report": {
			const tag = await askTaskTagAsync();
			await tmai.showComplexityReportAsync(tag);
			break;
		}
		case "tmai-sync": {
			const withSubtasks = await askWithSubtasksAsync();
			const tag = await askTaskTagAsync();
			await tmai.syncReadmeAsync(withSubtasks, tag);
			break;
		}
		default:
			console.log("Invalid option selected.");
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiAnalysisReportDocsAsync();
}

/**
 * @description This function prompts the user to select an operation related to backup, restore, and clearing data,
 * such as creating a backup, restoring a backup, clearing all dependencies, clearing all subtasks,
 * or clearing all tasks. Based on the user's choice, it executes the corresponding operation.
 */
export async function tmaiBackupRestoreClearAsync() {
	const { tmaiBackupRestoreClearMenu } = await inquirer.prompt(
		tmaiBackupRestoreClearClear_prompt,
	);

	if (tmaiBackupRestoreClearMenu === "back") {
		return taskmasterCLI();
	}

	switch (tmaiBackupRestoreClearMenu) {
		case "tmai-backup": {
			const slot = await askBackupSlotAsync();
			const { confirm } = await inquirer.prompt({
				type: "confirm",
				name: "confirm",
				message: chalk.yellow(
					`Are you sure you want to create a backup in slot ${slot}?`,
				),
				default: false,
			});

			if (confirm) {
				await tmai.backupAsync(slot);
			} else {
				console.log("Backup operation cancelled!");
			}
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
		case "tmai-clearalldeps": {
			await tmai.clearAllDepsAsync();
			break;
		}
		case "tmai-clearallsubtasks": {
			await tmai.clearAllSubtasksAsync();
			break;
		}
		case "tmai-clearall": {
			await tmai.clearAllTasksAsync();
			break;
		}
		default:
			console.log("Invalid option selected.");
	}

	await tmai.countdownAsync(DEFAULT_COUNTDOWN);
	await tmaiBackupRestoreClearAsync();
}
