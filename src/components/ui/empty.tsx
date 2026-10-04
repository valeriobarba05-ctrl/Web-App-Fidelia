import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-4xl border border-dashed p-8 text-center text-balance", className)}
      {...props}
    />
  )
}
function EmptyMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground [&_svg]:size-6", className)} {...props} />
}
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-heading text-base font-semibold", className)} {...props} />
}
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("max-w-xs text-sm text-muted-foreground", className)} {...props} />
}

export { Empty, EmptyMedia, EmptyTitle, EmptyDescription }
