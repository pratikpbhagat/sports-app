"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

type RadixProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

function Switch({ className, checked, ...props }: RadixProps) {
  // If the component is used as a controlled component (checked !== undefined)
  // we set an inline backgroundColor to avoid Tailwind purge issues and ensure
  // the exact hex colors are used.
  const inlineTrackStyle =
    typeof checked === "boolean"
      ? { backgroundColor: checked ? "#22c55e" : "#7c3aed" }
      : undefined;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      // apply inline style only when controlled, otherwise fall back to Tailwind/data-attrs
      style={inlineTrackStyle}
      className={cn(
        // base track
        "peer inline-flex h-[1.4rem] w-9 shrink-0 items-center rounded-full transition-all outline-none",
        "w-12 px-1",
        "data-[state=unchecked]:bg-[#7c3aed]",
        "data-[state=checked]:bg-[#22c55e]",
        "focus-visible:ring-2 focus-visible:ring-[#7c3aed]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      // keep checked prop passed through for controlled usage
      checked={checked}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // thumb styling: white with small border to pop on either track
          "block h-4 w-4 rounded-full bg-white shadow transform transition-transform",
          // translate to the right when checked. We calculated travel distance = 20px
          "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-[20px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

