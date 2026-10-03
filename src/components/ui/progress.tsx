import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-2xl bg-muted", className)} {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 rounded-2xl bg-primary transition-transform duration-700 ease-(--ease-out-expo)", indicatorClassName)}
        style={{ transform: `translateX(-${100 - Math.max(0, Math.min(100, value || 0))}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
