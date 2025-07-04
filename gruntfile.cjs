/**
 * @description: gruntfile for taskmaster-cli
 * @requires: grunt | load-grunt-tasks | grunt-contrib-compress | grunt-shell
 */
module.exports = (grunt) => {
	require("load-grunt-tasks")(grunt);

	// all files destination (example)
	const backupsDestination = "./backups/";

	// node-glob syntax
	const includeAllFiles = ["**/*", ".*/**/*", "**/.*", "**/.*/**/*"];

	/**
	 * ~ ALL GRUNT PLUGINS CONFIG ~
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON("./package.json"),
		/**
		 * Compress files and folders (incremental backup)
		 */
		compress: {
			main: {
				options: {
					archive: `${backupsDestination}main.tar.gz`,
				},
				files: [{ src: ["./*", "./.*"] }],
				filter: "isFile",
			},
			github: {
				options: {
					archive: `${backupsDestination}github.tar.gz`,
				},
				expand: true,
				cwd: "./.github/",
				src: includeAllFiles,
				dest: "github",
			},
			docs: {
				options: {
					archive: `${backupsDestination}docs.tar.gz`,
				},
				expand: true,
				cwd: "./docs/",
				src: includeAllFiles,
				dest: "docs",
			},
			examples: {
				options: {
					archive: `${backupsDestination}examples.tar.gz`,
				},
				expand: true,
				cwd: "./examples/",
				src: includeAllFiles,
				dest: "examples",
			},
			fonts: {
				options: {
					archive: `${backupsDestination}fonts.tar.gz`,
				},
				expand: true,
				cwd: "./fonts/",
				src: includeAllFiles,
				dest: "fonts",
			},
			src: {
				options: {
					archive: `${backupsDestination}src.tar.gz`,
				},
				expand: true,
				cwd: "./src/",
				src: includeAllFiles,
				dest: "src",
			},
			tests: {
				options: {
					archive: `${backupsDestination}tests.tar.gz`,
				},
				expand: true,
				cwd: "./tests/",
				src: includeAllFiles,
				dest: "tests",
			},
			tmp: {
				options: {
					archive: `${backupsDestination}tmp.tar.gz`,
				},
				expand: true,
				cwd: "./tmp/",
				src: includeAllFiles,
				dest: "tmp",
			},
			taskmaster: {
				options: {
					archive: `${backupsDestination}taskmaster.tar.gz`,
				},
				expand: true,
				cwd: "./.taskmaster/",
				src: includeAllFiles,
				dest: "taskmaster",
			},
			roo: {
				options: {
					archive: `${backupsDestination}roo.tar.gz`,
				},
				expand: true,
				cwd: "./.roo/",
				src: includeAllFiles,
				dest: "roo",
			},
			cursor: {
				options: {
					archive: `${backupsDestination}cursor.tar.gz`,
				},
				expand: true,
				cwd: "./.cursor/",
				src: includeAllFiles,
				dest: "cursor",
			},
		},

		/**
		 * Copy dist deps
		 */
		shell: {
			copyDistDeps: {
				command: ["cp -r fonts dist"].join("&&"),
			},
		},
	});

	// all grunt register tasks
	grunt.registerTask("backup", [
		"compress:main",
		"compress:github",
		"compress:docs",
		"compress:examples",
		"compress:fonts",
		"compress:src",
		"compress:tests",
		"compress:tmp",
		"compress:taskmaster",
		"compress:roo",
		"compress:cursor",
	]);

	grunt.registerTask("copy", ["shell:copyDistDeps"]);

	// all tasks lists
	const myTasksNames = ["backup", "copy"];

	// tasks status (description)
	const myTasksStatus = [
		"compress: main | github | vscode | e2e | public | scripts | server | src | tests | tmp | taskmaster | roo | cursor",
	];

	// default tasks
	grunt.registerTask("default", () => {
		console.log(
			"\nHere are the lists of plugins (tasks) you can run with grunt:".green,
		);

		/**
		 *
		 * @param {string} taskTitle - task title (Eg: basics tasks)
		 * @param {array} taskNames - task names (Eg: basicsTaskNames)
		 * @param {array} taskStatus - task status (Eg: basicsTaskStatus)
		 * @param {string} taskTheme - colors of theme (Eg: black ,red ,green ,yellow ,blue ,magenta ,cyan ,white ,gray ,grey)
		 */
		function getTaskResume(taskTitle, taskNames, taskStatus, taskTheme) {
			switch (taskTheme) {
				case "cyan":
					console.log(`\n${taskTitle}`.cyan.inverse.bold);
					taskNames.forEach((taskNames, index) => {
						console.log(`${taskNames.cyan} -> ${taskStatus[index]}`);
					});
					break;
				case "magenta":
					console.log(`\n${taskTitle}`.magenta.inverse.bold);
					taskNames.forEach((taskNames, index) => {
						console.log(`${taskNames.magenta} -> ${taskStatus[index]}`);
					});
					break;
				case "yellow":
					console.log(`\n${taskTitle}`.yellow.inverse.bold);
					taskNames.forEach((taskNames, index) => {
						console.log(`${taskNames.yellow} -> ${taskStatus[index]}`);
					});
					break;
				case "blue":
					console.log(`\n${taskTitle}`.blue.inverse.bold);
					taskNames.forEach((taskNames, index) => {
						console.log(`${taskNames.blue} -> ${taskStatus[index]}`);
					});
					break;
				default:
					null;
					break;
			}
		}

		// task resume
		getTaskResume(
			"== TASKMASTER-CLI TASKS ==",
			myTasksNames,
			myTasksStatus,
			"blue",
		);
	});
};
