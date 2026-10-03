import * as React from "react"
import { RiArrowDownSLine } from "@remixicon/react"

import { cn } from "@/lib/utils"

function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(
          "h-10 w-full appearance-none rounded-2xl border border-transparent bg-input/50 pr-9 pl-3 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 md:text-sm dark:bg-input/30 [&>option]:bg-card [&>option]:text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <RiArrowDownSLine aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { NativeSelect }
