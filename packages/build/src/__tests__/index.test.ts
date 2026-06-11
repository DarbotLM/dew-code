// npx vitest run src/__tests__/index.test.ts

import { generatePackageJson } from "../index.js"

describe("generatePackageJson", () => {
	it("should be a test", () => {
		const generatedPackageJson = generatePackageJson({
			packageJson: {
				name: "dew-coder",
				displayName: "%extension.displayName%",
				description: "%extension.description%",
				publisher: "darbotlm",
				version: "3.17.2",
				icon: "assets/icons/icon.png",
				contributes: {
					viewsContainers: {
						activitybar: [
							{
								id: "dew-coder-ActivityBar",
								title: "%views.activitybar.title%",
								icon: "assets/icons/icon.svg",
							},
						],
					},
					views: {
						"dew-coder-ActivityBar": [
							{
								type: "webview",
								id: "dew-coder.SidebarProvider",
								name: "",
							},
						],
					},
					commands: [
						{
							command: "dew-coder.plusButtonClicked",
							title: "%command.newTask.title%",
							icon: "$(add)",
						},
						{
							command: "dew-coder.openInNewTab",
							title: "%command.openInNewTab.title%",
							category: "%configuration.title%",
						},
					],
					menus: {
						"editor/context": [
							{
								submenu: "dew-coder.contextMenu",
								group: "navigation",
							},
						],
						"dew-coder.contextMenu": [
							{
								command: "dew-coder.addToContext",
								group: "1_actions@1",
							},
						],
						"editor/title": [
							{
								command: "dew-coder.plusButtonClicked",
								group: "navigation@1",
								when: "activeWebviewPanelId == dew-coder.TabPanelProvider",
							},
							{
								command: "dew-coder.settingsButtonClicked",
								group: "navigation@6",
								when: "activeWebviewPanelId == dew-coder.TabPanelProvider",
							},
							{
								command: "dew-coder.accountButtonClicked",
								group: "navigation@6",
								when: "activeWebviewPanelId == dew-coder.TabPanelProvider",
							},
						],
					},
					submenus: [
						{
							id: "dew-coder.contextMenu",
							label: "%views.contextMenu.label%",
						},
						{
							id: "dew-coder.terminalMenu",
							label: "%views.terminalMenu.label%",
						},
					],
					configuration: {
						title: "%configuration.title%",
						properties: {
							"dew-coder.allowedCommands": {
								type: "array",
								items: {
									type: "string",
								},
								default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
								description: "%commands.allowedCommands.description%",
							},
							"dew-coder.customStoragePath": {
								type: "string",
								default: "",
								description: "%settings.customStoragePath.description%",
							},
						},
					},
				},
				scripts: {
					lint: "eslint **/*.ts",
				},
			},
			overrideJson: {
				name: "dew-code-nightly",
				displayName: "Dew-Coder Nightly",
				publisher: "darbotlm",
				version: "0.0.1",
				icon: "assets/icons/icon-nightly.png",
				scripts: {},
			},
			substitution: ["dew-coder", "dew-code-nightly"],
		})

		expect(generatedPackageJson).toStrictEqual({
			name: "dew-code-nightly",
			displayName: "Dew-Coder Nightly",
			description: "%extension.description%",
			publisher: "darbotlm",
			version: "0.0.1",
			icon: "assets/icons/icon-nightly.png",
			contributes: {
				viewsContainers: {
					activitybar: [
						{
							id: "dew-code-nightly-ActivityBar",
							title: "%views.activitybar.title%",
							icon: "assets/icons/icon.svg",
						},
					],
				},
				views: {
					"dew-code-nightly-ActivityBar": [
						{
							type: "webview",
							id: "dew-code-nightly.SidebarProvider",
							name: "",
						},
					],
				},
				commands: [
					{
						command: "dew-code-nightly.plusButtonClicked",
						title: "%command.newTask.title%",
						icon: "$(add)",
					},
					{
						command: "dew-code-nightly.openInNewTab",
						title: "%command.openInNewTab.title%",
						category: "%configuration.title%",
					},
				],
				menus: {
					"editor/context": [
						{
							submenu: "dew-code-nightly.contextMenu",
							group: "navigation",
						},
					],
					"dew-code-nightly.contextMenu": [
						{
							command: "dew-code-nightly.addToContext",
							group: "1_actions@1",
						},
					],
					"editor/title": [
						{
							command: "dew-code-nightly.plusButtonClicked",
							group: "navigation@1",
							when: "activeWebviewPanelId == dew-code-nightly.TabPanelProvider",
						},
						{
							command: "dew-code-nightly.settingsButtonClicked",
							group: "navigation@6",
							when: "activeWebviewPanelId == dew-code-nightly.TabPanelProvider",
						},
						{
							command: "dew-code-nightly.accountButtonClicked",
							group: "navigation@6",
							when: "activeWebviewPanelId == dew-code-nightly.TabPanelProvider",
						},
					],
				},
				submenus: [
					{
						id: "dew-code-nightly.contextMenu",
						label: "%views.contextMenu.label%",
					},
					{
						id: "dew-code-nightly.terminalMenu",
						label: "%views.terminalMenu.label%",
					},
				],
				configuration: {
					title: "%configuration.title%",
					properties: {
						"dew-code-nightly.allowedCommands": {
							type: "array",
							items: {
								type: "string",
							},
							default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
							description: "%commands.allowedCommands.description%",
						},
						"dew-code-nightly.customStoragePath": {
							type: "string",
							default: "",
							description: "%settings.customStoragePath.description%",
						},
					},
				},
			},
			scripts: {},
		})
	})
})
