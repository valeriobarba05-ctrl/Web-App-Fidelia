import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** shadcn Alert · stile rhea (preset b1LObiUpkf) + variante Fidelia "warning" (riscatto in attesa). */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:pr-20 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90",
        warning: "border-transparent bg-warning-soft text-warning *:data-[slot=alert-description]:text-warning",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("font-medium group-has-[>svg]/alert:col-start-2", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-sm text-balance text-muted-foreground group-has-[>svg]/alert:col-start-2 md:text-pretty", className)} {...props} />
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("absolute top-1/2 right-3 -translate-y-1/2", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
