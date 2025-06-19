import { describe, expect, test } from "bun:test";
import { TaskMaster } from "../src/core/taskmaster/TaskMaster";
import type {
	I_Tasks,
	Task,
	Subtask,
	Priority,
	Status,
} from "../src/@types/tasks";
import stripAnsi from "strip-ansi";

// Helper to create test tasks
function createTask(
	id: number,
	title: string,
	status: Status = "todo",
	priority: Priority = "medium",
	subtasks: Subtask[] = [],
): Task {
	return {
		id,
		title,
		description: "",
		details: "",
		testStrategy: "",
		priority,
		dependencies: [],
		status,
		subtasks,
	};
}

function createSubtask(
	id: number,
	title: string,
	status: Status = "todo",
): Subtask {
	return {
		id,
		title,
		description: "",
		dependencies: [],
		details: "",
		status,
	};
}

describe("TaskMaster.listQuickAsync", () => {
	const tmai = new TaskMaster({
		tasksFilePath: "tasks.json",
		isTestMode: true,
	});

	test("displays a task without subtasks", async () => {
		const tasks: I_Tasks = {
			master: {
				tasks: [createTask(1, "Main task", "in-progress", "high")],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "", true);
		const plainResult = stripAnsi(result);
		expect(plainResult).toContain("Main task");
		expect(plainResult).toContain("in-progress");
		expect(plainResult).toContain("high");
		expect(plainResult).not.toContain("↳");
	});

	test("displays subtasks when withSubtasks=true", async () => {
		const tasks: I_Tasks = {
			master: {
				tasks: [
					createTask(1, "Parent", "todo", "medium", [
						createSubtask(1, "Subtask 1", "done"),
						createSubtask(2, "Subtask 2", "in-progress"),
					]),
				],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "", true);
		const plainResult = stripAnsi(result);
		expect(plainResult).toContain("↳ #1.1");
		expect(plainResult).toContain("Subtask 1");
		expect(plainResult).toContain("↳ #1.2");
		expect(plainResult).toContain("Subtask 2");
	});

	test("displays a message when no tasks match", async () => {
		const tasks: I_Tasks = {
			master: {
				tasks: [
					createTask(1, "Task 1", "done"),
					createTask(2, "Task 2", "in-progress"),
				],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "pending", true);
		const plainResult = stripAnsi(result);
		expect(plainResult).toContain("No tasks to display.");
		expect(plainResult).not.toContain("Task 1");
		expect(plainResult).not.toContain("Task 2");
	});

  test("displays priorities correctly", async () => {
    const tasks: I_Tasks = {
      master: {
        tasks: [
          createTask(1, "High", "todo", "high"),
          createTask(2, "Medium", "todo", "medium"),
          createTask(3, "Low", "todo", "low"),
        ],
        metadata: {
          created: new Date(),
          updated: new Date(),
          description: "",
        },
      },
    };

    const result = await tmai.listQuickAsync(tasks, "", true);
    const plainResult = stripAnsi(result);
    expect(plainResult).toContain("[priority: high]");
    expect(plainResult).toContain("[priority: medium]");
    expect(plainResult).toContain("[priority: low]");
  });

	test("displays a message when there are no tasks", async () => {
		const tasks: I_Tasks = {
			master: {
				tasks: [],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "", true);
		const plainResult = stripAnsi(result);
		expect(plainResult).toContain("No tasks to display.");
	});

  	test("filters by status", async () => {
		const tasks: I_Tasks = {
			master: {
				tasks: [
					createTask(1, "Task 1", "done"),
					createTask(2, "Task 2", "in-progress"),
					createTask(3, "Task 3", "blocked"),
				],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "done,blocked", true);
		const plainResult = stripAnsi(result);
		expect(plainResult).toContain("Task 1");
		expect(plainResult).toContain("Task 3");
		expect(plainResult).not.toContain("Task 2");
	});

  test("filters subtasks by status correctly", async () => {
    const tasks: I_Tasks = {
      master: {
        tasks: [
          createTask(1, "Parent Task", "todo", "medium", [
            createSubtask(1, "Subtask 1", "done"),
            createSubtask(2, "Subtask 2", "blocked"),
            createSubtask(3, "Subtask 3", "in-progress"),
          ]),
        ],
        metadata: {
          created: new Date(),
          updated: new Date(),
          description: "",
        },
      },
    };

    const result = await tmai.listQuickAsync(tasks, "done,blocked", true);
    const plainResult = stripAnsi(result);
    expect(plainResult).toContain("Parent Task");
    expect(plainResult).toContain("Subtask 1");
    expect(plainResult).toContain("Subtask 2");
    expect(plainResult).not.toContain("Subtask 3");
  });

	test("truncates long titles", async () => {
		const longTitle =
			"Task with a very long title that exceeds the character limit allowed by the application";
		const tasks: I_Tasks = {
			master: {
				tasks: [createTask(1, longTitle)],
				metadata: {
					created: new Date(),
					updated: new Date(),
					description: "",
				},
			},
		};

		const result = await tmai.listQuickAsync(tasks, "", true);
		const plainResult = stripAnsi(result);
		// Uses ellipsis character '…' to match truncate()
		expect(plainResult).toContain("…");
		expect(plainResult.length).toBeLessThan(longTitle.length + 100);
	});
});
