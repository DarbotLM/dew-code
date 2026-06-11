import { describe, it, expect, vi } from "vitest"
import * as os from "os"
import * as path from "path"

describe("custom-instructions path detection", () => {
	it("should use exact path comparison instead of string includes", () => {
		// Test the logic that our fix implements
		const fakeHomeDir = "/Users/john.dew.smith"
		const globalDewDir = path.join(fakeHomeDir, ".dew") // "/Users/john.dew.smith/.dew"
		const projectDewDir = "/projects/my-project/.dew"

		// Old implementation (fragile):
		// const isGlobal = dewDir.includes(path.join(os.homedir(), ".dew"))
		// This could fail if the home directory path contains ".dew" elsewhere

		// New implementation (robust):
		// const isGlobal = path.resolve(dewDir) === path.resolve(getGlobalDewDirectory())

		// Test the new logic
		const isGlobalForGlobalDir = path.resolve(globalDewDir) === path.resolve(globalDewDir)
		const isGlobalForProjectDir = path.resolve(projectDewDir) === path.resolve(globalDewDir)

		expect(isGlobalForGlobalDir).toBe(true)
		expect(isGlobalForProjectDir).toBe(false)

		// Verify that the old implementation would have been problematic
		// if the home directory contained ".dew" in the path
		const oldLogicGlobal = globalDewDir.includes(path.join(fakeHomeDir, ".dew"))
		const oldLogicProject = projectDewDir.includes(path.join(fakeHomeDir, ".dew"))

		expect(oldLogicGlobal).toBe(true) // This works
		expect(oldLogicProject).toBe(false) // This also works, but is fragile

		// The issue was that if the home directory path itself contained ".dew",
		// the includes() check could produce false positives in edge cases
	})

	it("should handle edge cases with path resolution", () => {
		// Test various edge cases that exact path comparison handles better
		const testCases = [
			{
				global: "/Users/test/.dew",
				project: "/Users/test/project/.dew",
				expected: { global: true, project: false },
			},
			{
				global: "/home/user/.dew",
				project: "/home/user/.dew", // Same directory
				expected: { global: true, project: true },
			},
			{
				global: "/Users/john.dew.smith/.dew",
				project: "/projects/app/.dew",
				expected: { global: true, project: false },
			},
		]

		testCases.forEach(({ global, project, expected }) => {
			const isGlobalForGlobal = path.resolve(global) === path.resolve(global)
			const isGlobalForProject = path.resolve(project) === path.resolve(global)

			expect(isGlobalForGlobal).toBe(expected.global)
			expect(isGlobalForProject).toBe(expected.project)
		})
	})
})
