import { RiGoblet2Line, RiMicLine, RiMusic2Line, RiSparkling2Line } from "@remixicon/react"

import { EVENT_ART, type EventType } from "@/lib/data"
import { cn } from "@/lib/utils"

export const EVENT_ICON = { karaoke: RiMicLine, live: RiMusic2Line, degustazione: RiGoblet2Line, natale: RiSparkling2Line } as const

export function EventArt({ type, className, scrim = true }: { type: EventType; className?: string; scrim?: boolean }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <img src={EVENT_ART[type]} alt="" className="absolute inset-0 size-full scale-105 object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover/event:scale-110" />
      {scrim && <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(12_10_9/0.88),rgb(12_10_9/0.45)_55%,rgb(12_10_9/0.08))]" />}
    </div>
  )
}
