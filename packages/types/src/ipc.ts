import { z } from "zod"

import { clineMessageSchema, tokenUsageSchema } from "./message.js"
import { toolNamesSchema, toolUsageSchema } from "./tool.js"
import { dewCodeSettingsSchema } from "./global-settings.js"

/**
 * isSubtaskSchema
 */
export const isSubtaskSchema = z.object({
	isSubtask: z.boolean(),
})
export type IsSubtask = z.infer<typeof isSubtaskSchema>

/**
 * DewCodeEvent
 */

export enum DewCodeEventName {
	Message = "message",
	TaskCreated = "taskCreated",
	TaskStarted = "taskStarted",
	TaskModeSwitched = "taskModeSwitched",
	TaskPaused = "taskPaused",
	TaskUnpaused = "taskUnpaused",
	TaskAskResponded = "taskAskResponded",
	TaskAborted = "taskAborted",
	TaskSpawned = "taskSpawned",
	TaskCompleted = "taskCompleted",
	TaskTokenUsageUpdated = "taskTokenUsageUpdated",
	TaskToolFailed = "taskToolFailed",
	EvalPass = "evalPass",
	EvalFail = "evalFail",
}

export const dewCodeEventsSchema = z.object({
	[DewCodeEventName.Message]: z.tuple([
		z.object({
			taskId: z.string(),
			action: z.union([z.literal("created"), z.literal("updated")]),
			message: clineMessageSchema,
		}),
	]),
	[DewCodeEventName.TaskCreated]: z.tuple([z.string()]),
	[DewCodeEventName.TaskStarted]: z.tuple([z.string()]),
	[DewCodeEventName.TaskModeSwitched]: z.tuple([z.string(), z.string()]),
	[DewCodeEventName.TaskPaused]: z.tuple([z.string()]),
	[DewCodeEventName.TaskUnpaused]: z.tuple([z.string()]),
	[DewCodeEventName.TaskAskResponded]: z.tuple([z.string()]),
	[DewCodeEventName.TaskAborted]: z.tuple([z.string()]),
	[DewCodeEventName.TaskSpawned]: z.tuple([z.string(), z.string()]),
	[DewCodeEventName.TaskCompleted]: z.tuple([z.string(), tokenUsageSchema, toolUsageSchema, isSubtaskSchema]),
	[DewCodeEventName.TaskTokenUsageUpdated]: z.tuple([z.string(), tokenUsageSchema]),
	[DewCodeEventName.TaskToolFailed]: z.tuple([z.string(), toolNamesSchema, z.string()]),
})

export type DewCodeEvents = z.infer<typeof dewCodeEventsSchema>

/**
 * Ack
 */

export const ackSchema = z.object({
	clientId: z.string(),
	pid: z.number(),
	ppid: z.number(),
})

export type Ack = z.infer<typeof ackSchema>

/**
 * TaskCommand
 */

export enum TaskCommandName {
	StartNewTask = "StartNewTask",
	CancelTask = "CancelTask",
	CloseTask = "CloseTask",
}

export const taskCommandSchema = z.discriminatedUnion("commandName", [
	z.object({
		commandName: z.literal(TaskCommandName.StartNewTask),
		data: z.object({
			configuration: dewCodeSettingsSchema,
			text: z.string(),
			images: z.array(z.string()).optional(),
			newTab: z.boolean().optional(),
		}),
	}),
	z.object({
		commandName: z.literal(TaskCommandName.CancelTask),
		data: z.string(),
	}),
	z.object({
		commandName: z.literal(TaskCommandName.CloseTask),
		data: z.string(),
	}),
])

export type TaskCommand = z.infer<typeof taskCommandSchema>

/**
 * TaskEvent
 */

export const taskEventSchema = z.discriminatedUnion("eventName", [
	z.object({
		eventName: z.literal(DewCodeEventName.Message),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.Message],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskCreated),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskCreated],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskStarted),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskStarted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskModeSwitched),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskModeSwitched],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskPaused),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskPaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskUnpaused),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskUnpaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskAskResponded),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskAskResponded],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskAborted),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskAborted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskSpawned),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskSpawned],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskCompleted),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskCompleted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskTokenUsageUpdated),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskTokenUsageUpdated],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.TaskToolFailed),
		payload: dewCodeEventsSchema.shape[DewCodeEventName.TaskToolFailed],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.EvalPass),
		payload: z.undefined(),
		taskId: z.number(),
	}),
	z.object({
		eventName: z.literal(DewCodeEventName.EvalFail),
		payload: z.undefined(),
		taskId: z.number(),
	}),
])

export type TaskEvent = z.infer<typeof taskEventSchema>

/**
 * IpcMessage
 */

export enum IpcMessageType {
	Connect = "Connect",
	Disconnect = "Disconnect",
	Ack = "Ack",
	TaskCommand = "TaskCommand",
	TaskEvent = "TaskEvent",
}

export enum IpcOrigin {
	Client = "client",
	Server = "server",
}

export const ipcMessageSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal(IpcMessageType.Ack),
		origin: z.literal(IpcOrigin.Server),
		data: ackSchema,
	}),
	z.object({
		type: z.literal(IpcMessageType.TaskCommand),
		origin: z.literal(IpcOrigin.Client),
		clientId: z.string(),
		data: taskCommandSchema,
	}),
	z.object({
		type: z.literal(IpcMessageType.TaskEvent),
		origin: z.literal(IpcOrigin.Server),
		relayClientId: z.string().optional(),
		data: taskEventSchema,
	}),
])

export type IpcMessage = z.infer<typeof ipcMessageSchema>

/**
 * Client
 */

export type IpcClientEvents = {
	[IpcMessageType.Connect]: []
	[IpcMessageType.Disconnect]: []
	[IpcMessageType.Ack]: [data: Ack]
	[IpcMessageType.TaskCommand]: [data: TaskCommand]
	[IpcMessageType.TaskEvent]: [data: TaskEvent]
}

/**
 * Server
 */

export type IpcServerEvents = {
	[IpcMessageType.Connect]: [clientId: string]
	[IpcMessageType.Disconnect]: [clientId: string]
	[IpcMessageType.TaskCommand]: [clientId: string, data: TaskCommand]
	[IpcMessageType.TaskEvent]: [relayClientId: string | undefined, data: TaskEvent]
}
