# taskmaster-cli 🧩

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com) [![forthebadge](https://rajarakoto.github.io/github-docs/badge/build-by.svg)](https://forthebadge.com)

![Git](https://img.shields.io/badge/-Git-777?style=flat&logo=git&logoColor=F05032&labelColor=ffffff) ![Gitub](https://img.shields.io/badge/-Gitub-777?style=flat&logo=github&logoColor=777&labelColor=ffffff)

**Taskmaster AI** is an advanced artificial intelligence solution designed for task and project management, particularly in the field of software development. It acts as an orchestrator of AI agents, capable of maintaining long-term context and effectively managing complex, multi-step tasks. This helps prevent the context loss that often occurs with traditional AI tools during large-scale projects. Taskmaster AI automates the creation of Product Requirement Documents (PRDs), breaks down tasks, plans next steps, and guides AI agents to implement tasks in a coherent and organized manner. It supports multiple AI providers (OpenAI, Anthropic, Google Gemini, etc.) and offers a multi-role configuration (main, research, fallback) to optimize AI resource allocation based on project needs.

- **Github**: [claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Website**: [task-master.dev](https://www.task-master.dev/)

**Taskmaster CLI** was created to simplify and streamline the use of Taskmaster AI by providing an intuitive, interactive command-line interface. Instead of memorizing complex commands or navigating configuration files manually, users can easily manage AI agents, break down tasks, generate PRDs, and orchestrate project workflows step by step—all directly from the terminal. This tool makes Taskmaster AI more accessible and efficient for developers, allowing them to focus on their projects while the CLI handles the underlying complexity.

---

### 📌 Usage

This project is still in development and not yet ready for use, but you can contribute to its development by making pull requests, reporting issues, and suggesting new features ...

---

### 📌 Scripts

**Start**

- 📜 `start` - Run your application with bun.
- 📜 `start:smol` - Run your application with bun and a flag which configures the JavaScriptCore heap size to be smaller and grow slower.
- 📜 `start:bin` - Run your standalone binary app.

**Clean**

- 📜 `clean` - Remove coverage data, prod, build.

**Development**

- 📜 `dev` - Launch your application in development mode with bun.
- 📜 `dev:watch` - Interactive watch mode to automatically transpile source files with bun in development.
- 📜 `dev:hot` - Hot reloading of source files with bun in development.
- 📜 `dev:smol:watch` - Interactive watch mode to automatically transpile source files with bun in development, while using --smol flag.
- 📜 `dev:smol:hot` - Hot reloading source files with bun in development, while using --smol flag.

**Build**

- 📜 `build` - Transpile and bundle source files with bun.
- 📜 `build:watch` - Interactive watch mode to automatically transpile source files with bun.
- 📜 `build:bin` - bun's bundler implements a --compile flag for generating a standalone binary from a TypeScript or JavaScript file, use this in your production environment to ensure optimal execution of your app.

**Testing**

- 📜 `test` - Run bun test.
- 📜 `test:watch` - Interactive watch mode to automatically re-run tests with bun.

**Linting and Formatting**

- 📜 `biome:start` - Starts the Biome daemon server. You can specify a custom configuration file path using the `--config-path` option.
- 📜 `biome:stop` - Stops the Biome daemon server.
- 📜 `biome:fix` - Runs a source code check and applies automatic fixes (linter & formatter) according to the defined rules.
- 📜 `biome:unsafe` - Works like `biome:fix`, but may apply more invasive or risky changes.

**Backup and Dependency Management**

- 📜 `backup` - Backup files with Grunt.
- 📜 `pkg-check` - Check useless dependencies with depcheck.
- 📜 `pkg-upgrade` - Upgrade outdated dependencies (interactive mode) with npm-check-updates.

**Versioning**

- 📜 `versioning` - Start ungit server.

**NPM Commands**

- 📜 `npm-version:major` - Increments the major version number of your project using npm.
- 📜 `npm-version:minor` - Increments the minor version number of your project using npm.
- 📜 `npm-version:patch` - Increments the version patch number of your project using npm.
- 📜 `npm-login` - Login to a registry user account.
- 📜 `npm-publish` - Publish your npm package with public access.
- 📜 `npm-unpublish` - Forcefully unpublish the cli package from npm.
- 📜 `npm-reset:registry` - Delete the custom npm registry.
- 📜 `npm-check:registry` - Get the currently configured registry for npm.
- 📜 `npm-proxy:start` - Start a Verdaccio server with a local npm proxy.
- 📜 `npm-proxy:set-registry` - Set the npm registry to use a local proxy.
- 📜 `npm-proxy:publish` - Publish your npm package via the local proxy.
- 📜 `npm-proxy:unpublish` - Forcefully unpublish the cli package from the npm registry via the local proxy.
- 📜 `npm-proxy:republish` - Republish your npm package by first unpublishing it and then publishing it again via the local proxy.

**NVM**

- 📜 `nvm` - Manage multiple node.js versions. Easily switch between node versions per project to ensure compatibility.

**Others**

- 📜 `qtype:tasks` - Generate types for tasks.json file.

---

### 📌 Build

When using the **build.js** file in this boilerplate, it's important to note the significance of the **target** option. By default, if the target option is not specified in the **build.js** file, it will be set to `browser`. However, for projects utilizing the `bun.js` runtime environment, it's imperative to explicitly set the target to `bun`. This guarantees compatibility with the `bun` shell environment and prevents unexpected behavior. Furthermore, it's noteworthy that the `target` supports three possible values: `browser`, `bun`, and `node`, providing flexibility in defining the build target according to specific project requirements.
