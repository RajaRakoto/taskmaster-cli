# taskmaster-cli 🧩

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com) [![forthebadge](https://rajarakoto.github.io/github-docs/badge/build-by.svg)](https://forthebadge.com)

![Git](https://img.shields.io/badge/-Git-777?style=flat&logo=git&logoColor=F05032&labelColor=ffffff) ![GitHub](https://img.shields.io/badge/-GitHub-777?style=flat&logo=github&logoColor=777&labelColor=ffffff)

**TaskMaster CLI** is an interactive command-line interface designed to simplify the management of complex projects using **TaskMaster AI**.

## About TaskMaster AI

**TaskMaster AI** is an advanced AI agent orchestrator for complex project management, especially in software development. It prevents context loss often seen in traditional AI tools during large-scale projects by maintaining long-term context. TaskMaster AI automates PRD creation, task breakdown, and planning, guiding AI agents to implement tasks coherently. It supports multiple AI providers (OpenAI, Anthropic, Google Gemini, etc.) and features a multi-role configuration (main, research, fallback) to optimize AI resource allocation.

- **Website**: [task-master.dev](https://www.task-master.dev)
- **GitHub**: [claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Discord**: [TaskMaster AI Community](https://discord.com/invite/taskmasterai)

## Why TaskMaster CLI?

TaskMaster CLI was created to streamline the use of TaskMaster AI with an intuitive and interactive interface. It aims to:

- **Simplify Usage**: Hide the complexity of underlying commands behind a user-friendly interactive interface.
- **Preserve Core Logic**: Operate as a wrapper without altering the core system of TaskMaster AI.
- **Automate Workflows**: Optimize common operations to reduce manual intervention.
- **Enhance Flexibility**: Provide new features for managing tasks, dependencies, and processing order.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: `v22.8.0` or higher
-   **TaskMaster AI Core**: You can install it via the interactive CLI setup or manually. The minimum required version is `v0.23.0` or higher.

### Installation

Install TaskMaster CLI globally on your system:

```bash
npm install -g taskmaster-cli
```

### Configuration

TaskMaster CLI requires API keys to communicate with various AI providers.

1.  Create a `.env` file in the root of your project by copying/renaming the `.env.example` file:
2.  Open the `.env` file and add your API keys.

    ```dotenv
    # API Keys (Required to enable respective provider)
    ANTHROPIC_API_KEY="your_anthropic_api_key_here"       # Required: Format: sk-ant-api03-...
    PERPLEXITY_API_KEY="your_perplexity_api_key_here"     # Optional: Format: pplx-...
    OPENAI_API_KEY="your_openai_api_key_here"             # Optional, for OpenAI/OpenRouter models. Format: sk-proj-...
    GOOGLE_API_KEY="your_google_api_key_here"             # Optional, for Google Gemini models.
    GEMINI_API_KEY="your_gemini_api_key_here"
    MISTRAL_API_KEY="your_mistral_key_here"               # Optional, for Mistral AI models.
    XAI_API_KEY="YOUR_XAI_KEY_HERE"                       # Optional, for xAI AI models.
    AZURE_OPENAI_API_KEY="your_azure_key_here"            # Optional, for Azure OpenAI models (requires endpoint in .taskmaster/config.json).
    OLLAMA_API_KEY="your_ollama_api_key_here"             # Optional: For remote Ollama servers that require authentication.
    GITHUB_API_KEY="your_github_api_key_here"             # Optional: For GitHub import/export features. Format: ghp_... or github_pat_...
    OPENROUTER_API_KEY="your_openrouter_api_key_here"     # Optional: For OpenRouter models. Format: sk-proj-...
    ```

### Standard Workflow

1.  **Initialize a new project** using the dedicated command.
2.  **Configure your AI models** (main, research, fallback) and response language.
3.  **Generate tasks automatically** from a PRD file (text or Markdown).
4.  **Generate the associated task files**.
5.  **Break down main tasks into subtasks** for better granularity.
6.  **Manage project progress** through the interactive CLI, including CRUD operations, dependency management, complexity analysis, reporting, and more.

https://github.com/user-attachments/assets/685afcc9-b6c9-406c-8485-7151a27dbe35

https://github.com/user-attachments/assets/99d46178-a93c-441d-82e7-2ec1dd508dc5

https://github.com/user-attachments/assets/bf553b97-a11b-4cfc-9337-9877e954c0c7

https://github.com/user-attachments/assets/44337fb8-a5a9-4709-9a65-1dc0bdd86181

https://github.com/user-attachments/assets/aa7334d6-7653-476d-8b65-f222f8273845

https://github.com/user-attachments/assets/fdb884c1-1f56-468e-985b-3977158dcb9e

---

## ✨ Features

TaskMaster CLI provides a comprehensive set of features to manage your entire project lifecycle.

### Functional Scope

-   **Initialization & Configuration**:
    -   Global package installation.
    -   Create new TaskMaster projects.
    -   Define main, research, and fallback AI models.
    -   Set the response language.
-   **Task Generation & Decomposition**:
    -   Generate tasks from a PRD (txt, markdown).
    -   Generate task files.
    -   Automatically decompose tasks into subtasks.
-   **Task Management (CRUD)**:
    -   **View**: Tree display, status filtering, detailed view, and show next task.
    -   **Add**: Add tasks/subtasks via AI prompts or from a PRD.
    -   **Update**: Modify tasks/subtasks, manage statuses, and convert between tasks and subtasks.
    -   **Delete**: Remove tasks, subtasks, and dependencies.
-   **Dependency Management**:
    -   Add dependencies to tasks.
    -   Automatic validation and correction of inconsistencies.
-   **Analysis, Reporting & Documentation**:
    -   Complexity evaluation.
    -   Report generation.
    -   Synchronization with documentation.
-   **Backup, Restore & Cleanup**:
    -   Save and restore the state of all tasks and configurations.
    -   Massively clean up data (tasks, subtasks, dependencies).

### Command Tree

```
TMAI-CLI
├── 🚀 Initialization and Configuration
│   ├── 📦 1 - Install/Upgrade TMAI
│   ├── ✨ 2 - Initialize TMAI | Update/Fix rules
│   ├── 🔧 3 - Configure AI models (interactive)
│   ├── ⏩ Configure AI models (quickly)
│   └── 🌐 4 - Set response language
│
├── 📄 Generation and Decomposition
│   ├── 📓 1 - Generate tasks from PRD (AI)
│   ├── 📄 2 - Generate task files from tasks.json
│   └── 🏭 3 - Decompose all tasks (AI)
│
├── ✅ Task Management (CRUD) 
│   ├── 🔗 List and Navigation
│   │   ├── 📋 List tasks
│   │   ├── 🔎 Show task details
│   │   └── ➡️ Show next task
│   │
│   ├── ➕ Add tasks
│   │   ├── ➕ Add task (AI)
│   │   ├── ➕ Add tasks from PRD (AI)
│   │   ├── ➕ Add subtask (AI)
│   │   └── ➕ Add subtask (manual)
│   │
│   ├── ✏️ Update tasks
│   │   ├── ✏️ Update task (AI)
│   │   ├── ✏️ Update multiple tasks (AI)
│   │   ├── ✏️ Update subtask (AI)
│   │   ├── ✏️ Update task/subtask status
│   │   ├── ✏️ Convert task to subtask
│   │   └── ✏️ Convert subtask to task
│   │
│   └── 🗑️ Delete tasks
│       ├── 🗑️ Delete task (with subtasks)
│       ├── 🗑️ Delete a subtask
│       ├── 🗑️ Delete all subtasks from a task
│       ├── 🗑️ Delete all dependencies (safe)
│       └── 🗑️ Delete all dependencies (unsafe)
│
├── 🔗 Dependencies
│   ├── 📎 Add dependency
│   ├── ✅ Validate dependencies
│   └── 🔧 Fix dependencies
│
├── 📊 Analysis, Report, Documentation
│   ├── 📊 Analyze task complexity
│   ├── 📄 Show complexity report
│   └── 📚 Sync tasks with README.md
│
├── 💾 Backup, Restore and Clear
│   ├── 💾 Backup tasks
│   ├── 🔄 Restore tasks
│   ├── 🧹 Clear all dependencies
│   ├── 🧹 Clear all subtasks (only)
│   └── 🧹 Clear all tasks + related files
│
└── 🚪 Exit
```

---

## 🗺️ Roadmap

-   [ ] Automatic dependency regeneration.
-   [ ] Ensure accuracy and consistency in tag application.

---

## ❤️ Acknowledgements & Contributing

This project would not have been possible without the **TaskMaster AI team**, as it is built entirely on their exceptional ecosystem.
We welcome contributions to improve the project! Whether you want to contribute to **TaskMaster AI Core** or **TaskMaster CLI**, feel free to make pull requests, report issues, or suggest new features.

### For Developers

The following scripts are available for developing the CLI itself.

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

### Build Target

The build configuration uses Node.js as the target (`target: "node"`) with an appropriate shebang (`#!/usr/bin/env node`) to ensure maximum compatibility across different environments. This choice provides the best balance between performance and compatibility.

The CLI can be installed using any of the following package managers according to user preference:
- npm: `npm install -g taskmaster-cli`
- pnpm: `pnpm install -g taskmaster-cli` 
- bun: `bun install -g taskmaster-cli`

**Important note for local registry testing:**
When testing the CLI with Verdaccio or a local registry, you may need to clear Bun's cache directories to avoid version conflicts. Delete the following directories:

```bash
~/.bun/_bun
~/.bun/install/cache/
```

> This ensures you're testing with the freshly published version rather than a cached one.
