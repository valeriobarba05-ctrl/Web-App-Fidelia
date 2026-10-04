import * as React from "react"
import { RiArrowLeftLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Intestazione di pagina: titolo grande, sottotitolo, azioni; back opzionale. */
export function PageHeader({
  title,
  description,
  onBack,
  actions,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn("mx-auto flex w-full max-w-6xl items-end gap-3 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 sm:px-6 lg:px-10 lg:pt-10", className)}>
      {onBack && (
        <Button variant="secondary" size="icon-xl" className="mb-0.5 rounded-full" aria-label="Indietro" onClick={onBack}>
          <RiArrowLeftLine />
        </Button>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="font-heading text-[28px] leading-tight font-semibold tracking-[-0.02em] lg:text-[34px]">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}

export function PageBody({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-10", className)} {...props} />
}

export function SectionTitle({ children, action, id }: { children: React.ReactNode; action?: React.ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <h2 id={id} className="font-heading text-lg font-semibold tracking-[-0.01em]">
        {children}
      </h2>
      {action}
    </div>
  )
}
