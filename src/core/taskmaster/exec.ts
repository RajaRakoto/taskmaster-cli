/* libs */
import inquirer from "inquirer";
import path from "node:path";
import chalk from "chalk";

/* constants */
import { PRD_PATH } from "@/constants";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";
import { restartAsync } from "@/core/restart";

/* utils */
import { existsAsync } from "@/utils/extras";

/* prompt */
import { tmaiInitMenu_prompt, tmaiGenMenu_prompt } from "@/prompt";

// ===============================

const tmai = new TaskMaster();

/*******  be6e15c7-9970-4578-baf6-d31421004679  *******/
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

export async function tmaiGenAsync() {
	const choice = await inquirer.prompt(tmaiGenMenu_prompt);

	if (choice.tmaiGenMenu === "tmai-parse") {
		const tasksJsonPath = path.join(".taskmaster", "tasks", "tasks.json");
		const { prdPath } = await inquirer.prompt({
			type: "input",
			name: "prdPath",
			message: "Enter the path to your PRD file:",
			default: PRD_PATH,
		});

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

		await tmai.parseAsync(prdPath);
	} else if (choice.tmaiGenMenu === "tmai-gen") {
		await tmai.genAsync();
	}

	await restartAsync();
}
