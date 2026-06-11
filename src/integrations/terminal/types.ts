import EventEmitter from "events"

export type DewTerminalProvider = "vscode" | "execa"

export interface DewTerminal {
	provider: DewTerminalProvider
	id: number
	busy: boolean
	running: boolean
	taskId?: string
	process?: DewTerminalProcess
	getCurrentWorkingDirectory(): string
	isClosed: () => boolean
	runCommand: (command: string, callbacks: DewTerminalCallbacks) => DewTerminalProcessResultPromise
	setActiveStream(stream: AsyncIterable<string> | undefined, pid?: number): void
	shellExecutionComplete(exitDetails: ExitCodeDetails): void
	getProcessesWithOutput(): DewTerminalProcess[]
	getUnretrievedOutput(): string
	getLastCommand(): string
	cleanCompletedProcessQueue(): void
}

export interface DewTerminalCallbacks {
	onLine: (line: string, process: DewTerminalProcess) => void
	onCompleted: (output: string | undefined, process: DewTerminalProcess) => void
	onShellExecutionStarted: (pid: number | undefined, process: DewTerminalProcess) => void
	onShellExecutionComplete: (details: ExitCodeDetails, process: DewTerminalProcess) => void
	onNoShellIntegration?: (message: string, process: DewTerminalProcess) => void
}

export interface DewTerminalProcess extends EventEmitter<DewTerminalProcessEvents> {
	command: string
	isHot: boolean
	run: (command: string) => Promise<void>
	continue: () => void
	abort: () => void
	hasUnretrievedOutput: () => boolean
	getUnretrievedOutput: () => string
}

export type DewTerminalProcessResultPromise = DewTerminalProcess & Promise<void>

export interface DewTerminalProcessEvents {
	line: [line: string]
	continue: []
	completed: [output?: string]
	stream_available: [stream: AsyncIterable<string>]
	shell_execution_started: [pid: number | undefined]
	shell_execution_complete: [exitDetails: ExitCodeDetails]
	error: [error: Error]
	no_shell_integration: [message: string]
}

export interface ExitCodeDetails {
	exitCode: number | undefined
	signal?: number | undefined
	signalName?: string
	coreDumpPossible?: boolean
}
