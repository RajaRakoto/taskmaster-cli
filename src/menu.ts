/* libs */
import inquirer from "inquirer";
import chalk from "chalk";
import * as emoji from "node-emoji";


// ==============================
// Main Menu
// ==============================

export const menu_prompt = [
  {
    type: "list",
    name: "menu",
    message: chalk.green("What do you want to do ..."),
    loop: false,
    pageSize: 15,
    choices: [
      {
        name: `${emoji.get("gear")} Initialization and Configuration`,
        value: "tm-init",
      },
      {
        name: `${emoji.get("gear")} Task Generation`,
        value: "tm-gen",
      },
      {
        name: `${emoji.get("gear")} Task Management`,
        value: "tm-manage",
      },
      {
        name: `${emoji.get("gear")} Dependencies`,
        value: "tm-deps",
      },
      {
        name: `${emoji.get("gear")} Analysis and Decomposition`,
        value: "tm-analysis",
      },
      {
        name: `${emoji.get("gear")} Documentation`,
        value: "tm-docs",
      },
    ],
  },
];

// ==============================
// Initialization and Configuration Menu
// ==============================

export const menu_tm_init = [
  {
    type: "list",
    name: "menu_tm_init",
    message: chalk.green("Initialization and Configuration Operations"),
    loop: false,
    pageSize: 10,
    choices: [
      new inquirer.Separator("=== Initialization and Configuration ==="),
      {
        name: `${emoji.get("rocket")} Global installation for TaskMaster AI`,
        value: "tm-init-install",
      },
      {
        name: `${emoji.get("key")} Configure API keys in .env`,
        value: "tm-init-config-env",
      },
      {
        name: `${emoji.get("file_folder")} Create a new project`,
        value: "tm-init-new-project",
      },
      {
        name: `${emoji.get("robot")} Configure AI models`,
        value: "tm-init-models-setup",
      },
      {
        name: `${emoji.get("crown")} Set main model`,
        value: "tm-init-set-main-model",
      },
      {
        name: `${emoji.get("mag")} Set research model`,
        value: "tm-init-set-research-model",
      },
      {
        name: `${emoji.get("ambulance")} Set fallback model`,
        value: "tm-init-set-fallback-model",
      },
    ],
  },
];

// ==============================
// Task Generation Menu
// ==============================

export const menu_tm_gen = [
  {
    type: "list",
    name: "menu_tm_gen",
    message: chalk.green("Task Generation Operations"),
    loop: false,
    pageSize: 7,
    choices: [
      new inquirer.Separator("=== Task Generation ==="),
      {
        name: `${emoji.get("page_facing_up")} Generate tasks from PRD`,
        value: "tm-gen-parse-prd",
      },
      {
        name: `${emoji.get("file_directory")} Generate task files`,
        value: "tm-gen-generate",
      },
    ],
  },
];

// ==============================
// Task Management Menu
// ==============================

export const menu_tm_manage = [
  {
    type: "list",
    name: "menu_tm_manage",
    message: chalk.green("Task Management Operations"),
    loop: false,
    pageSize: 30,
    choices: [
      new inquirer.Separator("=== Display and Navigation ==="),
      {
        name: `${emoji.get("clipboard")} List tasks`,
        value: "tm-manage-list",
      },
      {
        name: `${emoji.get("mag_right")} Show task details`,
        value: "tm-manage-show",
      },
      {
        name: `${emoji.get("arrow_forward")} Show next task`,
        value: "tm-manage-next",
      },

      new inquirer.Separator("=== Adding Tasks ==="),
      {
        name: `${emoji.get("heavy_plus_sign")} Add task with AI`,
        value: "tm-manage-add-task-ai",
      },
      {
        name: `${emoji.get("link")} Add task with dependencies`,
        value: "tm-manage-add-task-deps",
      },
      {
        name: `${emoji.get("nesting_dolls")} Add existing task as subtask`,
        value: "tm-manage-add-subtask-existing",
      },
      {
        name: `${emoji.get("baby")} Add manual subtask`,
        value: "tm-manage-add-subtask-manual",
      },

      new inquirer.Separator("=== Modifying Tasks ==="),
      {
        name: `${emoji.get("pencil2")} Update task`,
        value: "tm-manage-update-task",
      },
      {
        name: `${emoji.get("arrows_counterclockwise")} Update multiple tasks`,
        value: "tm-manage-update-multiple",
      },
      {
        name: `${emoji.get("memo")} Update subtask`,
        value: "tm-manage-update-subtask",
      },

      new inquirer.Separator("=== Deleting Tasks ==="),
      {
        name: `${emoji.get("wastebasket")} Delete task`,
        value: "tm-manage-remove-task",
      },
      {
        name: `${emoji.get("boom")} Delete task permanently`,
        value: "tm-manage-remove-task-permanent",
      },
      {
        name: `${emoji.get("scissors")} Delete subtask`,
        value: "tm-manage-remove-subtask",
      },
      {
        name: `${emoji.get("recycle")} Convert subtask to task`,
        value: "tm-manage-remove-subtask-convert",
      },
      {
        name: `${emoji.get("broom")} Clear subtasks from task`,
        value: "tm-manage-clear-subtasks",
      },
      {
        name: `${emoji.get("fire")} Clear all subtasks`,
        value: "tm-manage-clear-subtasks-all",
      },

      new inquirer.Separator("=== Status Tracking ==="),
      {
        name: `${emoji.get("hourglass")} Mark as pending`,
        value: "tm-manage-set-status-pending",
      },
      {
        name: `${emoji.get("hammer_and_wrench")} Mark as in progress`,
        value: "tm-manage-set-status-in-progress",
      },
      {
        name: `${emoji.get("white_check_mark")} Mark as done`,
        value: "tm-manage-set-status-done",
      },
      {
        name: `${emoji.get("eye")} Mark for review`,
        value: "tm-manage-set-status-review",
      },
      {
        name: `${emoji.get("x")} Mark as cancelled`,
        value: "tm-manage-set-status-cancelled",
      },
      {
        name: `${emoji.get("calendar")} Mark as deferred`,
        value: "tm-manage-set-status-deferred",
      },
    ],
  },
];

// ==============================
// Dependencies Menu
// ==============================

export const menu_tm_deps = [
  {
    type: "list",
    name: "menu_tm_deps",
    message: chalk.green("Dependency Management Operations"),
    loop: false,
    pageSize: 7,
    choices: [
      new inquirer.Separator("=== Dependencies ==="),
      {
        name: `${emoji.get("paperclip")} Add dependency`,
        value: "tm-deps-add",
      },
      {
        name: `${emoji.get("broken_heart")} Remove dependency`,
        value: "tm-deps-remove",
      },
      {
        name: `${emoji.get("magnifying_glass_tilted_left")} Validate dependencies`,
        value: "tm-deps-validate",
      },
      {
        name: `${emoji.get("wrench")} Fix dependencies`,
        value: "tm-deps-fix",
      },
    ],
  },
];

// ==============================
// Analysis and Decomposition Menu
// ==============================

export const menu_tm_analysis = [
  {
    type: "list",
    name: "menu_tm_analysis",
    message: chalk.green("Analysis and Decomposition Operations"),
    loop: false,
    pageSize: 7,
    choices: [
      new inquirer.Separator("=== Analysis and Decomposition ==="),
      {
        name: `${emoji.get("bar_chart")} Analyze task complexity`,
        value: "tm-analysis-complexity",
      },
      {
        name: `${emoji.get("page_with_curl")} Show complexity report`,
        value: "tm-analysis-complexity-report",
      },
      {
        name: `${emoji.get("fork_and_knife")} Decompose task`,
        value: "tm-analysis-expand",
      },
      {
        name: `${emoji.get("factory")} Decompose all tasks`,
        value: "tm-analysis-expand-all",
      },
    ],
  },
];

// ==============================
// Documentation Menu
// ==============================

export const menu_tm_docs = [
  {
    type: "list",
    name: "menu_tm_docs",
    message: chalk.green("Documentation Operations"),
    loop: false,
    pageSize: 7,
    choices: [
      new inquirer.Separator("=== Documentation ==="),
      {
        name: `${emoji.get("books")} Sync tasks with README.md`,
        value: "tm-docs-sync-readme",
      },
    ],
  },
];
