"use server"

import { getModelId, dewCodeSettingsSchema } from "@dew-code/types"
import { getRuns, getLanguageScores } from "@dew-code/evals"

import { formatScore } from "@/lib"

export async function getEvalRuns() {
	const languageScores = await getLanguageScores()

	const runs = (await getRuns())
		.filter((run) => !!run.taskMetrics)
		.filter(({ settings }) => dewCodeSettingsSchema.safeParse(settings).success)
		.sort((a, b) => b.passed - a.passed)
		.map((run) => {
			const settings = dewCodeSettingsSchema.parse(run.settings)

			return {
				...run,
				label: run.description || run.model,
				score: formatScore(run.passed / (run.passed + run.failed)),
				languageScores: languageScores[run.id],
				taskMetrics: run.taskMetrics!,
				modelId: getModelId(settings),
			}
		})

	return runs
}
