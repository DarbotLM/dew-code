"use client"

import { useTheme } from "next-themes"

export function useLogoSrc(): string {
	const { resolvedTheme } = useTheme()
	return resolvedTheme === "light" ? "/dew-code-Logo-Horiz-blk.svg" : "/dew-code-Logo-Horiz-white.svg"
}
