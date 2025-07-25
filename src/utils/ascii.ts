/* libs */
import figlet from "figlet";
import chalk from "chalk";

/* files */
import pkg from "../../package.json";

/* constants */
import { DEV_MODE, FONT_PATH } from "@/constants";

/* utils */
import { resolveRealPathAsync, readFileAsync } from "@/utils/extras";

// ==============================

/**
 * @description A function that renders a title + description as a banner using figlet ASCII art
 * @param title The title to render
 * @param description The description to render
 */
export async function bannerRendererAsync(
	title: string,
	description: string,
): Promise<string> {
	const fontSource = DEV_MODE
		? FONT_PATH
		: await resolveRealPathAsync(FONT_PATH);
	const font = await readFileAsync(fontSource, "utf8");
	figlet.parseFont("StandardFont", font);

	return new Promise((resolve, reject) => {
		try {
			const rendered = figlet.textSync(title, {
				font: "StandardFont" as figlet.Fonts,
			});
			const coloredBanner = chalk.magenta(rendered);
			const packageVersion = pkg.version;
			const result = `${coloredBanner}\n ${chalk.underline("version:")} ${packageVersion}${DEV_MODE ? ` ${chalk.yellow("(dev mode)")}` : ""}\n\n ${description}`;
			resolve(result);
		} catch (error) {
			reject(
				`[error]: an error occurred while rendering the banner: \n${error}`,
			);
		}
	});
}
