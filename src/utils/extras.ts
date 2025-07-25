/* libs */
import * as emoji from "node-emoji";
import * as path from "node:path";
import open from "open";
import util from "node:util";
import fs from "node:fs";
import { execa } from "execa";

/* constants */
import { DEV_MODE } from "@/constants";

// ==============================

export const writeFileAsync = util.promisify(fs.writeFile);
export const existsAsync = util.promisify(fs.exists);
export const readFileAsync = util.promisify(fs.readFile);
export const readDirAsync = util.promisify(fs.readdir);
export const realPathAsync = util.promisify(fs.realpath);
export const mkdirAsync = util.promisify(fs.mkdir);
export const rmdirAsync = util.promisify(fs.rm);

/**
 * @description A function that exits the CLI
 */
export function exitCLI(): void {
	console.log(`See you soon ${emoji.get("blush")}`);
	process.exit();
}

/**
 * @description A function that resolves the real path of a file
 * @param relativePath The relative path of the file
 * @returns The real path of the file
 */
export async function resolveRealPathAsync(
	relativePath: string,
): Promise<string> {
	try {
		const sourceIndex = await realPathAsync(process.argv[1]);
		const realPath = path.join(path.dirname(sourceIndex), relativePath);
		return realPath;
	} catch (error) {
		throw new Error(`[error]: error during resolving real path: \n${error}`);
	}
}

/**
 * @description A function that opens a file using the default application
 * @param filePath The path of the file to open
 */
export async function defaultOpenAsync(filePath: string): Promise<void> {
	try {
		const platform = process.platform;
		const realPath = DEV_MODE ? filePath : await resolveRealPathAsync(filePath);
		let execCMD = "";

		switch (platform) {
			case "win32":
				execCMD = "start";
				break;
			case "darwin":
				execCMD = "open";
				break;
			case "linux":
			case "freebsd":
			case "openbsd":
			case "sunos":
				execCMD = "xdg-open";
				break;
			default:
				throw new Error("[error]: unsupported os");
		}

		execCMD === "start"
			? await open(realPath)
			: await execa(execCMD, [realPath]);
	} catch (error) {
		throw new Error(`[error]: error during opening: \n${error}`);
	}
}

/**
 * @description A function to copy a file from source to target
 * @param source The source file
 * @param target The target file
 */
export async function copyFileAsync(
	source: string,
	target: string,
): Promise<void> {
	try {
		const realSource = DEV_MODE ? source : await resolveRealPathAsync(source);
		const targetDir = path.resolve(path.join(process.cwd(), target));

		if (!fs.existsSync(targetDir)) {
			await mkdirAsync(targetDir, { recursive: true });
		}

		const targetFile = path.join(targetDir, path.basename(source));
		fs.copyFileSync(realSource, targetFile);
	} catch (error) {
		throw new Error(`[error]: error during copying file: \n${error}`);
	}
}

/**
 * @description This function creates the directory as argument from the current directory
 * @param directory The directory to create
 */
export async function createDirectoryAsync(directory: string): Promise<void> {
	try {
		const targetDir = path.resolve(path.join(process.cwd(), directory));

		if (!fs.existsSync(targetDir)) {
			await mkdirAsync(targetDir, { recursive: true });
		}
	} catch (error) {
		throw new Error(`[error]: error during creating directory: \n${error}`);
	}
}

/**
 * @description Write content to a file
 * @param destination The path to the file to write
 * @param content The content to write to the file
 * @param successMessage The message to display if the file is written successfully
 */
export async function writeToFileAsync(
	destination: string,
	content: string,
	successMessage: string,
): Promise<void> {
	try {
		const fileExists = await existsAsync(destination);
		let finalContent = content;

		if (fileExists) {
			const existingContent = await readFileAsync(destination, "utf8");
			finalContent = existingContent + content;
		}

		await writeFileAsync(destination, finalContent);
		console.log(successMessage);
	} catch (error) {
		throw new Error(
			`[error]: an error occurred while writing the file: \n${error}`,
		);
	}
}

/**
 * @description Read the content from a file
 * @param filePath The path to the file to read
 */
export async function readFromFileAsync(filePath: string): Promise<string> {
	try {
		const realPath = DEV_MODE ? filePath : await resolveRealPathAsync(filePath);
		const content = await readFileAsync(realPath, "utf8");
		return content;
	} catch (error) {
		throw new Error(`[error]: error during reading file: \n${error}`);
	}
}

/**
 * @description Run a command with its arguments and inherit stdio
 * @param command The command to run
 * @param args The arguments to pass to the command
 * @param interactiveMode Whether to run the command in interactive mode (inherit stdio)
 * @param shellMode Whether to run the command in shell mode
 */
export async function runCommandAsync(
	command: string,
	args: string[],
	interactiveMode: boolean,
	shellMode: boolean,
): Promise<void> {
	await execa(command, args, {
		stdio: interactiveMode ? "inherit" : ["pipe", "inherit", "inherit"],
		input: interactiveMode ? undefined : process.stdin, // Inherit input if in interactive mode
		shell: shellMode, // Use shell mode if specified
		env: process.env, // Inherit environment variables
		cleanup: true, // Cleanup resources after execution
		preferLocal: false, // Prefer global installation of task-master
		windowsHide: false, // Hide the console window on MS Windows
		buffer: false, // Disable output buffering
	});
}

/**
 * @description Read a JSON file
 * @param filePath The path to the JSON file
 */
export async function readJsonFileAsync<T = unknown>(
	filePath: string,
): Promise<T> {
	try {
		const fileExists = fs.existsSync(filePath);
		if (!fileExists) {
			await writeFileAsync(filePath, JSON.stringify([]));
		}
		const data = await readFileAsync(filePath, "utf-8");
		return JSON.parse(data) as T;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`[error]: error during reading file: \n${error.message}`);
		}
		throw error;
	}
}
