import * as SwitchPrimitive from "@radix-ui/react-switch"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Custom Switch that uses the requested colors:
 * - checked track:  #22c55e (green)
 * - unchecked track: #0f172a (dark)
 *
 * The component keeps the same API as Radix's Switch root so it can be used
 * as a drop-in replacement for the previous shadcn-style Switch.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // base track styles + explicit checked/unchecked colors
        // we use Tailwind arbitrary colors (bracket notation) for the exact hex values
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        // unchecked (default) track
        "data-[state=unchecked]:bg-[#0f172a]",
        // checked track
        "data-[state=checked]:bg-[#22c55e]",
        // focus ring (slightly translucent green)
        "focus-visible:ring-2 focus-visible:ring-[#22c55e]/30",
        // disabled behavior
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // thumb is white for best contrast against both tracks
          "block h-4 w-4 rounded-full bg-white shadow transform transition-transform",
          // slide to right when checked
          "data-[state=checked]:translate-x-[calc(100%-0.25rem)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
