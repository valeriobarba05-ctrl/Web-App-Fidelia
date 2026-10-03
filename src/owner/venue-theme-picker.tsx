import { RiCheckLine, RiShieldCheckLine } from "@remixicon/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { THEME_PRESETS } from "@/lib/themes"
import { useVenue, useVenueAdmin } from "@/lib/venue"
import { cn } from "@/lib/utils"

/**
 * Colori del locale (solo titolare): un preset o due colori liberi.
 * Il generatore corregge la luminosità, quindi ogni scelta resta leggibile.
 */
export function VenueThemePicker({ className, custom = true }: { className?: string; custom?: boolean }) {
  const { venue } = useVenue()
  const { updateVenue } = useVenueAdmin()
  const current = THEME_PRESETS.find((t) => t.brand === venue.brandColor && t.highlight === venue.highlightColor)
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div role="radiogroup" aria-label="Colori del locale" className="flex flex-wrap gap-2">
        {THEME_PRESETS.map((t) => {
          const on = t.id === current?.id
          return (
            <button
              key={t.id}
              role="radio"
              aria-checked={on}
              onClick={() => updateVenue({ brandColor: t.brand, highlightColor: t.highlight })}
              className={cn(
                "flex h-10 items-center gap-2 rounded-2xl border bg-background py-1 pr-3.5 pl-1.5 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
                on && "border-foreground",
              )}
            >
              <span className="relative flex size-7 items-center justify-center overflow-hidden rounded-xl text-white" style={{ background: t.brand }}>
                <span className="absolute right-0 bottom-0 size-3 rounded-tl-md" style={{ background: t.highlight }} />
                {on && <RiCheckLine className="relative size-4" />}
              </span>
              {t.name}
            </button>
          )
        })}
      </div>
      {custom && (
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["brandColor", "Colore del locale", "Tessera, bottoni, link"],
              ["highlightColor", "Colore dei punti", "Saldo, bonus, tessera nella barra"],
            ] as const
          ).map(([key, label, hint]) => (
            <div key={key} className="flex flex-col gap-2">
              <Label htmlFor={key}>{label}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label={`${label}: selettore`}
                  value={venue[key]}
                  onChange={(e) => updateVenue({ [key]: e.target.value })}
                  className="size-10 shrink-0 cursor-pointer rounded-2xl border bg-background p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                />
                <Input
                  id={key}
                  key={venue[key]}
                  defaultValue={venue[key]}
                  onChange={(e) => /^#[0-9a-f]{6}$/i.test(e.target.value) && updateVenue({ [key]: e.target.value })}
                  className="font-mono uppercase"
                  maxLength={7}
                />
              </div>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </div>
          ))}
          <p className="flex items-center gap-2 text-xs text-success sm:col-span-2">
            <RiShieldCheckLine className="size-4 shrink-0" />
            Qualsiasi colore scegli, l'app regola chiaro e scuro per mantenere i testi leggibili.
          </p>
        </div>
      )}
    </div>
  )
}
