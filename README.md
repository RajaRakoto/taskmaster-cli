# taskmaster-cli 🧩

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com) [![forthebadge](https://rajarakoto.github.io/github-docs/badge/build-by.svg)](https://forthebadge.com)

![Git](https://img.shields.io/badge/-Git-777?style=flat&logo=git&logoColor=F05032&labelColor=ffffff) ![GitHub](https://img.shields.io/badge/-GitHub-777?style=flat&logo=github&logoColor=777&labelColor=ffffff)

**TaskMaster CLI** is an interactive command-line interface for managing complex projects with TaskMaster AI. It wraps task-master-ai core commands with an intuitive menu-driven interface, supporting task generation from PRDs, hierarchical task decomposition, cross-tag organization, AI research, dependency management, and multi-provider AI orchestration.

**TaskMaster AI** is an advanced AI agent orchestrator that maintains long-term context across large-scale projects, automates PRD creation and task breakdown, and supports multiple AI providers (Anthropic, OpenAI, Google, Groq, xAI, OpenRouter, Mistral, Azure, Ollama) with multi-role configuration (main, research, fallback).

- **Website**: [task-master.dev](https://www.task-master.dev)
- **GitHub**: [claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Discord**: [TaskMaster AI Community](https://discord.com/invite/taskmasterai)

---

## 🚀 Getting Started

## Prerequisites

- Node.js 18+ or Bun 1.0+
- TaskMaster AI Core v0.43.1+ (installed via CLI setup or manually)
- API keys for at least one AI provider (see Configuration)

## Installation

```bash
npm install -g @raja-rakoto/taskmaster-cli
# or
bun install -g @raja-rakoto/taskmaster-cli
```

## Configuration

Create a `.env` file in your project root with API keys for your chosen providers:

```env
# Anthropic (Claude models)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (GPT models)
OPENAI_API_KEY=sk-...

# Google (Gemini models)
GOOGLE_API_KEY=...

# Groq (Llama models - free tier available)
GROQ_API_KEY=gsk_...

# xAI (Grok models)
XAI_API_KEY=...

# OpenRouter (multi-model aggregator)
OPENROUTER_API_KEY=sk-or-...

# Mistral
MISTRAL_API_KEY=...

# Azure OpenAI
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://...

# Ollama (local models, no key needed)
OLLAMA_BASE_URL=http://localhost:11434

# Claude Code (local, no key needed)
# Uses local Claude Code installation

# Task Master Tools Mode (optional)
TASK_MASTER_TOOLS=all
```

**TASK_MASTER_TOOLS modes:**
- `all` - All available tools (default)
- `standard` - Core + research + tags
- `core` - Basic CRUD operations only

**Supported Providers:**
- `anthropic` - Claude Haiku, Sonnet, Opus
- `openai` - GPT-4, GPT-4 Turbo, GPT-3.5
- `google` - Gemini Pro, Gemini 1.5
- `groq` - Llama 3.3 70B, Llama 3.1 8B, DeepSeek R1
- `xai` - Grok models
- `openrouter` - 200+ models via aggregator
- `mistral` - Mistral Small, Medium, Large
- `azure` - Azure OpenAI deployment
- `ollama` - Local models (Llama, Mistral, etc.)
- `claude-code` - Local Claude Code (no API key)
- `claude-codex` - Claude Codex (no API key)

## Workflow

1. **Initialize** - Set up project, configure AI models, select language
2. **Generate** - Parse PRD and auto-generate tasks with AI
3. **Manage** - CRUD operations, show multiple tasks, manage statuses
4. **Organize** - Create tags, move tasks across tags, manage workstreams
5. **Research** - Execute AI research queries with optional project context
6. **Dependencies** - Add, validate, and manage task dependencies
7. **Analyze** - Generate complexity reports and documentation
8. **Backup** - Save/restore project state across slots

## Command Tree

```
TaskMaster CLI
├── 1. Initialize & Configuration
│   ├── Install/Upgrade TaskMaster AI
│   ├── Initialize project
│   ├── Configure AI models (interactive)
│   ├── Configure AI models (quick)
│   ├── Set response language
│   └── Add editor rules
│
├── 2. Generate & Decompose
│   ├── Generate tasks from PRD (AI)
│   ├── Generate task files
│   └── Decompose all tasks (AI)
│
├── 3. Manage Tasks (CRUD)
│   ├── List & Navigate
│   │   ├── List tasks
│   │   ├── Show task details
│   │   ├── Show next task
│   │   └── Show multiple tasks (comma-separated IDs)
│   │
│   ├── Add Tasks
│   │   ├── Add task (AI)
│   │   ├── Add tasks from PRD (AI)
│   │   ├── Add subtask (AI)
│   │   └── Add subtask (manual)
│   │
│   ├── Update Tasks
│   │   ├── Update task (AI)
│   │   ├── Update multiple tasks (AI)
│   │   ├── Update subtask (AI)
│   │   ├── Update task/subtask status
│   │   ├── Convert task to subtask
│   │   └── Convert subtask to task
│   │
│   └── Delete Tasks
│       ├── Delete task (with subtasks)
│       ├── Delete subtask
│       ├── Delete all subtasks from task
│       ├── Delete all dependencies (safe)
│       └── Delete all dependencies (unsafe)
│
├── 4. Dependencies
│   ├── Add dependency
│   ├── Validate dependencies
│   └── Fix dependencies
│
├── 5. Tags & Workstreams
│   ├── List tags
│   ├── Add tag
│   ├── Use tag (switch context)
│   ├── Rename tag
│   ├── Copy tag
│   ├── Remove tag
│   └── Move task(s) to another tag
│       ├── --from-tag (source tag)
│       ├── --to-tag (destination tag)
│       ├── --with-dependencies (move related tasks)
│       └── --ignore-dependencies (skip validation)
│
├── 6. Research
│   ├── Enter research query
│   ├── Add optional context
│   └── Include project file tree
│
├── 7. Analysis & Reports
│   ├── Analyze task complexity
│   ├── Show complexity report
│   └── Sync tasks with README.md
│
├── 8. Backup & Restore
│   ├── Backup tasks (slot 1-3)
│   ├── Restore tasks (slot 1-3)
│   ├── Clear all dependencies
│   ├── Clear all subtasks
│   └── Clear all tasks + files
│
└── 9. Exit
```

---

## 🗺️ Roadmap

- [ ] Automatic dependency regeneration
- [ ] Enhanced tag filtering and search
- [ ] Task templates and reusable workflows

---

## ❤️ Contributing

Contributions welcome! Report issues, suggest features, or submit PRs to improve TaskMaster CLI or TaskMaster AI Core.

## Development

### Scripts

**Core**
- `bun run build` - Compile TypeScript
- `bun run start` - Run CLI
- `bun run dev` - Development mode with watch
- `bun run test` - Run test suite
- `bun run type-check` - TypeScript type checking

**Code Quality**
- `bun run biome:check` - Check formatting/linting
- `bun run biome:fix` - Auto-fix formatting/linting
- `bun run biome:unsafe` - Apply risky fixes

**Maintenance**
- `bun run clean` - Remove build artifacts
- `bun run pkg-check` - Check for unused dependencies
- `bun run pkg-upgrade` - Upgrade dependencies (interactive)

### Project Structure

```
src/
├── core/              # Business logic
│   ├── TaskMaster.ts  # Main task management
│   ├── exec.ts        # Command handlers
│   └── asks.ts        # Interactive prompts
├── constants/         # Configuration
├── utils/             # Utilities
├── prompt.ts          # Menu definitions
├── @types/            # Type definitions
└── index.ts           # Entry point
```

### Testing

Tests colocate with source files using `.test.ts` suffix:

```bash
bun run test           # Run all tests
bun run test --watch   # Watch mode
```

### Build Target

Targets Node.js with shebang `#!/usr/bin/env node` for maximum compatibility. Install via npm, pnpm, or bun:

```bash
npm install -g @raja-rakoto/taskmaster-cli
pnpm install -g @raja-rakoto/taskmaster-cli
bun install -g @raja-rakoto/taskmaster-cli
```

**Note for local registry testing:** Clear Bun cache to avoid version conflicts:

```bash
rm -rf ~/.bun/_bun ~/.bun/install/cache/
```
