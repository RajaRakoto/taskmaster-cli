/* libs */
import inquirer from "inquirer";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";
import { restartAsync } from "@/core/restart";

/* prompt */
import { tmaiInitMenu_prompt } from "@/prompt";

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
