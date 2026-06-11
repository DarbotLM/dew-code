import * as vscode from "vscode"

/**
 * Get the User-Agent string for API requests
 * @param context Optional extension context for more accurate version detection
 * @returns User-Agent string in format "dew-code {version}"
 */
export function getUserAgent(context?: vscode.ExtensionContext): string {
	return `dew-code ${context?.extension?.packageJSON?.version || "unknown"}`
}
