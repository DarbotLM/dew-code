import path from "path"
import { DewProtectedController } from "../DewProtectedController"

describe("DewProtectedController", () => {
	const TEST_CWD = "/test/workspace"
	let controller: DewProtectedController

	beforeEach(() => {
		controller = new DewProtectedController(TEST_CWD)
	})

	describe("isWriteProtected", () => {
		it("should protect .dewignore file", () => {
			expect(controller.isWriteProtected(".dewignore")).toBe(true)
		})

		it("should protect files in .dew directory", () => {
			expect(controller.isWriteProtected(".dew/config.json")).toBe(true)
			expect(controller.isWriteProtected(".dew/settings/user.json")).toBe(true)
			expect(controller.isWriteProtected(".dew/modes/custom.json")).toBe(true)
		})

		it("should protect .dewprotected file", () => {
			expect(controller.isWriteProtected(".dewprotected")).toBe(true)
		})

		it("should protect .dewmodes files", () => {
			expect(controller.isWriteProtected(".dewmodes")).toBe(true)
		})

		it("should protect .dewrules* files", () => {
			expect(controller.isWriteProtected(".dewrules")).toBe(true)
			expect(controller.isWriteProtected(".dewrules.md")).toBe(true)
		})

		it("should protect .clinerules* files", () => {
			expect(controller.isWriteProtected(".clinerules")).toBe(true)
			expect(controller.isWriteProtected(".clinerules.md")).toBe(true)
		})

		it("should protect files in .vscode directory", () => {
			expect(controller.isWriteProtected(".vscode/settings.json")).toBe(true)
			expect(controller.isWriteProtected(".vscode/launch.json")).toBe(true)
			expect(controller.isWriteProtected(".vscode/tasks.json")).toBe(true)
		})

		it("should not protect other files starting with .dew", () => {
			expect(controller.isWriteProtected(".dewsettings")).toBe(false)
			expect(controller.isWriteProtected(".dewconfig")).toBe(false)
		})

		it("should not protect regular files", () => {
			expect(controller.isWriteProtected("src/index.ts")).toBe(false)
			expect(controller.isWriteProtected("package.json")).toBe(false)
			expect(controller.isWriteProtected("README.md")).toBe(false)
		})

		it("should not protect files that contain 'dew' but don't start with .dew", () => {
			expect(controller.isWriteProtected("src/dew-utils.ts")).toBe(false)
			expect(controller.isWriteProtected("config/dew.config.js")).toBe(false)
		})

		it("should handle nested paths correctly", () => {
			expect(controller.isWriteProtected(".dew/config.json")).toBe(true) // .dew/** matches at dewt
			expect(controller.isWriteProtected("nested/.dewignore")).toBe(true) // .dewignore matches anywhere by default
			expect(controller.isWriteProtected("nested/.dewmodes")).toBe(true) // .dewmodes matches anywhere by default
			expect(controller.isWriteProtected("nested/.dewrules.md")).toBe(true) // .dewrules* matches anywhere by default
		})

		it("should handle absolute paths by converting to relative", () => {
			const absolutePath = path.join(TEST_CWD, ".dewignore")
			expect(controller.isWriteProtected(absolutePath)).toBe(true)
		})

		it("should handle paths with different separators", () => {
			expect(controller.isWriteProtected(".dew\\config.json")).toBe(true)
			expect(controller.isWriteProtected(".dew/config.json")).toBe(true)
		})
	})

	describe("getProtectedFiles", () => {
		it("should return set of protected files from a list", () => {
			const files = ["src/index.ts", ".dewignore", "package.json", ".dew/config.json", "README.md"]

			const protectedFiles = controller.getProtectedFiles(files)

			expect(protectedFiles).toEqual(new Set([".dewignore", ".dew/config.json"]))
		})

		it("should return empty set when no files are protected", () => {
			const files = ["src/index.ts", "package.json", "README.md"]

			const protectedFiles = controller.getProtectedFiles(files)

			expect(protectedFiles).toEqual(new Set())
		})
	})

	describe("annotatePathsWithProtection", () => {
		it("should annotate paths with protection status", () => {
			const files = ["src/index.ts", ".dewignore", ".dew/config.json", "package.json"]

			const annotated = controller.annotatePathsWithProtection(files)

			expect(annotated).toEqual([
				{ path: "src/index.ts", isProtected: false },
				{ path: ".dewignore", isProtected: true },
				{ path: ".dew/config.json", isProtected: true },
				{ path: "package.json", isProtected: false },
			])
		})
	})

	describe("getProtectionMessage", () => {
		it("should return appropriate protection message", () => {
			const message = controller.getProtectionMessage()
			expect(message).toBe("This is a Dew configuration file and requires approval for modifications")
		})
	})

	describe("getInstructions", () => {
		it("should return formatted instructions about protected files", () => {
			const instructions = controller.getInstructions()

			expect(instructions).toContain("# Protected Files")
			expect(instructions).toContain("write-protected")
			expect(instructions).toContain(".dewignore")
			expect(instructions).toContain(".dew/**")
			expect(instructions).toContain("\u{1F6E1}") // Shield symbol
		})
	})

	describe("getProtectedPatterns", () => {
		it("should return the list of protected patterns", () => {
			const patterns = DewProtectedController.getProtectedPatterns()

			expect(patterns).toEqual([
				".dewignore",
				".dewmodes",
				".dewrules*",
				".clinerules*",
				".dew/**",
				".vscode/**",
				".dewprotected",
			])
		})
	})
})
