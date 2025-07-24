/* libs */
import { describe, expect, test } from "bun:test";
import stripAnsi from "strip-ansi";

/* constants */
import { MAIN_COMMAND, MAX_TITLE_TRUNC_LENGTH } from "@/constants";

/* core */
import { TaskMaster } from "@/core/taskmaster/TaskMaster";

/* asks */
import {
	isValidTaskId,
	isValidHierarchicalTaskId,
} from "@/core/taskmaster/asks";

/* types */
import type { I_Tasks, Task, Subtask, Priority, Status } from "@/@types/tasks";

// ================================

describe("TaskMaster Class", () => {
	const tmai = new TaskMaster({
		mainCommand: MAIN_COMMAND,
		tasksFilePath: ".taskmaster/tasks/tasks.json",
		isTestMode: true,
	});

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

	describe("listQuickAsync", () => {
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

		test("displays all statuses correctly", async () => {
			const statuses: Status[] = [
				"pending",
				"in-progress",
				"done",
				"review",
				"deferred",
				"cancelled",
				"todo",
				"blocked",
			];
			const tasks: I_Tasks = {
				master: {
					tasks: statuses.map((status, index) =>
						createTask(index + 1, `Task ${status}`, status),
					),
					metadata: {
						created: new Date(),
						updated: new Date(),
						description: "",
					},
				},
			};

			const result = await tmai.listQuickAsync(tasks, "", true);
			const plainResult = stripAnsi(result);

			for (const status of statuses) {
				expect(plainResult).toContain(status);
			}
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
						createTask(1, "Task done", "done"),
						createTask(2, "Task in-progress", "in-progress"),
						createTask(3, "Task blocked", "blocked"),
						createTask(4, "Task pending", "pending"),
						createTask(5, "Task review", "review"),
						createTask(6, "Task deferred", "deferred"),
						createTask(7, "Task cancelled", "cancelled"),
						createTask(8, "Task todo", "todo"),
					],
					metadata: {
						created: new Date(),
						updated: new Date(),
						description: "",
					},
				},
			};

			const result1 = await tmai.listQuickAsync(
				tasks,
				"done,blocked,cancelled",
				true,
			);
			const plainResult1 = stripAnsi(result1);
			expect(plainResult1).toContain("Task done");
			expect(plainResult1).toContain("Task blocked");
			expect(plainResult1).toContain("Task cancelled");
			expect(plainResult1).not.toContain("Task in-progress");
			expect(plainResult1).not.toContain("Task pending");
			const result2 = await tmai.listQuickAsync(tasks, "review", true);
			const plainResult2 = stripAnsi(result2);
			expect(plainResult2).toContain("Task review");
			expect(plainResult2).not.toContain("Task done");
		});

		test("filters subtasks by status correctly", async () => {
			const tasks: I_Tasks = {
				master: {
					tasks: [
						createTask(1, "Parent Task", "todo", "medium", [
							createSubtask(1, "Subtask done", "done"),
							createSubtask(2, "Subtask blocked", "blocked"),
							createSubtask(3, "Subtask in-progress", "in-progress"),
							createSubtask(4, "Subtask review", "review"),
							createSubtask(5, "Subtask cancelled", "cancelled"),
						]),
					],
					metadata: {
						created: new Date(),
						updated: new Date(),
						description: "",
					},
				},
			};

			const result = await tmai.listQuickAsync(
				tasks,
				"done,blocked,cancelled",
				true,
			);
			const plainResult = stripAnsi(result);
			expect(plainResult).toContain("Parent Task");
			expect(plainResult).toContain("Subtask done");
			expect(plainResult).toContain("Subtask blocked");
			expect(plainResult).toContain("Subtask cancelled");
			expect(plainResult).not.toContain("Subtask in-progress");
			expect(plainResult).not.toContain("Subtask review");
		});

		test(`truncates long titles to ${MAX_TITLE_TRUNC_LENGTH} characters`, async () => {
			const longTitle =
				"This is a very long task title that is definitely longer than forty characters, I promise!";

			expect(longTitle.length).toBeGreaterThan(MAX_TITLE_TRUNC_LENGTH);

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

			const taskLine = plainResult
				.split("\n")
				.find((line) => line.includes("#1"));
			expect(taskLine).toBeDefined();

			if (taskLine) {
				const match = taskLine.match(/#1 (.+?) \[status:/);
				expect(match).not.toBeNull();

				if (match) {
					const titlePart = match[1];
					expect(titlePart.length).toBe(MAX_TITLE_TRUNC_LENGTH);
					expect(titlePart.endsWith("…")).toBe(true);
				}
			}
		});
	});

	describe("fixIdsAsync", () => {
		test("fixes sequential IDs", async () => {
			await tmai.fixIdsAsync();
		});
	});
});

describe("ID validation", () => {
	const mainIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const subtasksIDs = ["1.1", "1.2", "2.1", "3.5", "10.3"];

	describe("isValidTaskId", () => {
		test("valid ID", () => {
			const result = isValidTaskId("5", mainIDs);
			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBe("");
		});

		test("ID not in mainIDs", () => {
			const result = isValidTaskId("11", mainIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown task ID. Available IDs: ${mainIDs.join(", ")}`,
			);
		});

		test("non-numeric ID", () => {
			const result = isValidTaskId("abc", mainIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Please enter a valid integer");
		});

		test("decimal ID", () => {
			const result = isValidTaskId("5.5", mainIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Please enter a valid integer");
		});

		test("negative ID", () => {
			const result = isValidTaskId("-1", mainIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown task ID. Available IDs: ${mainIDs.join(", ")}`,
			);
		});

		test("empty ID", () => {
			const result = isValidHierarchicalTaskId("", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});
	});

	describe("isValidHierarchicalTaskId", () => {
		test("valid hierarchical ID", () => {
			const result = isValidHierarchicalTaskId("1.1", subtasksIDs);
			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBe("");
		});

		test("invalid format - missing dot", () => {
			const result = isValidHierarchicalTaskId("53", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});

		test("invalid format - multiple dots", () => {
			const result = isValidHierarchicalTaskId("5.3.1", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});

		test("non-numeric main ID", () => {
			const result = isValidHierarchicalTaskId("a.3", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});

		test("non-numeric subtask ID", () => {
			const result = isValidHierarchicalTaskId("5.b", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});

		test("empty ID", () => {
			const result = isValidHierarchicalTaskId("", subtasksIDs);
			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe(
				`Unknown subtask ID. Available IDs: ${subtasksIDs.join(", ")}`,
			);
		});
	});
});
