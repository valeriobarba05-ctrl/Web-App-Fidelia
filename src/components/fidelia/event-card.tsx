import { RiCalendarCheckLine, RiSparkling2Line, RiTimeLine } from "@remixicon/react"

import { EVENT_ICON, EventArt } from "@/components/fidelia/event-art"
import { Badge } from "@/components/ui/badge"
import { eventDate } from "@/lib/format"
import type { FideliaEvent } from "@/types"
import { cn } from "@/lib/utils"

/** Card evento a tutta immagine; è un bottone: apre la prenotazione. */
export function EventCard({
  event,
  booked,
  onOpen,
  tall,
  className,
}: {
  event: FideliaEvent
  booked?: number
  onOpen?: () => void
  tall?: boolean
  className?: string
}) {
  const Icon = EVENT_ICON[event.type]
  const d = eventDate(event.date)
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group/event relative isolate flex w-full flex-col justify-end overflow-hidden rounded-[24px] text-left text-white shadow-[0_14px_34px_-16px_rgb(12_10_9/0.6)] outline-none transition-transform duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]",
        tall ? "min-h-[320px]" : "min-h-[240px]",
        className,
      )}
    >
      <EventArt type={event.type} image={event.image} />
      <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="glass" size="lg">
            <Icon /> {event.typeLabel}
          </Badge>
          {booked ? (
            <Badge variant="highlight" size="lg">
              <RiCalendarCheckLine /> Prenotato · {booked}
            </Badge>
          ) : null}
        </div>
        <div className="flex min-w-[54px] flex-col items-center rounded-2xl bg-white/90 px-2 py-1.5 text-stone-900 backdrop-blur-md">
          <span className="font-heading text-xl leading-none font-bold tabular">{d.day}</span>
          <span className="text-[11px] font-semibold uppercase">{d.month}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5 pt-20">
        <h3 className="font-heading text-[24px] leading-tight font-semibold tracking-[-0.01em] [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]">{event.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-white/90">
          <span className="flex items-center gap-1.5">
            <RiTimeLine className="size-4" /> {d.weekday} · {event.time}
          </span>
          <span className="flex items-center gap-1.5 text-highlight">
            <RiSparkling2Line className="size-4" /> +{event.bonusPoints} punti
          </span>
        </div>
      </div>
    </button>
  )
}
