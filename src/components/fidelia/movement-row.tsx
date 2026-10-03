import { RiArrowDownLine, RiArrowUpLine, RiGift2Line, RiSparkling2Line } from "@remixicon/react"

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { fmtMovementDate, type Movement } from "@/lib/data"
import { cn } from "@/lib/utils"

const ICON = { visit: RiArrowUpLine, bonus: RiSparkling2Line, gift: RiGift2Line, redeem: RiArrowDownLine }

export function MovementRow({ m, className }: { m: Movement; className?: string }) {
  const Icon = ICON[m.kind]
  const plus = m.points > 0
  return (
    <Item size="sm" role="listitem" className={cn("animate-rise", className)}>
      <ItemMedia variant="icon" className={cn(plus ? "bg-success-soft text-success" : "bg-muted text-muted-foreground", m.kind === "bonus" && "bg-highlight/25 text-warning")}>
        <Icon />
      </ItemMedia>
      <ItemContent className="gap-0.5">
        <ItemTitle>{m.label}</ItemTitle>
        <ItemDescription className="text-xs">{fmtMovementDate(m.date)}</ItemDescription>
      </ItemContent>
      <span className={cn("font-heading text-base font-semibold tabular", plus ? "text-success" : "text-foreground")}>
        {plus ? "+" : "−"}
        {Math.abs(m.points)}
      </span>
    </Item>
  )
}
