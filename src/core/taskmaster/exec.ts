/* libs */
import inquirer from "inquirer";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";
import { restartAsync } from "@/core/restart";

/* prompt */
import { tmaiInitMenu_prompt } from "@/prompt";

// ===============================

const tmai = new TaskMaster();

export async function tmaiInitAsync() {
	const choice = await inquirer.prompt(tmaiInitMenu_prompt);

	if (choice.tmInitMenu === "tmai-install") {
		await tmai.installAsync();
	} else if (choice.tmInitMenu === "tmai-init") {
		await tmai.initAsync();
	} else if (choice.tmInitMenu === "tmai-config") {
		await tmai.configAsync();
	}

	await restartAsync();
}
