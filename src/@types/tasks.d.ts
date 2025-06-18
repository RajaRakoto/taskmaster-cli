export interface I_Tasks {
	master: Master;
}

export interface Master {
	tasks: Task[];
	metadata: Metadata;
}

export interface Metadata {
	created: Date;
	updated: Date;
	description: string;
}

export interface Task {
	id: number;
	title: string;
	description: string;
	details: string;
	testStrategy: string;
	priority: Priority;
	dependencies: number[];
	status: Status;
	subtasks: Subtask[];
}

export enum Priority {
	High = "high",
	Low = "low",
	Medium = "medium",
}

export enum Status {
	Pending = "pending",
}

export interface Subtask {
	id: number;
	title: string;
	description: string;
	dependencies: number[];
	details: string;
	status: Status;
}
