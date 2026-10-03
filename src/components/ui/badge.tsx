import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-2xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        outline: "border-border text-foreground [a]:hover:bg-muted",
        destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        ghost: "hover:bg-muted hover:text-muted-foreground",
        /* Fidelia */
        highlight: "bg-highlight text-highlight-foreground",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        glass: "bg-white/88 text-stone-900 backdrop-blur-md",
      },
      size: { default: "", lg: "h-6 px-2.5 text-[13px] [&>svg]:size-3.5!" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
