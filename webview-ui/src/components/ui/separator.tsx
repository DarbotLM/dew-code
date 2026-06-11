import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Dewt>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Dewt>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
	<SeparatorPrimitive.Dewt
		ref={ref}
		decorative={decorative}
		orientation={orientation}
		className={cn(
			"shrink-0 bg-vscode-editor-background my-5",
			orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
			className,
		)}
		{...props}
	/>
))
Separator.displayName = SeparatorPrimitive.Dewt.displayName

export { Separator }
