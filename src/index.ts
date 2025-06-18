/* libs */
import inquirer from "inquirer";
import { Command } from "commander";

/* core */
import {
	tmaiInitAsync,
	tmaiGenAsync,
	tmaiManageAsync,
} from "@/core/taskmaster/exec";

/* utils */
import { bannerRendererAsync } from "@/utils/ascii";
import { exitCLI } from "@/utils/extras";

/* prompt */
import { mainMenu_prompt } from "@/prompt";

/* files */
import pkg from "../package.json";

// ==============================

/**
 * @description Entry point of the CLI
 */
export async function taskmasterCLI(): Promise<void> {
	// show banner
	const banner = await bannerRendererAsync(
		"TaskMaster-CLI",
		`${pkg.description}`,
	);
	console.log(`${banner}\n`);

	// start menu
	const choice = await inquirer.prompt(mainMenu_prompt);

	// switch menu
	switch (choice.mainMenu) {
		case "tmai-init":
			await tmaiInitAsync();
			break;
		case "tmai-gen":
			await tmaiGenAsync();
			break;
		case "tmai-manage":
			await tmaiManageAsync();
			break;
		case "tmai-deps":
			console.log("TM operations for dependencies ...");
			break;
		case "tmai-analysis":
			console.log("TM operations for analysis ...");
			break;
		case "tmai-docs":
			console.log("TM operations for documentation ...");
			break;
		case "tmai-dev":
			console.log("TM operations for development ...");
			break;
		case "exit":
			exitCLI();
			break;
		default:
			taskmasterCLI();
			break;
	}
}

function args(): void {
	const packageVersion = pkg.version;
	const program = new Command();
	program.option("-v, --version", "show CLI version");
	program.parse(process.argv);
	if (program.opts().version) {
		console.log(`version ${packageVersion}`);
	} else {
		taskmasterCLI();
	}
}

args();
