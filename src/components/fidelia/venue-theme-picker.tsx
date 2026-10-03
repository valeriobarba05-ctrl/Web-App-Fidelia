import { RiCheckLine } from "@remixicon/react"

import { VENUE_THEMES } from "@/lib/themes"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

/** "Colori del locale": il ristoratore sceglie il primario, il resto del sistema segue. */
export function VenueThemePicker({ className }: { className?: string }) {
  const { venueTheme, setVenueTheme } = useStore()
  return (
    <div role="radiogroup" aria-label="Colori del locale" className={cn("flex flex-wrap gap-2", className)}>
      {VENUE_THEMES.map((t) => {
        const on = t.id === venueTheme
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={on}
            onClick={() => setVenueTheme(t.id)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-2xl border bg-background py-1 pr-3.5 pl-1.5 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
              on && "border-foreground",
            )}
          >
            <span className="flex size-7 items-center justify-center rounded-xl text-white" style={{ background: t.swatch }}>
              {on && <RiCheckLine className="size-4" />}
            </span>
            {t.name}
          </button>
        )
      })}
    </div>
  )
}
