import * as React from "react"

import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { Progress } from "@/components/ui/progress"
import { nextPrize, useStore } from "@/lib/store"
import { cn, fmtPoints } from "@/lib/utils"

export function VenueMark({ className }: { className?: string }) {
  const { venue } = useStore()
  if (venue.logo)
    return <img src={venue.logo} alt="" className={cn("size-10 shrink-0 rounded-2xl bg-white object-cover", className)} />
  return (
    <span
      aria-hidden
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl bg-highlight font-heading text-sm font-bold text-highlight-foreground", className)}
    >
      {venue.initials}
    </span>
  )
}

/**
 * La tessera: un biglietto con due tacche laterali e una perforazione.
 * Sopra il taglio l'identità e il saldo, sotto il taglio cosa fare adesso.
 */
export function LoyaltyCard({
  children,
  className,
  cut = 172,
}: {
  children?: React.ReactNode
  className?: string
  cut?: number
}) {
  const { user, venue, visible } = useStore()
  const next = nextPrize(visible.prizes, user.points)
  return (
    <div
      className={cn("ticket-notch relative isolate overflow-hidden rounded-[24px] bg-brand text-brand-foreground shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--brand)_70%,black)] dark:ring-1 dark:ring-white/10", className)}
      style={{ ["--ticket-cut" as string]: `${cut}px` }}
    >
      {/* monogramma in filigrana */}
      <span aria-hidden className="pointer-events-none absolute -top-6 -right-3 -z-10 font-heading text-[150px] leading-none font-black tracking-[-0.06em] opacity-[0.07] select-none">
        {venue.initials}
      </span>

      <div className="flex flex-col gap-5 px-5 pt-5" style={{ height: cut }}>
        <div className="flex items-center gap-3">
          <VenueMark />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-heading text-[15px] font-semibold">{venue.name}</span>
            <span className="truncate text-xs opacity-85">
              {user.firstName} {user.lastName} · {user.cardCode}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium opacity-85">Saldo punti</span>
            <PointsOdometer value={user.points} className="text-[52px] text-highlight" />
          </div>
          {next && (
            <div className="mb-1 flex max-w-[48%] flex-col items-end gap-1.5 text-right">
              <span className="text-xs opacity-90">
                Ti mancano <strong className="font-semibold">{fmtPoints(next.cost - user.points)}</strong> per
              </span>
              <span className="truncate text-sm font-semibold">{next.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* perforazione */}
      <div aria-hidden className="mx-5 border-t-2 border-dashed border-current opacity-30" />

      <div className="px-5 pt-4 pb-5">
        {children ?? (
          next && (
            <Progress
              value={(user.points / next.cost) * 100}
              aria-label={`Progresso verso ${next.name}`}
              className="h-2 bg-white/20"
              indicatorClassName="bg-highlight"
            />
          )
        )}
      </div>
    </div>
  )
}
