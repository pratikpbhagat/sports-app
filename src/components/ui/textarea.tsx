import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // base styles
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
        "flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

        // border styles
        "border-[#0f172a]", // default border
        "hover:border-[#7c3aed]", // hover
        "focus-visible:border-[#7c3aed] focus-visible:ring-[#7c3aed]/50 focus-visible:ring-[1px]", // focus

        // transitions
        "transition-colors duration-200 ease-in-out",

        // invalid state
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }

