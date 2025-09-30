import { cn } from "@/lib/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base styles
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
        "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

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
  );
}

export { Input };

