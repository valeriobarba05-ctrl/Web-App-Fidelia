import { RiGoblet2Line, RiMicLine, RiMusic2Line, RiSparkling2Line } from "@remixicon/react"

import type { EventType } from "@/types"

import { cn } from "@/lib/utils"

/** Illustrazioni predefinite per tipo di evento (public/events). */
export const EVENT_ART: Record<EventType, string> = {
  karaoke: "./events/karaoke.svg",
  natale: "./events/natale.svg",
  live: "./events/live.svg",
  degustazione: "./events/degustazione.svg",
}

export const EVENT_ICON = { karaoke: RiMicLine, live: RiMusic2Line, degustazione: RiGoblet2Line, natale: RiSparkling2Line } as const

export function EventArt({ type, image, className, scrim = true }: { type: EventType; image?: string; className?: string; scrim?: boolean }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <img src={image || EVENT_ART[type]} alt="" className="absolute inset-0 size-full scale-105 object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover/event:scale-110" />
      {scrim && <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.9),rgb(0_0_0/0.55)_55%,rgb(0_0_0/0.2))]" />}
    </div>
  )
}
